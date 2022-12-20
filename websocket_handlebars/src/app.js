import express from 'express'
import handlebars from 'express-handlebars'
import { Server } from 'socket.io'

const app = express()

const httpServer = app.listen(8080, ()=>{console.log('Running server')})
const serverSocket = new Server (httpServer)