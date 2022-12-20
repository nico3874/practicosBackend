import { Router } from "express";
import fs from 'fs'



const router = Router()

router.get('/', async (req, res)=>{
    const data = await fs.promises.readFile('../DB.json', "utf-8")
    const products = JSON.parse(data)
    
    
    
    res.render('home', {products})
})

router.get('/realtimeproducts', (req, res)=>{
    res.render('realTimeProducts', {})
})




export default router