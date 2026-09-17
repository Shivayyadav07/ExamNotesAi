import mongoose ,{Schema} from "mongoose";

const notesSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    topic:{
        type:String,
        required:true
    },

    classLevel: String,
    examType:String,

    revisionMode:{
        type:Boolean,
        default:false
    },
    includeDiagram:Boolean,
    includeChart:Boolean,

    content:{
        type:mongoose.Schema.Types.Mixed,  //AI response(String/json)
       // required:true
    }


},{timestamps:true})

export const Notes = mongoose.model("Notes",notesSchema)