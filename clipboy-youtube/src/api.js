const fs = cep_node.require('fs');
const util = cep_node.require('util');
const ytdl = require('ytdl-core');
const uuid = require('uuid');
const existsAsync = util.promisify(fs.exists);

export const formatTypes = {
    VIDEO: 0,
    AUDIO: 1,
    BOTH: 2
};
const unsupportedMedia = ['webm'];

export const getMedia = async (id, format, path, callback) => {
    const { container = 'unknown' } = format;
    const filePath = `${path}${id}.${container}`;
    const exists = await existsAsync(filePath);
    if (exists) {
        return;
    }

    return new Promise((resolve, reject) => {
        try {
            const stream = fs.createWriteStream(filePath);
            let lastBytesWritten = 0;
            const interval = setInterval(() => {
                if (typeof callback === 'function') {
                    callback(stream.bytesWritten - lastBytesWritten);
                    lastBytesWritten = stream.bytesWritten;
                }
            }, 500);
            stream.on('finish', () => {
                clearInterval(interval);
                resolve();
            });
            ytdl(`https://youtube.com/watch?v=${id}`, {
                format
            }).pipe(stream);
        } catch {
            reject(`Writing to ${filePath} failed`);
        }
    });
};

export const getVideoInfo = async id => {
    const { length_seconds = 0, player_response, formats } = await ytdl.getInfo(
        `https://youtube.com/watch?v=${id}`
    );
    const {
        videoDetails: {
            author,
            title,
            thumbnail: { thumbnails = [] }
        }
    } = player_response;
    const audio = [];
    const video = [];
    const formatMap = {};

    formats.forEach(format => {
        const {
            encoding,
            audioBitrate,
            audioEncoding,
            container,
            resolution,
            bitrate,
            quality_label
        } = format;
        let parsedBitrate = bitrate;

        if (unsupportedMedia.includes(container)) {
            return;
        }

        if (bitrate) {
            if (bitrate.includes('-')) {
                parsedBitrate = parseFloat(
                    bitrate.substring(bitrate.indexOf('-') + 1)
                );
            } else {
                parsedBitrate = parseFloat(bitrate);
            }
            if (parsedBitrate >= 10000) {
                parsedBitrate /= 1000000;
            } else if (parsedBitrate >= 1000) {
                parsedBitrate /= 1000;
            }
            parsedBitrate = parseFloat(parsedBitrate).toFixed(1);
        }
        const payload = {
            id: uuid.v4(),
            type: getFormatType(format),
            encoding,
            audioBitrate,
            audioEncoding,
            container,
            resolution,
            bitrate: parsedBitrate,
            quality_label
        };
        format = { ...format, ...payload };

        switch (payload.type) {
            case formatTypes.AUDIO:
                audio.push(getAudioLabel(payload));
                break;
            case formatTypes.VIDEO:
            case formatTypes.BOTH:
                video.push(getVideoLabel(payload));
                break;
        }

        formatMap[payload.id] = format;
    });

    video.sort(({ sort: sortA }, { sort: sortB }) => (sortA < sortB ? 1 : -1));
    audio.sort(({ sort: sortA }, { sort: sortB }) => (sortA < sortB ? 1 : -1));
    thumbnails.sort(({ width: widthA }, { width: widthB }) =>
        widthA < widthB ? 1 : -1
    );
    const [thumbnail = {}] = thumbnails;
    const { url: thumbnailUrl } = thumbnail;

    return {
        lookup: formatMap,
        formats: {
            audio,
            video
        },
        length: Number(length_seconds),
        duration: formatDuration(length_seconds),
        title,
        author,
        thumbnail: thumbnailUrl
    };
};

const getVideoLabel = ({
    id,
    quality_label,
    resolution,
    encoding,
    bitrate,
    container,
    type
}) => ({
    value: id,
    label: `${quality_label ? quality_label : resolution} ${
        encoding ? encoding : container
    } @ ${bitrate}Mbps ${type === formatTypes.BOTH ? '*' : ''}`,
    sort: bitrate,
    type
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

const getAudioLabel = ({ id, audioBitrate, audioEncoding, type }) => ({
    value: id,
    label: `${audioEncoding} @ ${audioBitrate}Kbps`,
    sort: audioBitrate,
    type
});

const getFormatType = ({ bitrate, audioBitrate }) => {
    if (bitrate === null) {
        return formatTypes.AUDIO;
    } else if (audioBitrate === null) {
        return formatTypes.VIDEO;
    } else {
        return formatTypes.BOTH;
    }
};
