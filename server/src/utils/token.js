import jwt from "jsonwebtoken"
import { asyncHandler } from "./asyncHandler.js"

export  const getToken =  asyncHandler(async (user)=>{
     try {
        const token = jwt.sign({
            _id:this._id
        },
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_SECRET_EXPIRY
            }
        )
        console.log(token);
        return token
        
     } catch (error) {
        console.log(error);
        
        
     }
 }
)