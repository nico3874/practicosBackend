const express =  require('express')
const ProductManager = require('./practico2')
const fs = require('fs')

const app = express()

app.get('/', (req, res)=>{
    res.send("Arrancando el práctico")
})

app.listen(8080, ()=>{
    console.log('Escuchando...')
})




const producsList = new ProductManager()

producsList.addProduct('disco rígido', 'disco sólido de 500gb', 8000, "Sin imagen",'abc111', 50 )
producsList.addProduct('mouse inalambrico', 'mouse mara genius', 3000, "Sin imagen",'abc112', 40 )
producsList.addProduct('Monitor', 'Monitor HD 24"', 35000, "Sin imagen",'abc113', 20 )
producsList.addProduct('Teclado Gamer', 'teclado gamer Red Dragon', 5000, "Sin imagen",'abc114', 150 )

    
app.get('/products', async (req, res)=>{
    
    const data = await fs.promises.readFile('./DB.json', "utf-8")
    const dataJson = JSON.parse(data)
    const limit = req.query.limit
    limit ? res.send(dataJson.slice(0,parseInt(limit))) : res.send(dataJson)
    
    
    })


    
app.get('/products/:id', async (req, res)=>{
    
    const data = await fs.promises.readFile('./DB.json', "utf-8")
    const dataJson = JSON.parse(data)
    const getId = req.params.id
    res.send(dataJson.find(p=>p.id==getId))
    
    
    })