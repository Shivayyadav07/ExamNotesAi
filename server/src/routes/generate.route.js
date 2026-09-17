import { Router } from "express";
import { isAuth } from "../middleware/isAuthMiddleware.js";
import { generateNotes } from "../controllers/generate.controller.js";
import { getMyNotes, getSingleNotes } from "../controllers/notes.controller.js";
 

const router = Router()
router.route("/generate-notes").post(isAuth,generateNotes)
router.route("/getNotes").get(isAuth,getMyNotes)
router.route("/:id").get(isAuth,getSingleNotes)

export default router