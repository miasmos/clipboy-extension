export const clips = (oauth, game, start, end, count = 30) =>
    fetch('http://localhost:3000/clips', {
        headers: {
            'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({
            oauth,
            game,
            start,
            end,
            count
        })
    }).then(response => response.json());

export const getClip = url => fetch(url).then(response => response.blob());
