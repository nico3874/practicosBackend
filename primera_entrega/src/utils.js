import {fileURLToPath } from 'url'
import {dirname} from 'path'
import bycrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import PRIVATE_KEY from './config/credentials.js'

import passport from 'passport'
///Esto es para las rutas relativas

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default __dirname 

//Configuración para hasheo

export const createHash = (password)=> bycrypt.hashSync(password, bycrypt.genSaltSync(10))
 
//Función para validar contraseña

export const isValidPassword = (user, password)=>{
    return bycrypt.compareSync(password, user.password)
}

export const generateToken = (user)=>{
   const token =  jwt.sign({user}, `${PRIVATE_KEY}`, {expiresIn:'24h'})
   
   return token
}

//Authtoken se genera para validar el token antes de configurar pássport-jwt, después ya no se utiliza porque passport verifica el token
//Aquí se está utilizando cookies, si se utilizaran el token desde el header, tendríamos que hacer token = authHeaders.split(' ')[1] para separar el token de Bearer.

export const authToken = (req, res, next)=>{
    const authCookies = req.cookies.userToken
    if(!authCookies) return res.status(401).send({error: 'Not auth'})

    const token = authCookies

    jwt.verify(token, PRIVATE_KEY, (error, credentials)=>{
        if(error) return res.status(403).send({error:'No authorized'})
        req.user = credentials.user
        next()
    })
}

export const passportCall = (strategy) => { // Se le pasa la strategy para poder tener un mejor control de los errores, es un middleware dentro de otro middleware
    return async (req, res, next) => {
        passport.authenticate(strategy, function(err, user, info) {
            

            if(err) return next(err)
            if(!user) {
                return res.status(401).send({
                    error: info.messages ? info.messages : info.toString() 
                })
            }

            req.user = user
            next()
        })(req, res, next)
    }
}

export const cookieExtractor = req => {
    let token = null
    if(req && req.cookies){
        token = req.cookies['userToken']
    }
    
    return token
}