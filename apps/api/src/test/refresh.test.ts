import request from "supertest";
import { createApp } from "../app";
import { disconnectDb } from "../lib/prisma";
import { truncateAuthTables } from "./db";

describe ("POST /auth/refresh", () => {
    afterAll(async () => {
        await disconnectDb()
    })

    beforeEach(async () => {
        await truncateAuthTables()
    })

    it("returns 200 with new jwt and refresh_token", async () => {
        const app = createApp()

        const signupResponse = await request(app)
            .post("/auth/signup")
            .send({
                name: "Jane Doe",
                email: "jane@example.com",
                password: "SecurePass1!",
                timezone: "America/New_York",
            })
        
        const oldRefreshToken = signupResponse.body.refresh_token

        const response = await request(app)
            .post("/auth/refresh")
            .set("Authorization", `Bearer ${oldRefreshToken}`)
        
        expect(response.status).toBe(200)
        expect(response.body).toEqual({
            jwt: expect.any(String),
            refresh_token: expect.any(String)
        })
        expect(response.body.refresh_token).not.toBe(oldRefreshToken)
    })
})