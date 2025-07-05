// require('dotenv').config({path: './env'})
import dotenv from "dotenv"
import connectDB from "./src/db/index.js";
import {app} from './src/app.js'
dotenv.config()

import Redis from 'ioredis'

export const redis = new Redis({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD,
    username: process.env.REDIS_USERNAME,
})


connectDB()
.then(() => {
    app.listen(process.env.PORT || 8000, () => {
        console.log(`⚙️  Server is running at port : ${process.env.PORT}`);
    })
})
.catch((err) => {
    console.log("MONGO db connection failed !!! ", err);
})










