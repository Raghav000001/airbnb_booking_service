import dotenv from "dotenv"
dotenv.config()  
import { genericErrorHandler } from "./middlewares/error.middleware.ts"
import { attachCorelationId } from "./middlewares/corelation.middleware.ts"
import express from "express"
import { serverConfig } from "./config/index.ts"
const app = express()


app.use(express.json())
app.use(express.urlencoded({ extended: true }))


// add a correlationId to every request 
app.use(attachCorelationId)



// custom routes import
import v1Router from "./routes/v1/index.routes.ts"
import v2Router from "./routes/v2/index.router.ts"
import logger from "./config/logger.config.ts"

// routes implementation
// api versioning
app.use("/api/v1",v1Router)
app.use("/api/v2",v2Router)



// custome error handler middleware to handle all the errors in the application
app.use(genericErrorHandler)



app.listen(serverConfig.PORT,()=> {
    logger.info(`app is running on port: ${serverConfig.PORT}`);
})