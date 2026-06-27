import request from "supertest";
import { createApp } from "../app";
import { disconnectDb, prisma } from "../lib/prisma";
import { truncateAuthTables } from "./db";

describe('POST /auth/signup', () => {
    afterAll(async () => {
        await disconnectDb()
    })

    beforeEach(async () => {
        await truncateAuthTables()
    })

    it("returns 201 with jwt, refresh_token, and onboarding_complete false", async () => {
        const app = createApp()

        const response = await request(app)
            .post("/auth/signup")
            .send({
                name: "Jane Doe",
                email: "jane@example.com",
                password: "SecurePass1!",
                timezone: "America/New_York"
            })
        
        expect(response.status).toBe(201)
        expect(response.body).toEqual({
            jwt: expect.any(String),
            refresh_token: expect.any(String),
            onboarding_complete: false
        })
    })

    it("returns 400 VALIDATION_ERROR when password is missing", async () => {
        const app = createApp()

        const response = await request(app)
            .post("/auth/signup")
            .send({
                name: "Jane Doe",
                email: "jane@example.com",
                timezone: "America/New_York"
            })
        
        expect(response.status).toBe(400);
        expect(response.body).toEqual({
            error : {
                code: "VALIDATION_ERROR",
                message: expect.any(String)
            }
        })
    })

    it("returns 400 VALIDATION_ERROR when password is too weak", async () => {
        const app = createApp()

        const response = await request(app)
            .post("/auth/signup")
            .send({
                name: "Jane Doe",
                email: "jane@example.com",
                password: "short",
                timezone: "America/New_York"
            })

        expect(response.status).toBe(400)
        expect(response.body).toEqual({
            error : {
                code: "VALIDATION_ERROR",
                message: expect.any(String)
            }
        })
    })

    it("creates user with default calendar in database", async () => {
        const app = createApp()

        await request(app)
            .post("/auth/signup")
            .send({
                name: "Jane Doe",
                email: "jane@example.com",
                password: "SecurePass1!",
                timezone: "America/New_York",
            })
        
        const user = await prisma.user.findFirst({
            where: { email: "jane@example.com" },
            include: { calendars: true }
        })

        expect(user).not.toBeNull()
        expect(user!.name).toBe("Jane Doe")
        expect(user!.timezone).toBe("America/New_York")
        expect(user!.onboardingComplete).toBe(false)
        expect(user!.passwordHash).not.toBe("SecurePass1!")
        expect(user!.calendars).toHaveLength(1)
        expect(user!.calendars[0].name).toBe("My Calendar")
        expect(user!.calendars[0].type).toBe("native")
        expect(user!.calendars[0].color).toBe("#FFFFFF")
    })

    it("returns 409 EMAIL_EXISTS when email is already registered", async () => {
        const app = createApp()

        const body = {
            name: "Jane Doe",
            email: "jane@example.com",
            password: "SecurePass1!",
            timezone: "America/New_York",
        }

        await request(app).post("/auth/signup").send(body)

        const response = await request(app).post("/auth/signup").send(body)

        expect(response.status).toBe(409)
        expect(response.body).toEqual({
            error: {
                code: "EMAIL_EXISTS",
                message: expect.any(String)
            }
        })
    })
})

