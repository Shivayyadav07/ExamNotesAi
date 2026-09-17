import   { Router } from "express"
import { googleAuth, logout } from "../controllers/auth.controller.js"
import { isAuth } from "../middleware/isAuthMiddleware.js"

const router = Router()

router.route("/google").post(googleAuth)
router.route("/logout").get(isAuth,logout)

export default router