

class ViewsController{
    constructor(pageRender, model){
        this.pageRender = pageRender
        this.model = model
    }

    async getProduct(req, res) {
        let page = +(req.query.page)
        if (!page) page = 1
        
        
        const products = await this.model.paginate({}, {page:page, limit:3, lean:true})
        
        
        //Aquí creo los enlaces que me van a servir para utilizar en la vista y mover las páginas esto va en una etiqueta <a src="prevLink">
        products.prevLink = products.hasPrevPage ? `/products?page=${products.PrevPage}`: '';
        products.nextLink = products.hasNextPage ? `/products?page=${products.nextPage}`: '';
        products.isValid = !(page <=0 || page > products.totalPages)
        products.userName = req.user.user.name
        products.userId = req.user.user._id
        
        res.render(this.pageRender, products)

    } 

    

    
}

export default ViewsController