const cp = require('child_process')
const path = require('path')
const http = require('http')
const server = http.createServer()

server.listen(8080, () => {
    console.log('server is start at port 8080')
    for (let i = 0; i < 4; i++) {
        let child = cp.fork(path.join(__dirname, './worker.js'))
        child.send('server', server)
    }
    server.close()
})