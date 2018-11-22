//$while true;do curl http://localhost:8080;done

const cp = require('child_process')
const path = require('path')
const net = require('net')
const server =  net.createServer({
    pauseOnConnect: true
})
// 通过队列实现轮叫调度
let children = []

for (let i = 0; i < 4; i++) {
    children.push(cp.fork(path.join(__dirname, './worker.js')))
}

server.on('connection', socket => {
    let worker = children.shift()
    worker.send('socket', socket)
    children.push(worker)
})

server.listen(8080, () => {
    console.log('server is start at port 8080')
})