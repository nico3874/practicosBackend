import { Router } from "express";
import { Cookie } from "express-session";
import passport from "passport";
import usersModel from "../dao/models/users.model.js";
import { generateToken } from "../utils.js";
/* import session from "express-session";
import { get } from "mongoose"; */


const router = Router()

//Middleware de autenticación

export function auth(req, res, next){
    if(req.session?.user) return next()
    
    return res.status(401).render('sessions/sessionsError', {error: 'Problemas con la autentificación'})
}

//Esto crea al usuasrio en Mongo sin passport

router.get('/register', (req, res)=>{
    res.render('sessions/register', {})
})

/* router.post('/create', async(req, res)=>{
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
}) */

//Estrategia local con passport

router.post('/create', passport.authenticate('register', {failureRedirect:'/sessions/failedRegister'}), (req, res)=>{
    res.redirect('/sessions/login')
})

//Respuesta de falla de registro

router.get('/failedRegister', (req, res)=>{
    res.status(401).send({error:'Failed register'})
})

//Esto permite el login, ahora trabajo con sesiones sin passport

router.get('/login', (req, res)=>{
    
    res.render('sessions/login', {})
})

/* router.post('/login', async (req, res)=>{

    const {user, password} = req.body
    
    const getUser = await usersModel.findOne({email:user, password:password}).lean().exec()

    if(!getUser) return res.status(401).render('sessions/sessionsError', {error: 'Usuario y/o contraseña incorrectos'})

    req.session.user = getUser
    
    res.redirect('/products')


}) */


//Login con passport y estrategia local

router.post('/login', passport.authenticate('login', {failureRedirect:'/sessions/failedLogin'}), (req, res)=>{
    
    /* req.session.user = req.user */ // Esto es en caso de utilizar Sessions

    res.cookie('userToken', req.user.token).redirect('/products')

})

//Respuesta al error de Login 

router.get('/failedLogin', (req, res)=>{
    if(!req.user) return res.status(400).send('Invalid Credentials')
    res.render('sessions/sessionsError', {error:'Error en el login verifica usuario y contraseña'})
})

//Con Github

router.get('/login-github', passport.authenticate('github', {scope: ['user:email']}), (req, res)=>{}) //Scope se usa para ver los alcances del token del usuario

//Ahora configuramos una vez que git no permite o niega el acceso

router.get('/githubcallback', passport.authenticate('github', {failureRedirect: '/sessions/login'}), (req, res)=>{
    console.log('verificación: '+req.user)
    req.session.user = req.user
    res.redirect('/github/products')
})


router.get('/logout', (req, res)=>{
    
    
    req.session.destroy(err=>{console.log(err)})
    res.clearCookie('userToken').redirect('/sessions/login')
})



export default router 
