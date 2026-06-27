import { PrismaClient } from "@karmaOS/db";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
})

const adapter = new PrismaPg(pool)

const globalForPrisma = globalThis as typeof globalThis & {
    prisma? : PrismaClient
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({adapter})

if(process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prisma
}

export async function disconnectDb(): Promise<void> {
    await prisma.$disconnect()
    await pool.end()
}