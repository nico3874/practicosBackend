import { Router } from "express";
import usersModel from "../dao/models/users.model.js";
import session from "express-session";
import { get } from "mongoose";


const router = Router()

//Middleware de autenticación

export function auth(req, res, next){
    if(req.session?.user) return next()
    
    return res.status(401).render('sessions/sessionsError', {error: 'Problemas con la autentificación'})
}

//Esto crea al usuasrio en Mongo

router.get('/register', (req, res)=>{
    res.render('sessions/register', {})
})

router.post('/create', async(req, res)=>{
    const userNew = req.body
    
    if(userNew.email == 'adminCoder@coder.com' && userNew.password =='adminCod3r123'){
        userNew.rol = 'admin';
        const user = new usersModel(userNew)
        await user.save()

    }else{
        userNew.rol = 'usuario';
        const user = new usersModel(userNew)
        await user.save()
    }

    

    res.redirect('/sessions/login')
})



//Esto permite el login, ahora trabajo con sesiones.

router.get('/login', (req, res)=>{
    
    res.render('sessions/login', {})
})

router.post('/login', async (req, res)=>{

    const {user, password} = req.body
    
    const getUser = await usersModel.findOne({email:user, password:password}).lean().exec()

    if(!getUser) return res.status(401).render('sessions/sessionsError', {error: 'Usuario y/o contraseña incorrectos'})

    req.session.user = getUser
    
    res.redirect('/products')


})

router.get('/logout', (req, res)=>{
    req.session.destroy(err=>{console.log(err)})
    res.redirect('/sessions/login')
})



export default router 
