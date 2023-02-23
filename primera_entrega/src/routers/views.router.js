import { Router } from "express";
import fs from 'fs'
import mongoose from "mongoose";
import productsModel from "../dao/models/products.model.js";
import cartsModel from "../dao/models/carts.model.js";
import { auth } from "./sessions.router.js";
import session from "express-session";
import passport from "passport";
import { passportCall } from "../utils.js";
import ViewsController from "../controllers/views.controller.js";
import URI_MONGO from '../config/credentials.js'
import PRIVATE_KEY from '../config/credentials.js'



const router = Router()

router.get('/', async (req, res)=>{
    console.log(process.env.NODE_ENV)
    const products = await productsModel.find().lean().exec()
    res.render('home', {products})
    

})

//Mostrar productos con su paginación

router.get('/products',passportCall('jwt'), async(req,res)=>{
    const controller = new ViewsController ('products', productsModel)
    controller.getProduct(req, res)
    /* console.log(req.user)
    let page = +(req.query.page)
    if (!page) page = 1
    
    
    const products = await productsModel.paginate({}, {page:page, limit:3, lean:true})
    
    
    //Aquí creo los enlaces que me van a servir para utilizar en la vista y mover las páginas esto va en una etiqueta <a src="prevLink">
    products.prevLink = products.hasPrevPage ? `/products?page=${products.PrevPage}`: '';
    products.nextLink = products.hasNextPage ? `/products?page=${products.nextPage}`: '';
    products.isValid = !(page <=0 || page > products.totalPages)
    products.userName = req.user.user.name
    products.userId = req.user.user._id
    
    res.render('products', products) */
    

})

router.get('/github/products', async(req,res)=>{
    console.log(req.user)
    let page = +(req.query.page)
    if (!page) page = 1
    
    
    const products = await productsModel.paginate({}, {page:page, limit:3, lean:true})
    
    
    //Aquí creo los enlaces que me van a servir para utilizar en la vista y mover las páginas esto va en una etiqueta <a src="prevLink">
    products.prevLink = products.hasPrevPage ? `/products?page=${products.PrevPage}`: '';
    products.nextLink = products.hasNextPage ? `/products?page=${products.nextPage}`: '';
    products.isValid = !(page <=0 || page > products.totalPages)
    products.userName = req.user.user.name
    products.userId = req.user.user._id
    
    res.render('products', products)
    

})




//Mostramos un producto específico 

router.get('/products/:pid',passportCall('jwt'), async(req, res)=>{
    const productParam = req.params.pid
    const product = await productsModel.findOne({_id:mongoose.Types.ObjectId(productParam)})
    res.render('productDetail', product)

})

/* router.get('/', async (req, res)=>{
    const data = await fs.promises.readFile('src/DB/DB.json', "utf-8")
    const products = JSON.parse(data)
    
    
    
    res.render('home', {products})
}) */

router.get('/realtimeproducts',passportCall('jwt'), (req, res)=>{
    
        res.render('realTimeProducts')
    
    
})

//Chat

router.get('/chat', (req, res)=>{
    
    res.render('chat', {})


})

//Ver carrito completo

router.get('/cart/:cid',passportCall('jwt'), async(req, res)=>{
    const cartParam = req.params.cid
    const cart = await cartsModel.find({_id:mongoose.Types.ObjectId(cartParam)}).lean() //Utilizar lean() para que handlebars reciba un objeto tipo json
  
    res.render('cartsDetail', {productsCart:cart[0].products,cart:cartParam })

})




export default router