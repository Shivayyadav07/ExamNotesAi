import { Notes } from "../models/notes.model.js";
import { User } from "../models/user.model.js";
import { generateGeminiResponse } from "../services/gemini.services.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { buildPrompt } from "../utils/promptBuilder.js";

const generateNotes = asyncHandler(async(req,res)=>{
    const {topic,
    classLevel,
    examType,
    revisionMode = false,
    includeDiagram = false,
    includeChart = false } = req.body

    if(!topic){
        throw new ApiError(400,"Topic is required ","")
    }

    const user = await User.findById(req.user._id)

    if(!user){
        throw new ApiError(400,"User is not found",{})
    }

    if(user.credits < 10){
        user.isCreditAvailable = false
        await user.save()
        return res
        .status(403)
        .json(new ApiResponse(403,"Insufficient credits",{}))
    }

    const prompt = buildPrompt({topic,
    classLevel,
    examType,
    revisionMode,
    includeDiagram ,
    includeChart  })

    const aiResponse = await generateGeminiResponse(prompt)

    const notes = await Notes.create({
        user : user._id,
        topic,
        classLevel,
        examType,
        revisionMode,
        includeDiagram ,
        includeChart,
        content:aiResponse
    })

    user.credits-=10

    if(user.credits<= 0) user.isCreditAvailable = false

    if(!Array.isArray(user.notes)){
        user.notes = []
    }
    user.notes.push(notes._id)

    await user.save()

    return res
    .status(200)
    .json(new ApiResponse(200,{
        data:aiResponse,
        noteId:notes._id,
        creditsLeft:user.credits
    },""))
})

export {generateNotes}