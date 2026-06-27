describe("test environment", () => {
    it("loads DATABASE_URL from .env.test", () => {
        expect(process.env.DATABASE_URL).toBeDefined()
        expect(process.env.JWT_SECRET).toBeDefined()
        expect(process.env.REFRESH_TOKEN_PEPPER).toBeDefined()
    })
})