export const get = (uri, body, method = 'GET') =>
    fetch(uri, {
        method,
        headers: { Origin: 'null', 'Content-Type': 'application/json' },
        ...(body && { body: JSON.stringify(body) })
    })
        .then(response => response.json())
        .then(({ status, error, data }) => {
            if (status === 'error') {
                throw new Error(error);
            } else if (!data) {
                throw new Error('error.generic');
            }

            return data;
        })
        .catch(({ message, error } = {}) => {
            // from client
            let result;

            switch (message) {
                case 'Failed to fetch':
                    result = 'error.network.failed';
                    break;
                default: {
                    const match = message.match(/^([a-zA-Z]+\.)+[a-zA-Z]+$/g);
                    const isKeyedError =
                        match !== null ? match.length > 0 : false;
                    result = isKeyedError ? message : 'error.generic';
                    break;
                }
            }
            console.error(error, message);
            throw new Error(result);
        });

export const post = (uri, body) => get(uri, body, 'POST');
