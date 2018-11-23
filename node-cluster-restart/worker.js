const http = require('http')

const server = http.createServer()

server.listen(8000)
server.on('request', (req, res) => {
    let delta = Math.random() * 1000
    if (delta > 500) {
        abc()
    }
    res.writeHead(200);
    res.end(`Worker ${process.pid} handle the request\n`);
})

process.on('uncaughtException', err => {
    console.log(`Error: ${err}`)
    process.send({
        act: 'suicide'
    })
    server.close(() => {
        process.exit(1)
    })
    setTimeout(() => {
        process.exit(1)
    }, 10000);
})