import passport from 'passport'
import local from 'passport-local'
import usersModel from '../dao/models/users.model.js'
import { isValidPassword, createHash } from '../utils.js'
import GitHubStrategy from 'passport-github2'

// Registro y Login con estrategia local

const LocalStrategy = local.Strategy

const initPass = ()=>{

passport.use('register', new LocalStrategy({
    passReqToCallback: true,
    usernameField: 'email'
},
async(req, username, password, done)=>{
    const {name, lastName, email, age} = req.body
    console.log(req.body)

    try {
        const user = await usersModel.findOne({email:username})
        if(user){
            console.log('Usuario ya existe')
            return done(null, false)}

        const newUser = {
            name,
            lastName,
            email,
            age,
            password: createHash(password)
        }
        const result = await usersModel.create(newUser)
        return (done(null, result))
        
    } catch (error) {
        return done('Error en el registro' + error)
    }
}))

    //Login Local
    passport.use('login', new LocalStrategy(
        {usernameField:'email'},
        async (username, password, done)=>{
            
            try {
                const user = await usersModel.findOne({email:username})
                console.log(user)
                if(!user){
                    console.error('Usuario no existe')
                    return done (null, false)
                }
                if(!isValidPassword(user, password)) return done(null, false)
                return done(null, user)
            } catch (error) {
                return done(error)
            }
        
        }
    ))


      //Estrategia con github

      passport.use('github',new GitHubStrategy({
        clientID: 'Iv1.9bb66ce1019d5229',
        clientSecret: '4c3bb4f9854ae64b1535c7311c92441e670b7c72',
        callBackURL: 'http://localhost:8080/sessions/githubcallback'

    },
    
    //Configuración de la función para registrar con github
    async (accesToken, refreshToken, profile, done)=>{
        

        try {
            const user = await usersModel.findOne({email:profile._json.email})
            if(user){
                console.log('User already exits')
                return done(null, user)
            }

            const newUser = {
                name: profile.username,
                lastName:'',
                email: profile._json.email,
                password :''
            }

            const result = await usersModel.create(newUser)
            return done (null, user)
        } catch (error) {
            return done('Error to login with github' + error)
        }
    }

    ))

    passport.serializeUser((user, done)=>{
        done(null, user._id)
    })
    passport.deserializeUser(async(id, done)=>{
        const user = await usersModel.findById(id)
        done(null, user)
    })
}

export default initPass