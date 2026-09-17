import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiResponse} from "../utils/ApiResponse.js"

  const getCurrentUser = asyncHandler(async(req,res)=>{
     
         
        return res
        .status(200)
        .json(new ApiResponse(200,req.user,"User found "))  
        
    

})

export {getCurrentUser}