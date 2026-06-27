import jwt from "jsonwebtoken"

const JWT_EXPIRY = "15m"

export function signAccessToken(userId: string) : string {
    return jwt.sign({sub: userId}, process.env.JWT_SECRET! , {
        expiresIn: JWT_EXPIRY
    })
}
