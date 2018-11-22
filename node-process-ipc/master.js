const path = require('path')
const cp = require('child_process')
const worker = cp.fork(path.join(__dirname, './worker.js'))

worker.on('message', message => {
    console.log('Message from worker is :', message)
})

worker.send({hello: 'world'}) 