import { Router } from "express";
import fs from 'fs'
import productsModel from "../dao/models/products.model.js";




const router = Router()

router.get('/', async (req, res)=>{
    const products = await productsModel.find().lean().exec()
    res.render('home', {products})
    

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




export default router