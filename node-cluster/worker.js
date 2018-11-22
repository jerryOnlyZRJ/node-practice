const http = require('http')
const server = http.createServer()

process.on('message', (message, handler) => {
    if(message === 'server'){
        handler.on('connection', socket => {
            server.emit('connection', socket)
        })
    }
})

server.on('request', (req, res) => {
    console.log(`worker[${process.pid}] handle the request`)
    res.end(`worker[${process.pid}] handle the request`)
})

