import createHttpError from "http-errors"
import authorModel from "../authors/schema.js"
import atob from "atob"

export const basicAuthMiddleware = async (req,res,next)=>{
if(!req.headers.authorization){
next(createHttpError(401,"please provide the Authorization in header"))
} else{
    const base64Credential = req.headers.authorization.split(" ")[1]
    console.log(base64Credential)
    const decode = atob(base64Credential)

    const [email,password] = decode.split(":")

    const author = await authorModel.checkTheCredentials(email,password)

    if(author){
        req.author = author
      
        next()
    }
    else{
        next(createHttpError(401,"credentials are not correct"))
    }
}
}