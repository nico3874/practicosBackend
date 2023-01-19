import fs from 'fs'



export class ProductManager{
    constructor(){
        this.arrayProducts=[]
        this.path = 'src/DB/DB.json';
        
    }


    nextId =  ()=>{
            
            const count = this.arrayProducts.length
            const nextId = (count>0) ? arrayProducts[count-1].id +1 : 1
            
            return nextId
          }  

    

    addProduct = async(title, description, price, thumbnail, code, stock)=>{
        

        const product = {
            id : nextId(),
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
              return JSON.parse(data)
              
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



/* module.exports = ProductManager */

export default ProductManager
