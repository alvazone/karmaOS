import express from "express"
import { registerRoutes } from "./routes/index"
import { errorHandler } from "./middleware/errorHandler"

export function createApp() {
    const app = express()

    app.use(express.json())

    registerRoutes(app)

    app.use(errorHandler)

    return app
}