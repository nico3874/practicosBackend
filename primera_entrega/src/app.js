import express from 'express'
import routerProduct from './routers/route.products.js'
import routerCart from './routers/route.cart.js'


const app = express()
app.use(express.json())
app.use(express.urlencoded({extended: true}))


app.use('/api/products', routerProduct )
app.use('/api/carts', routerCart)



app.use('/', (req, res)=>{
    res.send("Bienvenidos a mi tienda")
})

app.listen(8080)