import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { getToken } from "../utils/token.js";

const generateAccessAndRefreshToken = async(userId)=>{
    try{
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave:false })

        return {accessToken,refreshToken}
    }catch(error){
        throw new ApiError(500, "Token generation failed: " + error.message);
        
    }
}

const googleAuth = asyncHandler(async(req,res)=>{

    const{name,email} = req.body

    const excitedUser = await User.findOne({email})


    if(excitedUser){
        throw new ApiError(409,"User already exists")
    }

    const user = await User.create({
        name:name,
        email:email
    })

    const {accessToken,refreshToken} = await  generateAccessAndRefreshToken(user._id)
    const options = {
        httpOnly:  true,
        secure: true,
        sameSite:"none",
        maxAge:7 * 24 * 60 *60 * 1000
    }
    console.log(accessToken);
    console.log(refreshToken);
    
    
    return res
    .status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(
        new ApiResponse(200,
             
            {
                user
            },
            "google auth successfully"

        )
    )
})
const logout = asyncHandler(async(req,res)=>{
    await User.findByIdAndUpdate(req.user._id ,
        {
            $unset: {
                refreshToken:1
            }
        },
        {
            new:true
        }
    )
    const options = {
        httpOnly:true,
        secure:true
    }

    return res
    .status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(new ApiResponse(200 ,{},"User logged out"))
})

export {googleAuth,logout}