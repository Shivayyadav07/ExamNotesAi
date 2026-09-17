import {Router} from "express"
import { getCurrentUser } from "../controllers/user.controller.js"
import { isAuth } from "../middleware/isAuthMiddleware.js"

const router = Router()

router.route("/currentuser").get(isAuth,getCurrentUser)

export default router