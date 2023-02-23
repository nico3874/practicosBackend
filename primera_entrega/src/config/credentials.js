import { config } from "dotenv"

config()


export default {
    PRIVATE_KEY : process.env.PRIVATE_KEY,
    URI_MONGO : process.env.URI_MONGO
}




