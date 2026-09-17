import mongoose ,{Schema} from "mongoose";
import jwt from "jsonwebtoken"

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true,
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    credits:{
        type:Number,
        default:50,
        min:0
    },
    isCreditAvailable:{
        type:Boolean,
        default:true
    },
    notes:{
        type:[mongoose.Types.ObjectId],
        ref:"Notes",
        default:[]
    },
    refreshToken:{
        type:String
    }

},{timestamps:true})

userSchema.methods.generateAccessToken = function(){
    return jwt.sign({
        _id:this._id
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn:process.env.JWT_SECRET_EXPIRY
    }

)
}
userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id:this._id
        }
        ,process.env.REFRESH_TOKEN_SECRET
        ,{
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model("User",userSchema)


