//modules
let express = require('express')
let http = require('http')
let socketio = require('socket.io')
let morgan = require('morgan')
let striptags = require('striptags')
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
        usernameWanted = striptags(usernameWanted.trim())

        //verification de l'unicité de l'user
        let usernameTaken = false
        for (let socketid in usernames) {
            if (username[socketid] === usernameWanted)
            usernameTaken = true
        }

        let timeFakeLoading = 0
        setTimeout(() => {

            //traitement final
            if (usernameTaken) {
                socket.emit('rejectUsername', usernameWanted)
            } else {
                socket.join('users', () => {
                    usernames[socket.id] = usernameWanted
                    let justUsernames = getUsernames()
                    socket.emit('acceptUsername', usernameWanted, justUsernames)
                    socket.to('users').emit('newUser', usernameWanted, justUsernames)
                })
            }
        }, timeFakeLoading)

    })

    //Reception d'un message

    socket.on('sendMessage', (text) => {
        text = striptags(text.trim())
        if (text != '') {
            socket.to('users').emit('newMessage', text, usernames[socket.id])
            socket.emit('confirmMessage', text)
        }
    })

    //Information sur l'écriture d'un user

    socket.on('startWriting', () => { 
        socket.to('users').emit('userStartWriting', usernames[socket.id])
    })

    socket.on('stopWriting', () => {
        socket.to('users').emit('userStopWriting')
    })

    //Deconnexion de l'utilisateur
    socket.on('disconnect', () => {
        if(usernames[socket.id]){
            delete usernames[socket.id]
            socket.to('users').emit('leftUser', getUsernames())
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
