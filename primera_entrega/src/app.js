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

const app = express()
app.use(express.json())
app.use(express.urlencoded({extended: true}))

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




