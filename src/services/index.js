import express from "express";
//import uniqid from "uniqid";
//import createError from "http-errors";
import createHttpError from "http-errors";
import multer from "multer";
import blogModel from "./schema.js";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from "cloudinary";
import commentModel from "../services/comments/schema.js";
import q2m from "query-to-mongo"
//import authorModel from "../services/authors/schema.js"

//get blogs
const blogsRouter = express.Router();


const cloudinaryStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "Mongo",
  },
});

blogsRouter.get("/", async (req, res, next) => {
  try {

    const mongoQuery = q2m(req.query)
    console.log( mongoQuery)

    const totalBlogs = await blogModel.countDocuments(mongoQuery.criteria)
    const blogs = await blogModel.find(mongoQuery.criteria)
    .limit(mongoQuery.options.limit)
    .skip(mongoQuery.options.skip)
    .sort(mongoQuery.options.sort)
    .populate({path:"author", select:"name avatar" })

    res.status(200).send({links: mongoQuery.links("/blogPosts",totalBlogs), pageTotal: Math.ceil(totalBlogs / mongoQuery.options.limit),totalBlogs,blogs});
  } catch (error) {
    next(error);
  }
});

// post
blogsRouter.post("/", async (req, res, next) => {
  try {
    const newBlog = new blogModel(req.body);
    const { _id } = await newBlog.save();
    
    res.status(200).send({ _id });
  } catch (error) {
    next(error);
  }
});
// image post
blogsRouter.post(
  "/:blogId/uploadCloudinary",
  multer({ storage: cloudinaryStorage }).single("image"),
  async (req, res, next) => {
    try {
      const cover = req.file.path;
      console.log(cover)
      
      const id = req.params.blogId;
      const result = await blogModel.findByIdAndUpdate(id, {$set:{cover:cover}}, {
        new: true,
      });

      res.send({ result });
    } catch (error) {
      next(error);
    }
  }
);

//grt by id
blogsRouter.get("/:blogId", async (req, res, next) => {
  try {
    const id = req.params.blogId;

    const blog = await blogModel.findById(id).populate({path:"author", select:"name avatar" })
    if (blog) {
      res.send(blog);
    } else {
      next(createHttpError(404, `blog with id ${id} not found!`));
    }
  } catch (error) {
    next(error);
  }
});

blogsRouter.put("/:blogId", async (req, res, next) => {
  try {
    const id = req.params.blogId;
    const updatedBlog = await blogModel.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (updatedBlog) {
      res.send(updatedBlog);
    } else {
      next(createHttpError(404, `User with id ${id} not found!`));
    }
  } catch (error) {
    next(error);
  }
});
blogsRouter.delete("/:blogId", async (req, res, next) => {
  try {
    const id = req.params.blogId;
    const deleteBlog = await blogModel.findByIdAndDelete(id);
    if (deleteBlog) {
      res.status(204).send();
    } else {
      next(createHttpError(404, `blog with id ${id} not found!`));
    }
  } catch (error) {
    next(error);
  }
});
// comments
// post comment
blogsRouter.post("/:blogId/comments", async (req, res, next) => {
    try {
        console.log(req.body.commentId)
      const commentsToAdd = await commentModel.findById(req.body.commentId, {
        _id: 0,
      });
      console.log(commentsToAdd )
      if (commentsToAdd) {
        const addComment = {
          ...commentsToAdd.toObject(),
          commentDate: new Date(),
        };
        const updatedBlog = await blogModel.findByIdAndUpdate(
          req.params.blogId,
          {
            $push: { comments: addComment },
          },
          {
            new: true,
          }
        );
  
        if (updatedBlog) {
  
          res.send(updatedBlog);
        } else {
          next(
            createHttpError(404, `blog with id ${req.params.blogId} not found!`)
          );
        }
      } else {
        next(createHttpError(404, `comment with id not found!`));
      }
    } catch (error) {
      next(error);
    }
  });

blogsRouter.get("/:blogId/comments", async (req, res, next) => {
  try {
    const blogs = await blogModel.findById(req.params.blogId)
    if ( blogs) {
      res.send( blogs.comments)
    } else {
      next(createHttpError(404, `blog with id ${req.params.blogId} not found!`))
    }

  } catch (error) {
    next(error);
  }
});

blogsRouter.get("/:blogId/comments/:commentId", async (req, res, next) => {
  try {

    const blog= await blogModel.findById(req.params.blogId)
    if (blog) {
      const commented= blog.comments.find(comment => comment._id.toString() === req.params.commentId) // You CANNOT compare an ObjectId (book._id) with a string (req.params.productId) --> _id needs to be converted into a string
      if (commented) {
        res.send(commented)
      } else {
        next(createHttpError(404, `comment with id ${req.params.commentId} not found!`))
      }
    } else {
      next(createHttpError(404, `blog with id ${req.params.blogId} not found!`))
    }
  } catch (error) {
    next(error);
  }
});

blogsRouter.put("/:blogId/comments/:commentId", async (req, res, next) => {
  try {
    const blog = await blogModel.findById(req.params.blogId)

    if (blog) {
      const index = blog.comments.findIndex(comment => comment._id.toString() === req.params.commentId)

      if (index !== -1) {
       blog.comments[index] = { ...blog.comments[index].toObject(), ...req.body }
        await blog.save()
        res.send(blog)
      } else {
        next(createHttpError(404, `comment with id ${req.params.commentId} not found!`))
      }
    } else {
      next(createHttpError(404, `blog with id ${req.params.blogId} not found!`))
    }
  } catch (error) {
    next(error);
  }
});

blogsRouter.delete("/:blogId/comments/:commentId", async (req, res, next) => {
  try {
    const blogs = await blogModel.findByIdAndUpdate(
      req.params.blogId, 
      { $pull: { comments: { _id: req.params.commentId } } }, 
      { new: true } 
    )
    if ( blogs) {
      res.send( blogs)
    } else {
      next(createHttpError(404, `blog with id ${req.params.blogId} not found!`))
    }
  } catch (error) {
    next(error);
  }
});

export default blogsRouter;
