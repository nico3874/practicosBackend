
import { Router } from "express";
import fs from 'fs'
import mongoose, { set } from "mongoose";
import cartsModel from "../dao/models/carts.model.js";



const router = Router()

router.post('/', async (req, res)=>{
    const newCart = req.body
    await cartsModel.create(newCart)
    return res.send({message:'Carrito creado con éxito'})

})

/


router.get('/:cid', async(req, res)=>{
    const cartId = req.params.cid
    if(mongoose.isValidObjectId(cartId)){
        const cart =  await cartsModel.find({_id:mongoose.Types.ObjectId(cartId)})
        
        res.status(200).send(cart)
    }else{
        res.status(500).send('El ID no es correcto o no existe')
    }
    
    
    
    

})





router.post('/:cid/products/:pid', async (req, res)=>{
    const cid = req.params.cid
    const pid = req.params.pid
    const newCartProduct = []

    const cart = await cartsModel.findById(cid)
    console.log(cart)
    let countProduct = 0
    
if(cart.products.length==0){
    newCartProduct.push({product:pid, quantity:1});
    countProduct++
}

if(cart.products.length>0){
    cart.products.forEach(element => {
        element.product==pid && (element.quantity++, countProduct++);
        newCartProduct.push(element)

    });
}

countProduct == 0 && newCartProduct.push({product:pid, quantity:1})


 
 await cartsModel.updateOne({_id:mongoose.Types.ObjectId(cid)}, {$set:{products: newCartProduct}})
 res.status(200).send({message:'Carrito actualizado'}) 
    
   

})


//Eliminar productos de un carrito particular


router.delete('/:cid/products/:pid', async(req, res)=>{
    const cartParam = req.params.cid
    const productParam = req.params.pid

    if(mongoose.isValidObjectId(cartParam)){

    

    const cart = await cartsModel.findOne({_id:mongoose.Types.ObjectId(cartParam)})

    

    const ItemRemove = cart.products.find(p=>p.product==productParam)
    if(ItemRemove){
        
        cart.products.pull(ItemRemove)
        await cart.save() 
        res.send('Producto eliminado ')
    }else{
        res.send('No existe el producto')
    }



}else{
    res.send('El Id del carrito es inválido o no existe')
}
})

//Actualizar carrito con nuevos productos

router.put('/:cid', async (req, res)=>{
    const cartParam = req.params.cid
    const cartUpdate = req.body
    
    let cart = await cartsModel.findOne({_id:mongoose.Types.ObjectId(cartParam)})

    const newCart = cart.products.concat(cartUpdate)

    console.log(newCart)

    await cartsModel.updateOne({_id:mongoose.Types.ObjectId(cartParam)}, {$set:{products:newCart}})

    res.status(200).send('Carrito actualizado')

})


//Actualizar cantidad del producto seleccionado // Desde postman se envía un objeto con la cantidad {quantity : 6} por ejemplo y actualiza el producto pasado por parámetro.

router.put('/:cid/products/:pid', async(req, res)=>{
    const cartParam = req.params.cid
    const productParam = req.params.pid
    const newQuantity = req.body
    const cart = await cartsModel.findOne({_id:mongoose.Types.ObjectId(cartParam)})
    const productSelect = cart.products.find(p=>p.product==productParam)
    productSelect.quantity=newQuantity.quantity
    
    await cart.save()
    res.send('Cantidad Actualizada')
    
})


//Vaciar de productos al carrito

router.delete('/:cid', async(req, res)=>{
    const cartParam = req.params.cid
    const cart = await cartsModel.findOne({_id:mongoose.Types.ObjectId(cartParam)})
    cart.products=[]
    await cart.save()
    res.send('Carrito vacío')
    
})

export default router