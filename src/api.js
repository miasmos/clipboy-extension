import { format } from 'date-fns';

const HOST = 'http://localhost:3000';

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

export const clips = (target, start, end, mode, count = 30) =>
    post('/clips', {
        ...(!mode && { game: target }),
        ...(mode && { broadcaster: target }),
        start: format(start, 'yyyy-MM-dd'),
        end: format(end, 'yyyy-MM-dd'),
        count
    });

export const getClip = url => {
    const headers = {
        'Content-Type': 'application/octet-stream'
    };
    console.log(result);
    console.log(Origin);
    console.log(headers);
    return fetch(url, {
        headers
    });
};
