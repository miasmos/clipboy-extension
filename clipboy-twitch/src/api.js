import { format } from 'date-fns';
import { post } from '@common/api';
import { DOMAIN, PROJECT_NAME } from './config';

const fs = cep_node.require('fs');
const util = cep_node.require('util');
const writeFileAsync = util.promisify(fs.writeFile);
const existsAsync = util.promisify(fs.exists);

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

export const getClipMetadata = (
    target,
    startDate,
    endDate,
    mode,
    clipCount = 30,
    clientId
) =>
    post(
        `${DOMAIN}/twitch/clips`,
        {
            ...(!mode && { game: target }),
            ...(mode && { broadcaster: target }),
            startDate: format(startDate, 'yyyy-MM-dd'),
            endDate: format(endDate, 'yyyy-MM-dd'),
            clipCount
        },
        {
            'x-client-id': clientId
        }
    );

export const getClips = (data, path, onItemCompleted) =>
    Promise.series(
        data.map(({ clip_url, id }) => async () => {
            await writeClip(clip_url, path, id);
            onItemCompleted();
        })
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

export const getVersion = () =>
    fetch(`${DOMAIN}/project/${PROJECT_NAME}/version`, {
        headers: { Origin: 'null' }
    }).then(response => {
        if (response.ok) {
            return response.text();
        } else {
            throw new Error(response);
        }
    });
