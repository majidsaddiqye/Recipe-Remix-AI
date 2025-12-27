require('dotenv').config()
const app = require('./src/app')
const connectDB = require('./src/db/db')
const http = require('http');
const socketInit = require('./src/sockets/socket.server');


const server = http.createServer(app);
socketInit(server);

connectDB()

const PORT = process.env.PORT;

server.listen(PORT,()=>{
    console.log("Server is Running on Port 3000")
})