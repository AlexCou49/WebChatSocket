let express = require('express')
let app = express()

app.use((req, res, next) => {
    console.log('url: ' + req.path)
    next()
})


app.get('/home', (req, res) => {
    res.send('hello')
})

app.get('/params/:name', (req, res) => {
    res.send(req.params.name)
})

app.listen('8080', () => { console.log('server started') })
