import { Router } from "express";
import fs from 'fs'
import ProductManager from '../dao/productsManager.js'


const router = Router()
const dataList = new ProductManager()


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


router.get('/:id', async (req, res)=>{
    const listProduct = await dataList.getProducts()
    const getId = req.params.id
    let count = 0
    listProduct.forEach(element => {
        element.id == getId && count++
    });
    count > 0 ? res.send(listProduct.find(p=>p.id==getId)) : res.send({status:'error', error: 'No existe ID'})
    
    
    
    
    })

    router.post('/', async ( req, res)=>{

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
    
    
    
    })



    router.put('/:pid', async (req, res)=>{
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

})



router.delete('/:pid', async (req, res)=>{
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
    
    


})

export default router
