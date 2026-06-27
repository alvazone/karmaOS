import { disconnectDb, prisma } from '../lib/prisma'
import { truncateAuthTables } from './db'

describe("truncateAuthTables", () => {
    afterAll(async () => {
        await disconnectDb()
    })

    beforeEach(async () => {
        await truncateAuthTables()
    })

    it("removes all auth rows", async () => {
        await prisma.user.create({
            data: {
                name: "Test User",
                email: "test@example.com",
                passwordHash: "fake-hash-for-test",
                timezone: "America/New_York"
            }
        })

        const before = await prisma.user.count()
        expect(before).toBe(1)

        await truncateAuthTables()

        const after = await prisma.user.count()
        expect(after).toBe(0)
    })
})