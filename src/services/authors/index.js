import express from "express"
import createHttpError from "http-errors"
import authorModel from "./schema.js"
//import {basicAuthMiddleware} from "../authorization/basicAuth.js"
import blogModel from "./schema.js"
import {tokenAuthenticate} from "../authorization/tools.js"
import {JWTtokenMiddleware} from "../authorization/token.js"
//import {JWTtokenMiddleware} from "../authorization/token"
import passport from "passport"


const authorRouter = express.Router()

// post the author
authorRouter.post("/register", async(req,res,next)=>{
try {
const newAuthor = new authorModel(req.body)
const {_id} = await newAuthor.save()
res.send({_id})
   
} catch (error) {
    next(error)
}
})
// get the author
authorRouter.get("/register",JWTtokenMiddleware  ,async (req,res,next)=>{
    try {
        const authors = await authorModel.find()
        if(authors){
            
        }
        res.send( authors)
        
    } catch (error) {
        next(error)
    }
    })

    //google login
    authorRouter.get("/googleLogin", passport.authenticate("google", { scope: ["profile", "email"] })) 

authorRouter.get("/googleRedirect", passport.authenticate("google"), async (req, res, next) => {
 
  try {
    
    console.log("TOKENS: ", req.author.tokens)

    res.redirect(`${process.env.FE_URL}?accessToken=${req.author.tokens.accessToken}&refreshToken=${req.author.tokens.refreshToken}`)
  } catch (error) {
    next(error)
  }
})


    authorRouter.get("/me", JWTtokenMiddleware , async (req, res, next) => {
        try {
          res.send(req.author)
        } catch (error) {
          next(error)
        }
      })
      authorRouter.put("/me", JWTtokenMiddleware , async (req, res, next) => {
        try {
          req.author.name = req.body
          await req.author.save()
          res.send()
        } catch (error) {
          next(error)
        }
      })
      authorRouter.delete("/me",JWTtokenMiddleware , async (req, res, next) => {
        try {
          await req.author.deleteOne()
          res.status(204).send()
        } catch (error) {
          next(error)
        }
      })

      authorRouter.get("/me/stories",JWTtokenMiddleware , async (req, res, next) => {
          try {

                const posts = await blogModel.find({author: req.author._id.toString()})
                res.status(200).send(posts)
            
              
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



                //for login
                authorRouter.post("/login", async (req, res, next) => {
                    try {
                     
                      const {email, password } = req.body
                
                      const author = await authorModel.checkTheCredentials(email, password)
                  
                      if (author) {
                       
                        const accessToken = await tokenAuthenticate(author)
                        res.send({ accessToken })
                      } else {
                        
                        next(createHttpError(401, "Credentials not ok!"))
                      }
                    } catch (error) {
                      next(error)
                    }
                  })
                  

                export default authorRouter