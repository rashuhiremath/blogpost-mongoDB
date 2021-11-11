import express from "express";
//import uniqid from "uniqid";
//import createError from "http-errors";
import createHttpError from "http-errors"
//import multer from "multer";
import commentModel from "./schema.js"
import q2m from "query-to-mongo"


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
        const mongoQuery = q2m(req.query)
        const total = await commentModel.countDocuments(mongoQuery.criteria)
        const comments = await commentModel.find(mongoQuery.criteria)
        .limit(mongoQuery.options.limit)
        .skip(mongoQuery.options.skip)
        .sort(mongoQuery.options.sort)
        res.status(200).send({links: mongoQuery.links("/comments",total),pageNum : Math.ceil(total / mongoQuery.options.limit ),total,comments})

        
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