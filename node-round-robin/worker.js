const http = require('http')
const server = http.createServer()

process.on('message', (message, socket) => {
    if (message === 'socket' && socket) {
        server.emit('connection', socket)
    }
})

server.on('request', (req, res) => {
    console.log(`worker[${process.pid}] handle the request`)
    res.end(`worker[${process.pid}] handle the request\n`)
})