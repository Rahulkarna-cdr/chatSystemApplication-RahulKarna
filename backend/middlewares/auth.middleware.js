import jwt from "jsonwebtoken"
import config from "../config/config.js"

export const authenticateToken = (req, res, next) => {
    try{
        const token = req.headers.authorization?.split(" ")[1]
        if(!token){
            return res.status(403).json({message: "Token not found"})
        }
        jwt.verify(token, config.ACCESS_TOKEN_SECRET, (err, user) => {
            if(err){
                return res.status(403).json({message: "Invalid Token"})
            }
            req.user = user
            next()
        })

    }catch(err){
        return res.status(500).json({message: "internal server error"})
    }
 
};
