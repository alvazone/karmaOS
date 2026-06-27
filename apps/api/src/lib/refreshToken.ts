import crypto from "crypto"

const REFRESH_TOKEN_BYTES = 32
const REFRESH_TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000

export function generateRefreshToken(): string {
    return crypto.randomBytes(REFRESH_TOKEN_BYTES).toString("base64url")
}

export function hashRefreshToken(rawToken: string) : string {
    return crypto
        .createHash("sha256")
        .update(rawToken + process.env.REFRESH_TOKEN_PEPPER!)
        .digest("hex")
}

export function refreshTokenExpiresAt():Date {
    return new Date(Date.now() + REFRESH_TOKEN_TTL_MS)
}