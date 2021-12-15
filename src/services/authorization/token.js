import createHttpError from "http-errors";
import authorModel from "../authors/schema.js"
import {verfityToken} from "./tools.js"

export const JWTtokenMiddleware = async (req,res,next)=>{

if(!req.headers.authorization){
    next(createHttpError(401,"provide the token for authorization"))
}else{
    try {
        const token = req.headers.authorization.replace("Bearer ","")

        const decodeToken = await verfityToken(token)

        const author = await authorModel.findById(decodeToken._id)

        if(author){
            req.author=author
            next()
        }else{
            next(createHttpError(401,"user not found"))
        }
    } catch (error) {
        next(createHttpError("provide the credential"))
    }

}
}