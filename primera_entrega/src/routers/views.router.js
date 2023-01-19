import { Router } from "express";
import fs from 'fs'
import mongoose from "mongoose";
import productsModel from "../dao/models/products.model.js";
import cartsModel from "../dao/models/carts.model.js";




const router = Router()

router.get('/', async (req, res)=>{
    const products = await productsModel.find().lean().exec()
    res.render('home', {products})
    

})

//Mostrar productos con su paginación

router.get('/products', async(req,res)=>{

    let page = +(req.query.page)
    if (!page) page = 1
    
    const products = await productsModel.paginate({}, {page:page, limit:3, lean:true})

    
    //Aquí creo los enlaces que me van a servir para utilizar en la vista y mover las páginas esto va en una etiqueta <a src="prevLink">
    products.prevLink = products.hasPrevPage ? `/products?page=${products.PrevPage}`: '';
    products.nextLink = products.hasNextPage ? `/products?page=${products.nextPage}`: '';
    products.isValid = !(page <=0 || page > products.totalPages)
    

    res.render('products', products)
    console.log(products)
    

})


//Mostramos un producto específico 

router.get('/products/:pid', async(req, res)=>{
    const productParam = req.params.pid
    const product = await productsModel.findOne({_id:mongoose.Types.ObjectId(productParam)})
    res.render('productDetail', product)

})

/* router.get('/', async (req, res)=>{
    const data = await fs.promises.readFile('src/DB/DB.json', "utf-8")
    const products = JSON.parse(data)
    
    
    
    res.render('home', {products})
}) */

router.get('/realtimeproducts', (req, res)=>{
    
        res.render('realTimeProducts')
    
    
})

//Chat

router.get('/chat', (req, res)=>{
    
    res.render('chat', {})


})

//Ver carrito completo

router.get('/cart/:cid', async(req, res)=>{
    const cartParam = req.params.cid
    const cart = await cartsModel.find({_id:mongoose.Types.ObjectId(cartParam)}).lean() //Utilizar lean() para que handlebars reciba un objeto tipo json
  
    res.render('cartsDetail', {productsCart:cart[0].products,cart:cartParam })

})




export default router