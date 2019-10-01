import { format } from 'date-fns';

const fs = cep_node.require('fs');
const util = cep_node.require('util');
const writeFileAsync = util.promisify(fs.writeFile);
const existsAsync = util.promisify(fs.exists);

const HOST = 'http://localhost:3000';

Promise.series = function series(providers) {
    const ret = Promise.resolve(null);
    const results = [];

    return providers
        .reduce(function(result, provider, index) {
            return result.then(function() {
                return provider().then(function(val) {
                    results[index] = val;
                });
            });
        }, ret)
        .then(function() {
            return results;
        });
};

const get = (path, body = {}, method = 'GET') =>
    fetch(`${HOST}${path}`, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    })
        .then(response => response.json())
        .then(({ status, error, data }) => {
            if (status === 'error') {
                throw new Error(error || 'An error occurred');
            } else {
                return data;
            }
        });

const post = (path, body = {}) => get(path, body, 'POST');

export const getClipMetadata = (target, start, end, mode, count = 30) =>
    post('/clips', {
        ...(!mode && { game: target }),
        ...(mode && { broadcaster: target }),
        start: format(start, 'yyyy-MM-dd'),
        end: format(end, 'yyyy-MM-dd'),
        count
    });

export const getClips = (data, path) =>
    Promise.series(
        data.map(({ clip_url, id }) => () => writeClip(clip_url, path, id))
    );

const writeClip = async (url, path, id) => {
    const filePath = `${path}${id}.mp4`;
    const exists = await existsAsync(filePath);
    if (exists) {
        return;
    }
    const buffer = await fetchClip(url);
    const payload = new Uint8Array(buffer);

    try {
        await writeFileAsync(filePath, payload);
    } catch {
        throw new Error(`Writing to ${filePath} failed`);
    }
};

const fetchClip = url =>
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
