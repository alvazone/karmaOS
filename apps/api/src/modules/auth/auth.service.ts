import bcrypt from "bcrypt"
import { prisma } from "../../lib/prisma";
import { AppError } from "../../lib/errors";
import { signAccessToken } from "../../lib/jwt";
import { 
    generateRefreshToken, 
    hashRefreshToken, 
    refreshTokenExpiresAt
} from "../../lib/refreshToken"
import { Prisma } from "@karmaOS/db";

const BCRYPT_COST = 12

export type SignUpInput = {
    name: string;
    email: string;
    password: string;
    timezone: string;
}

export type SignUpResult = {
    jwt: string;
    refresh_token: string;
    onboarding_complete: boolean;
}


export async function signUp(input: SignUpInput): Promise<SignUpResult> {
    const email = input.email.trim().toLowerCase()
    const passwordHash = await bcrypt.hash(input.password, BCRYPT_COST)

    try {
        const user = await prisma.user.create({
            data: {
                name: input.name.trim(),
                email,
                passwordHash,
                timezone: input.timezone.trim(),
                calendars: {
                    create: {
                        name: "My Calendar",
                        type: "native",
                        color: "#FFFFFF"
                    }
                }
            }
        })

        const accessToken = signAccessToken(user.id)
        const rawRefreshToken = generateRefreshToken()

        await prisma.refreshToken.create({
            data: {
                userId : user.id,
                tokenHash: hashRefreshToken(rawRefreshToken),
                expiresAt: refreshTokenExpiresAt()
            }
        })

        return {
            jwt: accessToken,
            refresh_token: rawRefreshToken,
            onboarding_complete: false
        }
    } catch (err) {
        if (
            err instanceof Prisma.PrismaClientKnownRequestError &&
            err.code === "P2002"
        ) {
            throw new AppError("EMAIL_EXISTS", 409, "Email already registered.")
        }
        throw err
    }
}

export type SignInInput = {
    email: string,
    password: string
}

export type SignInResult = SignUpResult

export async function signIn(input: SignInInput): Promise<SignInResult> {
    const email = input.email.trim().toLowerCase()

    const user = await prisma.user.findUnique({
        where: { email }
    })

    if (!user || user.deletedAt !== null) {
        throw new AppError("INVALID_CREDENTIALS", 401, "Invalid credentials.")
    }

    const passwordMatch = await bcrypt.compare(input.password, user.passwordHash)
    if (!passwordMatch) {
        throw new AppError("INVALID_CREDENTIALS", 401, "Invalid credentials.")
    }

    const accessToken = signAccessToken(user.id)
    const rawRefreshToken = generateRefreshToken()

    await prisma.refreshToken.create({
        data: {
            userId: user.id,
            tokenHash: hashRefreshToken(rawRefreshToken),
            expiresAt: refreshTokenExpiresAt()
        }
    })

    return {
        jwt: accessToken,
        refresh_token: rawRefreshToken,
        onboarding_complete: user.onboardingComplete
    }
}

export type RefreshTokenResult = {
    jwt: string,
    refresh_token: string
}

export async function refreshToken(): Promise<RefreshTokenResult> {
    throw new Error("Not Implemented")
}