export const clips = (oauth, game, fullPath, start, end, count = 30) =>
    fetch('http://localhost:3000/clips', {
        headers: {
            'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({
            oauth,
            game,
            path: fullPath,
            start,
            end,
            count
        })
    }).then(response => response.json());
