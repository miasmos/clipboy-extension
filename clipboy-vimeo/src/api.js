const fs = cep_node.require('fs');
const util = cep_node.require('util');
const existsAsync = util.promisify(fs.exists);
const writeFileAsync = util.promisify(fs.writeFile);

const getVideo = url =>
    fetch(url)
        .then(response => {
            const reader = response.body.getReader();
            return new ReadableStream({
                start(controller) {
                    function pump() {
                        return reader.read().then(({ done, value }) => {
                            if (done) {
                                controller.close();
                                return;
                            }
                            controller.enqueue(value);
                            return pump();
                        });
                    }
                    return pump();
                }
            });
        })
        .then(stream => new Response(stream))
        .then(response => response.arrayBuffer());

export const writeVideo = async (url, path, id) => {
    const filePath = `${path}${id}.mp4`;
    const exists = await existsAsync(filePath);
    if (exists) {
        return;
    }
    const buffer = await getVideo(url);
    const payload = new Uint8Array(buffer);

    try {
        await writeFileAsync(filePath, payload);
    } catch {
        throw new Error(`Writing to ${filePath} failed`);
    }
};

export const getVideoInfo = async id => {
    const response = await fetch(`https://player.vimeo.com/video/${id}/config`);
    const json = await response.json();
    const {
        view,
        request: { files: { progressive = [] } = {} } = {},
        video: { thumbs, duration, title, url, owner: { name } = {} } = {}
    } = json;

    if (view === 7) {
        throw new Error('error.vimeo.dne');
    } else if (view !== 1) {
        throw new Error('error.generic');
    }

    const sortedThumbs = Object.entries(thumbs).sort(([keyA], [keyB]) => {
        const valueA = parseInt(keyA);
        const valueB = parseInt(keyB);
        if (isNaN(valueA)) {
            return 1;
        } else if (isNaN(valueB)) {
            return -1;
        } else {
            return valueA < valueB ? 1 : -1;
        }
    });
    const thumbnail = sortedThumbs.length > 0 ? sortedThumbs[0][1] : undefined;
    const video = progressive
        .map(payload => getVideoLabel(payload))
        .sort(({ sort: sortA }, { sort: sortB }) => (sortA < sortB ? 1 : -1));
    const videoMap = progressive.reduce((prev, current) => {
        const id = String(current.id);
        prev[id] = { ...current, id };
        return prev;
    }, {});
    console.log(videoMap);

    return {
        lookup: videoMap,
        formats: { video },
        author: name,
        thumbnail,
        title,
        length: duration,
        url,
        duration: formatDuration(duration)
    };
};

const getVideoLabel = ({ id, width, fps, quality }) => ({
    value: String(id),
    label: `${quality} @ ${fps}fps`,
    sort: width
});

const formatDuration = input => {
    var hours = Math.floor(input / 3600);
    var minutes = Math.floor((input - hours * 3600) / 60);
    var seconds = input - hours * 3600 - minutes * 60;

    if (hours < 10) {
        hours = '0' + hours;
    }
    if (minutes < 10) {
        minutes = '0' + minutes;
    }
    if (seconds < 10) {
        seconds = '0' + seconds;
    }
    return hours + ':' + minutes + ':' + seconds;
};
