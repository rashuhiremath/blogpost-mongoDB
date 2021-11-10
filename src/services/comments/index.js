import express from "express";
//import uniqid from "uniqid";
//import createError from "http-errors";
import createHttpError from "http-errors"
//import multer from "multer";
import commentModel from "./schema.js"


const commentRouter = express.Router();

//post
commentRouter.post("/",async(req,res,next)=>{
    try {

        const newComment = new commentModel(req.body)
        const {_id} = await newComment.save()
        res.status(200).send({_id})
        
    } catch (error) {
        next(error)
    }

})

// get
commentRouter.get("/",async(req,res,next)=>{
    try {
        const comments = await commentModel.find()
        res.status(200).send(comments)

        
    } catch (error) {
        next(error)
    }


})

// get by id
commentRouter.get("/:commentId",async(req,res,next)=>{
   try {
       const id = req.params.commentId
       const comment= await commentModel.findById(id)
       if (comment) {
         res.send(comment)
       } else {
         next(createHttpError(404, `blog with id ${id} not found!`))
       }
   } catch (error) {
    next(error)
   } 
})


// put
commentRouter.put("/:commentId",async(req,res,next)=>{
    try {
        
        const id = req.params.commentId
        const updatedComment = await commentModel.findByIdAndUpdate(id, req.body, { new: true })
    
        if (updatedComment) {
          res.send(updatedComment)
        } else {
          next(createHttpError(404, `blog with id ${id} not found!`))
        }
        
    } catch (error) {
        next(error)
    }
})
// delete
commentRouter.delete("/:commentId",async(req,res,next)=>{
    try {
        const id = req.params.commentId
        const deleteComment = await commentModel.findByIdAndDelete(id)
        if ( deleteComment ) {
            res.status(204).send()
          } else {
            next(createHttpError(404, `blog with id ${id} not found!`))
  
          }
    
    } catch (error) {
        next(error)
    }
})


export default commentRouter