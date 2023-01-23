import mongoose from "mongoose";


const usersCollection = 'users'

const usersSchema = mongoose.Schema({
    name:String,
    lastName:String,
    age:Number,
    email:String,
    password:String,
    rol:String
})

const usersModel = mongoose.model(usersCollection, usersSchema)

export default usersModel