process.on('message', message => {
    console.log('message from the master is :', message)
})

process.send({foo: 'bar'})