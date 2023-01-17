import { error } from "console";
import { Router } from "express";
import fs from 'fs'
import mongoose from "mongoose";
import { type } from "os";
import cartsModel from "../dao/models/carts.model.js";
import productsModel from "../dao/models/products.model.js";





const router = Router()







router.get('/', async (req, res)=>{
    
    const data = await fs.promises.readFile('src/DB/DB.json', "utf-8")
    const dataJson = JSON.parse(data)
    if (dataJson.length>0){
        const limit = req.query.limit
        const products = dataJson
        limit ? res.send(dataJson.slice(0,parseInt(limit))) : res.send({products})
        
    }else{
        res.send({status:'error', error: 'No hay productos en el sistema'})
    }
    
    
    
    })


router.get('/:id', async(req, res)=>{
    const idQuery = req.params.id
    if(mongoose.isValidObjectId(idQuery)){
        const product = await productsModel.findOne({_id:mongoose.Types.ObjectId(idQuery)})
        console.log(product)
        product == null ? res.send('No existe el producto'):
        res.status(200).send(product)
    }else{
        res.send('Error en el ID')
    }
    
})
    
/* router.get('/:id', async (req, res)=>{
    const listProduct = await dataList.getProducts()
    const getId = req.params.id
    let count = 0
    listProduct.forEach(element => {
        element.id == getId && count++
    });
    count > 0 ? res.send(listProduct.find(p=>p.id==getId)) : res.send({status:'error', error: 'No existe ID'})
    
    
    
    
    }) */

    router.post('/', async (req, res)=>{
        const product = req.body
        await productsModel.create(product)
        return res.send({status: "success", message:"Producto cargado correctamente"})
        
        

    })


    /* router.post('/', async ( req, res)=>{

        const data = await fs.promises.readFile('src/DB/DB.json', 'utf-8')
        const dataJason = JSON.parse(data)
        const arrayProducts = dataJason
        const nextId = ()=>{
            const count = arrayProducts.length
            const nextId = (count>0) ? arrayProducts[count-1].id +1 : 1
            return nextId
          }  
        if (req.body.title, req.body.description, req.body.code, req.body.price, req.body.status, req.body.stock, req.body.category){
    
        
            const product = req.body
            if(product){
                product.id = nextId()
            }
            arrayProducts.push(product)
            await fs.promises.writeFile('src/DB/DB.json', JSON.stringify(arrayProducts))
            return res.send({status: "success", message:"Producto cargado correctamente"})
    
    
        }else{
            console.log('error')
            res.send('Faltan elementos en el producto')
        } 
    
    
    
    }) */


router.put('/:id', async (req, res)=>{
    const idQuery = req.params.id
    const productUpdate = req.body
    
    if ( mongoose.isValidObjectId(idQuery)){
        await productsModel.updateOne({_id: mongoose.Types.ObjectId(idQuery)}, productUpdate)

    try {
        
        return res.send({status: "Success", message: "Producto actualizado correctamente"})
        
    } catch (error) {
        return res.status(500).send({messagge:"Error"})
    }
    }else{
        res.send('El formato del producto es inválido')
    }
        

    
    
    

})


/* router.put('/:pid', async (req, res)=>{
    const newValue = req.body
    const pid = req.params.pid;
    const data = await fs.promises.readFile('src/DB/DB.json', 'utf-8')
    const dataJson  = JSON.parse(data)
    let updateProduct = dataJson.filter(p=>p.id==pid) 
    updateProduct={...newValue, id:+pid}
    const products = []
    dataJson.forEach(element => {
        element.id != pid && products.push(element)
    });
    products.push(updateProduct)
    console.log(products)
    await fs.promises.writeFile('src/DB/DB.json', JSON.stringify(products))
    return res.send({status: "Success", message: "Producto actualizado correctamente"})

}) */

router.delete('/:id', async (req, res)=>{
    const idQuery = req.params.id

    if(mongoose.isValidObjectId(idQuery)){
        try {
            await productsModel.deleteOne({_id: mongoose.Types.ObjectId(idQuery)})
            res.status(200).send({messagge:'Realizado correctamente'})
            
        } catch (error) {
            res.status(500).send({mesage:'no se pudo borrar el elemento'})
            
        }
    } else{
        res.send('El formato del producto es inválido')
    }
    
    
            
        
    })
    
    




/* router.delete('/:pid', async (req, res)=>{
    const pid = req.params.pid
    const data = await fs.promises.readFile('src/DB/DB.json', 'utf-8')
    const dataJson = JSON.parse(data)
    const products = []
    if(dataJson.length>0) {
        dataJson.forEach(element => {
            element.id != pid && products.push(element)
            
        });
      await fs.promises.writeFile ('src/DB/DB.json', JSON.stringify(products))
      return res.send({status: 'success', message: "Producto eliminado satisfactoriamente"})  
    }else{
        return res.send({status: 'error', error: "ID no encontrado"})
    }
    
    


}) */





export default router