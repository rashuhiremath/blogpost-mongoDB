import express from "express";
import uniqid from "uniqid";
import createError from "http-errors";
import createHttpError from "http-errors"
import multer from "multer";
import blogModel from "./schema.js"

//get blogs
const blogsRouter = express.Router();

blogsRouter.get("/", async (req, res, next) => {
  try {
    
    const blogs = await blogModel.find()

    res.status(200).send(blogs);
  } catch (error) {
    next(error);
  }
});
// post
blogsRouter.post("/", async (req, res, next) => {
    try {
     
  
    const newBlog = new blogModel(req.body)
    const {_id} = await newBlog.save()
      res.status(200).send({_id});
    } catch (error) {
      next(error);
    }
  });
  blogsRouter.get("/:blogId", async (req, res, next) => {
    try {
        const id = req.params.blogId

        const blog = await blogModel.findById(id)
        if (blog) {
          res.send(blog)
        } else {
          next(createHttpError(404, `User with id ${id} not found!`))
        }
     
  
   
    } catch (error) {
      next(error);
    }
  });
  blogsRouter.put("/:blogId", async (req, res, next) => {
    try {
     
  
        const id = req.params.blogId
        const updatedBlog = await blogModel.findByIdAndUpdate(id, req.body, { new: true })
    
        if (updatedBlog) {
          res.send(updatedBlog)
        } else {
          next(createHttpError(404, `User with id ${id} not found!`))
        }
  
    } catch (error) {
      next(error);
    }
  });
  blogsRouter.delete("/:blogId", async (req, res, next) => {
    try {
        const id = req.params.blogId
        const deleteBlog = await blogModel.findByIdAndDelete(id)
        if (deleteBlog) {
            res.status(204).send()
          } else {
            next(createHttpError(404, `User with id ${id} not found!`))
  
          }
    
    } catch (error) {
      next(error);
    }
  });



  export default blogsRouter