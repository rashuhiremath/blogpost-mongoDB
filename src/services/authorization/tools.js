import jwt from "jsonwebtoken"


export const tokenAuthenticate =async author =>{
    const accessToken = await generateToken({_id:author._id})
    return accessToken
}

const generateToken =payload=>
new Promise((resolve,reject) =>
jwt.sign(payload, process.env.TOKEN_SECRET, { expiresIn: "15m" }, (err, token) => {
  if (err) reject(err)
  else resolve(token)
})
)

export const verfityToken = token=>
new Promise((resolve,reject) =>
jwt.verify(token, process.env.TOKEN_SECRET, { expiresIn: "15m" }, (err, decodedToken) => {
  if (err) reject(err)
  else resolve(decodedToken)
})
)