import type { Express } from "express"
import { authRouter } from "../modules/auth/auth.router"

export function registerRoutes(app: Express) {
    app.get("/health", (_req, res) => {
        res.status(200).json({ status : "ok" })
    })

    app.use("/auth", authRouter)
}
