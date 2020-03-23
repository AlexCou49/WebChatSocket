//modules
let express = require('express')
let http = require('http')
let socketio = require('socket.io')
let morgan = require('morgan')
let config = require('./config')

//variable globale
const app = express()
const server = http.Server(app)
const io = socketio(server)
const port = config.express.port
const options = {
    root: __dirname+ '/views'
}
//middlewares
app.use(express.static(options.root))
app.use(morgan('dev'))

//Routes
app.get('/', (req, res) => {
  res.redirect('./home')
})

app.get('/home', (req, res) => {
    res.sendFile('index.html', options)
})

app.get('/params/:name', (req, res) => {
    res.send(req.params.name)
})

//IO
io.on('connection', function(socket){

    console.log('a user connected : ' + socket.id);

    setTimeout(() =>{
        socket.emit('salut')
    }, 1000);

//Deconnexion de l'utilisateur
    socket.on('disconnect', () => {
        console.log('disconnect : ' + socket.id)
    })
  });

//Lancement de l'application
server.listen(port, () => { console.log('server started' + port) })
