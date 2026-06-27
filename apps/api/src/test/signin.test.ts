import request from "supertest"
import { createApp } from "../app"
import { disconnectDb } from "../lib/prisma"
import { truncateAuthTables } from "./db"

describe("POST /auth/signin", () => {
    afterAll(async () => {
        await disconnectDb()
    })

    beforeEach(async () => {
        await truncateAuthTables()
    })

    it("returns 200 with jwt, refresh_token, and onboarding_complete", async () => {
        const app = createApp()

        const credentials = {
            email: "jane@example.com",
            password: "SecurePass1!"
        }

        await request(app)
            .post("/auth/signup")
            .send({
                name: "Jane Doe",
                ...credentials,
                timezone: "America/New_York"
            })
        
        const response = await request(app)
            .post("/auth/signin")
            .send(credentials)
        
        expect(response.status).toBe(200)
        expect(response.body).toEqual({
            jwt: expect.any(String),
            refresh_token: expect.any(String),
            onboarding_complete: false
        })
    })

    it("returns 400 VALIDATION_ERROR when password is missing", async () => {
        const app = createApp()

        const response = await request(app)
            .post("/auth/signin")
            .send({
                email: "jane@example.com"
            })
        
        expect(response.status).toBe(400)
        expect(response.body).toEqual({
            error: {
                code: "VALIDATION_ERROR",
                message: expect.any(String)
            }
        })
    })

    it("returns 401 INVALID_CREDENTIALS for wrong password", async () => {
        const app = createApp()

        const credentials = {
            email: "jane@example.com",
            password: "SecurePass1!"
        }

        await request(app)
            .post("/auth/signup")
            .send({
                name: "Jane Doe",
                ...credentials,
                timezone: "America/New_York"
            })
        
        const response = await request(app)
            .post("/auth/signin")
            .send({ ...credentials, password: "WrongPass99!"})
        
        expect(response.status).toBe(401)
        expect(response.body).toEqual({
            error: {
                code: "INVALID_CREDENTIALS",
                message: expect.any(String)
            }
        })
    })

    it("returns 401 INVALID_CREDENTIALS for unknown email", async () => {
        const app = createApp()

        const response = await request(app)
            .post("/auth/signin")
            .send({
                email: "nobody@example.com",
                password: "SecurePass1!"
            })

        expect(response.status).toBe(401)
        expect(response.body).toEqual({
            error: {
                code: "INVALID_CREDENTIALS",
                message: expect.any(String)
            }
        })
    })
})