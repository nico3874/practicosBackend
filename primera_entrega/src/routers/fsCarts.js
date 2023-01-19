import { Router } from "express";
import fs from 'fs'


const router = Router()


router.post('/', async (req, res)=>{
    
    
    let arrayCart = []
    
    const data = await fs.promises.readFile('src/DB/carrito.json', 'utf-8')
    if (data){ arrayCart = JSON.parse(data)}
    const nextId = ()=>{
        const count = arrayCart.length
        const nextId = (count>0) ? arrayCart[count-1].id +1 : 1
        return nextId
      }  

    const cart = req.body
    if (cart){
        cart.id=nextId()
    }

    arrayCart.push(cart)

    fs.promises.writeFile('src/DB/carrito.json', JSON.stringify(arrayCart))

    res.send({status: 'succes', message: 'Carrito creado con éxito'})
    
}) 


router.get('/:cid', async(req, res)=>{
    const cid = req.params.cid
    const data = await fs.promises.readFile('src/DB/carrito.json', "utf-8")
    const dataJson = JSON.parse(data)
    let count = 0
    dataJson.forEach(element => {
        element.id == cid && count++
    });
    count > 0 ? res.send(dataJson.find(p=>p.id==cid)) : res.send({status:'error', error: 'No existe ID'})
    
})



router.post('/:cid/products/:pid', async(req, res)=>{
    const cid = req.params.cid
    const pid = req.params.pid
    const data = await fs.promises.readFile('src/DB/carrito.json', "utf-8")
    const dataJson = JSON.parse(data)
    const newArray = []
    
    let count = 0
    dataJson.forEach(element=>{
        element.id == cid && count ++
    })
    if(count >0){
        const cartSelect = dataJson.find(e=>e.id ==cid)
        let count = 0
        cartSelect.products.forEach(element => {
            element.product == pid && (element.quantity++, count++)
        });

        count == 0 && cartSelect.products.push({product:+pid, quantity:1})
         
         
         dataJson.forEach(element => {
            element.id != cid && newArray.push(element)
         });
         
         newArray.push(cartSelect)
         
         fs.promises.writeFile('src/DB/carrito.json', JSON.stringify(newArray))
         return res.send({status:"Success", message:"Producto agregado correctamente"})
       
            
        
    }else{
        return res.send({status:"Error", error:"No existe carrito"})
    }


})

export default router
