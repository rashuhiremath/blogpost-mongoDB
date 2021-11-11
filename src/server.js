import express from "express"
import listEndpoints from "express-list-endpoints";
import blogsRouter from "./services/index.js"
import commentRouter from "./services/comments/index.js";
import cors from "cors";
import  mongoose from "mongoose";
import authorRouter from "./services/authors/index.js";




const server = express()
server.use(cors())
server.use(express.json())

server.use("/blogPosts",blogsRouter)
server.use("/comments", commentRouter )
server.use("/authors",authorRouter)

const port = process.env.PORT

console.table(listEndpoints(server))

mongoose.connect(process.env.MONGO_DB)

mongoose.connection.on("connected",()=>{
    console.log("mongo connectes")

    server.listen(port,()=>
    console.log("successfully running on port:",port))
})



mongoose.connection.on('error', (err) => console.log(err))