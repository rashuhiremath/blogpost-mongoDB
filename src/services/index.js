import express from "express";
import uniqid from "uniqid";
import createError from "http-errors";
import createHttpError from "http-errors"
import multer from "multer";
import blogModel from "./schema.js"
import { CloudinaryStorage } from "multer-storage-cloudinary"
import { v2 as cloudinary } from "cloudinary"

//get blogs
const blogsRouter = express.Router();

const cloudinaryStorage = new CloudinaryStorage({
    cloudinary, // CREDENTIALS, this line of code is going to search in your process.env for something called CLOUDINARY_URL
    params: {
      folder: "Mongo",
    },
  })
  
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
  // image post
  blogsRouter.post("/:blogId/uploadCloudinary", multer({ storage: cloudinaryStorage }).single("image"), async (req, res, next) => {
    try {
        const id = req.params.blogId
      const result = await blogModel.findByIdAndUpdate(id,req.body,{new:true})
        
      res.send({result})
    } catch (error) {
      next(error)
    }
  })


  //grt by id
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