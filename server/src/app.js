 import express from "express"
 import cors from "cors"
 import cookieParser from "cookie-parser"
 import { stripeWebhook } from "./controllers/credits.controller.js"
 
 const app = express()
 
 app.use(cors({
     origin:"https://examnotesaiclient-39p8.onrender.com"
     ,credentials:true
     ,methods:["GET","POST","PUT","DELETE","OPTIONS"]
 }))

 app.post(
    "/api/credits/webhook",
    express.raw({type:"application/json"}),
    stripeWebhook
 )

 app.use(express.json({limit:"16kb"}))
 app.use(express.urlencoded({extended:true, limit:"16kb"}))
 app.use(express.static("public"))
 app.use(cookieParser())


//routes import 
import authRouter from "./routes/auth.route.js"
import userRouter from "./routes/user.route.js"
import notesRouter from "./routes/generate.route.js"
import pdfRouter from "./routes/pdfDownload.route.js"
import creditRouter from "./routes/credit.route.js"
 

//routes
app.use("/api/auth",authRouter)
app.use("/api/user",userRouter)
app.use("/api/notes",notesRouter)
app.use("/api/pdf",pdfRouter)
app.use("/api/credit",creditRouter)



 export {app}
