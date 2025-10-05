import dotenv from "dotenv"
dotenv.config()

const _config = {
    ENV: {
        PORT: process.env.PORT,
        MONGO_URI: process.env.MONGO_URI,
        CLIENT_URL: process.env.CLIENT_URL,
        JWT_SECRET: process.env.JWT_SECRET,
        NODE_ENV: process.env.NODE_ENV
    }
}

export default _config