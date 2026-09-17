import {Router} from "express"
import { isAuth } from "../middleware/isAuthMiddleware.js"
import { pdfDownload } from "../controllers/pdf.controller.js"

const router = Router()

router.route("/generate-pdf").post(isAuth,pdfDownload)

export default router