// cluster的底层也是基于child_process.fork实现的
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;

let restartQueue = []

function isTooFrequenty() {
    const limit = 10
    const during = 60000
    const time = Date.now()
    const length = restartQueue.push(time)
    if (length > limit) {
        restartQueue = restartQueue.slice(limit * -1)
    }
    return restartQueue.length >= limit && restartQueue[restartQueue.length - 1] - restartQueue[0] < during
}

if (cluster.isMaster) {
    let workers = {}
    console.log(`Master ${process.pid} is running`);

    //   在windows环境下开启轮叫调度策略
    //   cluster.schedulingPolicy = cluster.SCHED_RR

    // Fork workers.
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on('exit', (worker, code, signal) => {
        console.log(`worker ${worker.process.pid} exited`);
        delete workers[worker.process.pid]
    });

    cluster.on('fork', worker => {
        workers[worker.process.pid] = worker
        worker.on('message', message => {
            if (message.act === 'suicide') {
                if (isTooFrequenty()) {
                    process.emit('give up')
                    console.log(`restart process is too frequenty`)
                    return
                } else {
                    console.log(`Worker ${worker.process.pid} suicide`)
                    cluster.fork()
                }
            }
        })
        console.log(`Worker ${worker.process.pid} fork success`)
    })
} else {
    require('./worker.js')
}