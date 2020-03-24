//modules
let express = require('express')
let http = require('http')
let socketio = require('socket.io')
let morgan = require('morgan')
let config = require('./config')

//Constantes
const app = express()
const server = http.Server(app)
const io = socketio(server)
const port = config.express.port
const options = {
    root: __dirname + '/views'
}

//Variables globales
let usernames = []

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
io.on('connection', function (socket) {

    console.log('a user connected : ' + socket.id);

    //traitement pour l'assignation d'un username
    socket.on('setUsername', (usernameWanted) => {

        //traitement pour l'assignation d'un username
        usernameWanted = usernameWanted.trim()

        //verification de l'unicité de l'user
        let usernameTaken = false
        for (let socketid in usernames) {
            if (username[socketid] === usernameWanted)
            usernameTaken = true
        }

        let timeFakeLoading = 1000
        setTimeout(() => {

            //traitement final
            if (usernameTaken) {
                socket.emit('rejectUsername', usernameWanted)
            } else {
                socket.join('users', () => {
                    usernames[socket.id] = usernameWanted
                    socket.emit('acceptUsername', usernameWanted, getUsernames())
                })
                
            }
        }, timeFakeLoading)

    })

    //Deconnexion de l'utilisateur
    socket.on('disconnect', () => {
        console.log('disconnect : ' + socket.id)
        if(usernames[socket.id]){
            delete usernames[socket.id]
            console.log('username deleted')
        }
    })
});

//Lancement de l'application
server.listen(port, () => { console.log('server started' + port) })

//renvoi uniquement un array avec les usernames sans index

function getUsernames() {
    let users = []
    for (let socketid in usernames){
        users.push(usernames[socketid])
    }
    return users
}
