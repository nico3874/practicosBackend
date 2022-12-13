
const fs = require('fs');


class ProductManager{
    constructor(){
        this.arrayProducts=[]
        this.path = './DB.json';
        
    }


    nextId = ()=>{
        const count = this.arrayProducts.length
        const nextId = (count>0) ? this.arrayProducts[count-1].id +1 : 1
        return nextId
      }  

    

    addProduct = async(title, description, price, thumbnail, code, stock)=>{
        const product = {
            id : this.nextId(),
            title,
            description,
            price,
            thumbnail,
            code,
            stock,
        }
        
        this.arrayProducts.push(product)
        
        await fs.promises.writeFile(this.path, JSON.stringify(this.arrayProducts) )

    }

    getProducts = async ()=>{
        
            try{
              const data = await fs.promises.readFile(this.path, "utf-8")
              const dataJson = JSON.parse(data)
              console.log(dataJson)
              return(dataJson) 
            }catch{
                console.log("No hay productos en la base de datos.")
            }
            
        
    }

    getProductById = async (id) =>{
            let count = 0
            const data = await fs.promises.readFile(this.path, "utf-8")
            const dataJson = JSON.parse(data)
            dataJson.forEach(element => {
                id == element.id && (console.log(element), count++) 
            });
            count == 0 && console.log("No existe el producto.")
            
          
    }

    updateProduc = async(id, key, newElement)=>{
        const newArray = []
        this.arrayProducts.forEach(element => {
            element.id != id && newArray.push(element)
        });
        
           
        
        const data = await fs.promises.readFile(this.path, "utf-8")
        const dataJson = JSON.parse(data)
        const product = dataJson.find(e=>e.id=id)
        product[key] = newElement
        newArray.push(product)
        await fs.promises.writeFile(this.path, JSON.stringify(newArray))


    }

    deleteProduct = async (id)=>{
        const data = await fs.promises.readFile(this.path, "utf-8")
        const dataJson = JSON.parse(data)
        let count = 0
        const newData = []
        dataJson.forEach(element => {
            element.id != id ? newData.push(element): count++
        })
        count == 0 ? console.log("El id no existe"):
        await fs.promises.writeFile(this.path, JSON.stringify(newData))
        }
        
        
    

    

}

const producsList = new ProductManager()

producsList.addProduct('disco rígido', 'disco sólido de 500gb', 8000, "Sin imagen",'abc111', 50 )
producsList.addProduct('mouse inalambrico', 'mouse mara genius', 3000, "Sin imagen",'abc112', 40 )
producsList.addProduct('Monitor', 'Monitor HD 24"', 35000, "Sin imagen",'abc113', 20 )
producsList.addProduct('Teclado Gamer', 'teclado gamer Red Dragon', 5000, "Sin imagen",'abc114', 150 )

module.exports = ProductManager



