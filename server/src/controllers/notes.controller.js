import { Notes } from "../models/notes.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

 export const getMyNotes = asyncHandler(async (req, res) => {
  const notes = await Notes.find({ user: req.user._id })
    .select(
      "topic classlevel examType revisionMode includeDiagram includeChart createdAt",
    )
    .sort({ createdAt: -1 });

  if (!notes) {                                          // ✅ fixed
    throw new ApiError(401, "Something went wrong while fetching notes", {});
  }

  return res.status(200).json(new ApiResponse(200, notes, "Successfully")); // ✅ fixed
});

export const getSingleNotes = asyncHandler(async (req, res) => {
  const notes = await Notes.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!notes) {
    throw new ApiError(404, "Notes not found",{});
  }

  const finalNotes = await Notes.create({
    content:notes.content,
    topic:notes.topic,
    createdAt:notes.createdAt
  })

  return res.
  status(200).
  json(new ApiResponse(200,finalNotes,""))
});
