import {fileURLToPath } from 'url'
import {dirname} from 'path'
import bycrypt from 'bcrypt'
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