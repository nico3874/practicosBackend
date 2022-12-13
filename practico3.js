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