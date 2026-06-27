import { Router } from "express";
import { signUp, signIn, refreshToken } from "./auth.service";
import { validateSignUpBody, validateSignInBody } from "./auth.validation";

export const authRouter = Router()

authRouter.post("/signup", async (req, res, next) => {
    try {
        const input = validateSignUpBody(req.body)
        const result = await signUp(input);
        res.status(201).json(result)
    } catch(err) {
        next(err)
    }
})

authRouter.post("/signin", async (req, res, next) => {
    try {
        const input = validateSignInBody(req.body)
        const result = await signIn(input)
        res.status(200).json(result)
    } catch(err) {
        next(err)
    }
})

authRouter.post("/refresh", async (req, res, next) => {
    try {
        const result = await refreshToken()
        res.status(200).json(result)
    } catch (err) {
        next(err)
    }
})