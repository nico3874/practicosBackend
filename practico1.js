class ProductManager{
    constructor(){
        this.products = []
    }

    getProducts = ()=>{
        return console.log(this.products)
    }

    autoId = ()=>{
        const count = this.products.length
        const nextId = (count>0) ? this.products[count-1].id +1 : 1
        return nextId
      }  
    
    

    addProdcut = ( title, description, price, thumbnail, code, stock)=>{
        
       
        
        if (title, description, price, thumbnail, code, stock){

            const product = {
                id : this.autoId(),
                title,
                description,
                price,
                thumbnail,
                code,
                stock
            }

            if (this.products.length===0){
                this.products.push(product)
            }else{
                let codeRepeat = 0
                this.products.forEach(element => {
                   if(product.code == element.code) {
                        codeRepeat= codeRepeat + 1
                   } 
                    
                });
                if (codeRepeat>0){
                    console.log("ERROR: El código ya existe")
                }else{
                    this.products.push(product)
                }
            }
        
            

             
             
          
             }else{return console.log("Falta un parámetro")};
             
        


       

}

    getProductById = (getId)=>{
        this.products.forEach(element => {
            getId== element.id ? console.log(element): console.log("Not found")
            
        });
    }

}

productList = new ProductManager

productList.getProducts()
productList.addProdcut( "producto prueba","Este es unproducto de prueba", 200, "Sin Imagen", "abc123", 25)
productList.getProducts()
productList.addProdcut( "producto prueba","Este es unproducto de prueba", 200, "Sin Imagen", "abc123", 25)

