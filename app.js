const express = require('express')
const http = require('http')
const path = require('path')
const { Server } = require('socket.io')
const app = express()
const server = http.createServer(app)

const io = new Server(server)

app.use(express.static(path.join(__dirname,'public')))

app.get('/',(req,res)=>{
    res.sendFile('index.html')
})

let users = [];  // collect user'data connected 

io.on('connection',(socket)=>{
    // Event User Connected
    console.log('New client connected')
    socket.on('setUsername', function(data){
        if(users.indexOf(data) > -1)// check name in users array if = -1 means there is no this name in array  
        {
            console.log(data)
            socket.emit('userExists','this usernaem is valided, Please enter new username ')
        }else {
            users.push(data)
            socket.emit('userSet', {username: data})
        }
    })
    socket.on('msg',function(data){
        // Send msg to all clients
        io.sockets.emit('newmsg', data)
    })

    // Event User Disconnected
    socket.on('disconnect', ()=>{
       
    })
})


server.listen(3000, ()=>{
    console.log('Start server at localhost:3000')
})