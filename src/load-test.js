const autocannon = require('autocannon')
// const { json } = require('sequelize')

function generateRandomUrl(){
    const id=Math.random().toString(36).substring(2, 10);
    return `https://example.com/${id}`;
}

const url = "http://localhost:3000/shorten"

const tester = autocannon({
    url: url,
    connections: 10,
    duration: 27,
    pipelining: 10,
    requests: [
        {
            method: 'POST',
            path: '/shorten',
            headers: {
                'Content-Type': 'application/json',
            },
            setupRequest: () => {
                return {
                    method: 'POST',
                    path: '/shorten',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        originalUrl: generateRandomUrl()
                    })
                };
            }
        }
    ]
}, finished);

autocannon.track(tester);

function finished(err, res){
    if(err)
        console.error("Load test failed: ", err)
    else {
        console.log('Load test passed');
        console.log('Requests sent:', res.requests.total);
        console.log('Non-2xx:', res.non2xx);
        console.log('Errors:', res.errors);
    }
}
