import path from "path"
import dotenv from "dotenv"

const envPath = path.resolve(__dirname, "../../.env.test")

dotenv.config({ path: envPath })

if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is missing — check apps/api/.env.test")
}

if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is missing — check apps/api/.env.test")
}

if (!process.env.REFRESH_TOKEN_PEPPER) {
    throw new Error("REFRESH_TOKEN_PEPPER is missing — check apps/api/.env.test")
}