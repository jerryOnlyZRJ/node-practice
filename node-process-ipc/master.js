const path = require('path')
const cp = require('child_process')
const worker = cp.fork(path.join(__dirname, './worker.js'))
const data = {
    hello: 'world'
}

worker.on('message', message => {
    console.log('Is message and data the same :', message === data) //false 
})

worker.send(data)