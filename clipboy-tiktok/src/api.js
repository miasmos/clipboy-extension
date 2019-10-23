import { DOMAIN } from './config';
import { post } from '@common/api';

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

export const getMedia = async (name, clientId) => {
    try {
        const userId = await getUserId(name);
        const data = await getUserFeed(userId, clientId);
        return data;
    } catch (error) {
        console.error(error);
    }
};

//TODO: cache userIds

const getUserId = async name => {
    const response = await fetch(`https://tiktok.com/@${name}`);
    const body = await response.text();
    const userIdPattern = new RegExp('"userId":"(.*?)"', 'g');
    const [, userId] = userIdPattern.exec(body) || [];
    return userId;
};

const getUserFeed = (id, clientId) =>
    post(`${DOMAIN}/tiktok/feed`, { id }, { 'x-client-id': clientId });
