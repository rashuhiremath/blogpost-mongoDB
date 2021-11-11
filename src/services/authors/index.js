import express from "express"
import createHttpError from "http-errors"
import authorModel from "./schema.js"


const authorRouter = express.Router()

// post the author
authorRouter.post("/", async(req,res,next)=>{
try {
const newAuthor = new authorModel(req.body)
const {_id} = await newAuthor.save()
res.send({_id})
   
} catch (error) {
    next(error)
}
})
// get the author
authorRouter.get("/", async (req,res,next)=>{
    try {
        const authors = await authorModel.find()
        if(authors){
            
        }
        res.send( authors)
        
    } catch (error) {
        next(error)
    }
    })

    // get by id
    authorRouter.get("/:authorId", async(req,res,next)=>{
        try {
            const id = req.params.authorId
            const author = await authorModel.findById(id)
            if(author){
                res.send(author)
            }else{
                next(createHttpError(`author with id ${req.params.authorId} not found`))
            }
             
        } catch (error) {
            next(error)
        }
        })

        // aupdate
        authorRouter.put("/:authorId", async(req,res,next)=>{
            try {

                const id = req.params.authorId
                const updateAuthor = await authorModel.findByIdAndUpdate(id, req.body,{new:true})
                if(updateAuthor){
                    res.send(updateAuthor)
                }else{
                    next(createHttpError(`author with id ${req.params.authorId} not found`))
                }

                
            } catch (error) {
                next(error)
            }
            })

            // delete
            authorRouter.delete("/:authorId", async(req,res,next)=>{
                try {

                    const id = req.params.authorId
                    const deleteAuthor = await authorModel.findByIdAndDelete(id)
                    if( deleteAuthor){

                        res.status(201).send()
                    } else{
                        next(createHttpError(`author with id ${req.params.authorId} not found`))
                    }
                    
                } catch (error) {
                    next(error)
                }
                })

                export default authorRouter