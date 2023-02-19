import express from 'express'
import routerProduct from './routers/route.products.js'
import routerCart from './routers/route.cart.js'
import handlebars from 'express-handlebars'
import __dirname from './utils.js'
import viewsRouter from './routers/views.router.js'
import { Server } from 'socket.io'
import fs from 'fs'
import { Server as serverHtttp } from 'http'
import mongoose from 'mongoose'
import chatModel from './dao/models/chat.model.js'
import fsProduct from './routers/fsProducts.router.js'
import fsCart from './routers/fsCarts.js'
import routerSessions from './routers/sessions.router.js'
import MongoStore from 'connect-mongo'
import session from 'express-session'
import initPass from './config/passport.config.js'
import passport from 'passport'
import cookieParser from 'cookie-parser'

const app = express()
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())

//Configurando sessions

app.use(session({
    store:MongoStore.create({
        mongoUrl: 'mongodb+srv://nik3874:dHuhHFsdwNUGN4rD@cluster0.37pyhxm.mongodb.net/?retryWrites=true&w=majority',
        dbName: 'ecommerceSessions',
        mongoOptions:{
            useNewUrlParser:true,
            useUnifiedTopology:true
        },
        ttl:120,
        
    }),
    resave:true,
    secret: 'registeruser',
    saveUninitialized:true

    
}))


//Inicializamos los middleware de passport

initPass()
app.use(passport.initialize())
app.use(passport.session())


const httpServer = new serverHtttp(app)
const io = new Server(httpServer)

//Configuración motor

app.engine('handlebars', handlebars.engine())
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')

app.use(express.static(__dirname + '/public'))


app.use('/api/products', routerProduct )
app.use('/api/carts', routerCart)
app.use('/', viewsRouter)
app.use('/api/products/fs', fsProduct)
app.use('/api/carts/fs', fsCart)
app.use('/sessions', routerSessions)


mongoose.set('strictQuery', false)



mongoose.connect('mongodb+srv://nik3874:dHuhHFsdwNUGN4rD@cluster0.37pyhxm.mongodb.net/?retryWrites=true&w=majority',{dbName:'ecommerce'}, (error)=>{
    if(error){
        console.log('No se puede acceder a la base de datos')
        return
    }
    console.log('DB conected!!!')
    const server = httpServer.listen(8080, ()=>{console.log("Running server...")})
    server.on('error', (error)=>{
    console.log(error)
})

})


io.on('connection', async (socket) =>{
    const data = await fs.promises.readFile( 'src/DB/DB.json', "utf-8")
    const listProducts = JSON.parse(data)
    
    console.log( `New client connected, id:${socket.id}`)
    
    io.sockets.emit('productos', listProducts)
   
})

//Chat desde el lado del servidor

let messages = []


io.on ('connection', socket =>{
    console.log('New client connected');

    socket.on('authenticated', async(data) =>{
        io.emit('newLogin', data)
        
        await chatModel.create({user:data, message:[]})
    })

    socket.on('message',async (data)=>{
        
        messages.push(data)
        console.log(data)
        await chatModel.updateOne({user:data.user}, {$set:{message:messages}})

        io.emit('messageLogs', messages)
    })

    
    
})  




