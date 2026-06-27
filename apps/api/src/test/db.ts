import { prisma } from "../lib/prisma"

export async function truncateAuthTables(): Promise<void> {
    await prisma.$executeRawUnsafe(
        "TRUNCATE TABLE refresh_tokens, calendars, users CASCADE"
    );
}