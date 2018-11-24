const http = require('http')
const server = http.createServer()
let errorState = false

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
    if (!errorState) {
        errorState = true
        console.log(`Error: ${err}`)
        // 避免子进程在死亡->退出这一时间内出现所有工作进程都死亡而无法接收新的连接的情况
        process.send({
            act: 'suicide'
        })
        server.close(() => {
            process.exit(1)
        })
        setTimeout(() => {
            process.exit(1)
        }, 5000);
    } else {
        return
    }
})