// cluster的底层也是基于child_process.fork实现的
const cluster = require('cluster');
const http = require('http');
const numCPUs = require('os').cpus().length;

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
            if(message.act === 'suicide'){
                console.log(`Worker ${worker.process.pid} suicide`)
                cluster.fork()
            }
        })
        console.log(`Worker ${worker.process.pid} fork success`)
    })
} else {
    require('./worker.js')
}