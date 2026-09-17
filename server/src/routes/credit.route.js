import   { Router } from "express"
import { isAuth } from "../middleware/isAuthMiddleware.js"
import { createCreditsOrder } from "../controllers/credits.controller.js"

const router = Router()

router.route('/order').post(isAuth,createCreditsOrder)
 


export default router