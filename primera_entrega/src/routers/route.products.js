
import { Router } from "express";
import fs from 'fs'
import mongoose from "mongoose";

import productsModel from "../dao/models/products.model.js";






const router = Router()




/* router.get('/', async (req, res)=>{
    const products = await productsModel.find({})
    res.status(200).send(products)
    products.length==0 && res.send('No existen productos en la DB')
}) */

router.get('/', async(req, res)=>{
    
    const filter ={}
    const options = {
        page:1,
        limit:10,
        sort:{}
    }
    
    const query= req.query.query
    const limit = req.query.limit
    const page = req.query.page
    const sort = req.query.sort

    if(query){filter.category=query}
    if (page){options.page=page}
    if(limit){options.limit=limit}
    if(sort=='asc'){options.sort.price=1}
    if(sort=='desc'){options.sort.price=-1}

    const products = await productsModel.paginate(filter, options)
    res.status(200).send({message:'Succes', payload:products})
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
    


    router.post('/', async (req, res)=>{
        const product = req.body
        await productsModel.create(product)
        return res.send({status: "success", message:"Producto cargado correctamente"})

    })


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
    
    

export default router