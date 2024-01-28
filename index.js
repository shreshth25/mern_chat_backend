require('dotenv').config()
require('./config/database')
const express = require('express')
const cors = require('cors')
const http = require('http');
const socketIo = require('socket.io');

const authRouter = require('./routes/authRoutes')
const holidayRouter = require('./routes/holidayRoutes')
const userRouter = require('./routes/userRoutes')
const attendanceRouter = require('./routes/attendanceRoutes')
const aiChatRouter = require('./routes/aichatRouter');
const CreateSocketIO = require('./socketio');
const chatRoutes = require('./routes/chatRoutes');
const app = express()
const server = http.createServer(app); // Create an HTTP server
const io = socketIo(server,{
    cors:{
        origin: '*'
    }
});

const PORT = process.env.PORT

//Middlewares
app.use(cors())
app.use(express.urlencoded({extended:true}))
app.use(express.json());
app.use('/uploads', express.static('uploads'));

CreateSocketIO(io)

app.use((req,resp,next)=>{
    req.io = io
    next()
})

//Routes
app.use('/api/auth', authRouter)
app.use('/api/holiday', holidayRouter)
app.use('/api/users', userRouter)
app.use('/api/attendance', attendanceRouter)
app.use('/api/aichat', aiChatRouter)
app.use('/api/chat', chatRoutes)


server.listen(PORT, ()=>{
    console.log(`Server Listing at port ${PORT}`)
})