import { AppError } from "../../lib/errors";
import type { SignUpInput, SignInInput } from "./auth.service";

function assertPasswordPolicy(password: string): void {
    if (password.length < 12 || password.length > 128) {
        throw new AppError("VALIDATION_ERROR", 400, "Password does not meet requirements");
    }
    if (!/[a-zA-Z]/.test(password)) {
        throw new AppError("VALIDATION_ERROR", 400, "Password does not meet requirements");
    }
    if (!/\d/.test(password)) {
        throw new AppError("VALIDATION_ERROR", 400, "Password does not meet requirements");
    }
    if (!/[^a-zA-Z0-9]/.test(password)) {
        throw new AppError("VALIDATION_ERROR", 400, "Password does not meet requirements");
    }
}

export function validateSignUpBody(body: unknown): SignUpInput {
    if (body === null || typeof body !== "object") {
        throw new AppError("VALIDATION_ERROR", 400, "Invalid Request Body")
    }

    const { name, email, password, timezone } = body as Record<string, unknown>

    if (typeof name !== "string" || name.trim() === "") {
        throw new AppError("VALIDATION_ERROR", 400, "Name is required")
    }

    if (typeof email !== "string" || email.trim() === "") {
        throw new AppError("VALIDATION_ERROR", 400, "Email is required")
    }

    if (typeof password !== "string" || password.trim() === "") {
        throw new AppError("VALIDATION_ERROR", 400, "password is required")
    }
    assertPasswordPolicy(password)

    if (typeof timezone !== "string" || timezone.trim() === "") {
        throw new AppError("VALIDATION_ERROR", 400, "Timezone is required")
    }

    return { name, email, password, timezone }
}

export function validateSignInBody(body: unknown): SignInInput {
    if (body === null || typeof body !== "object") {
        throw new AppError("VALIDATION_ERROR", 400, "Invalid request body")
    }

    const { email , password } = body as Record<string, unknown>

    if (typeof email !== "string" || email.trim() === "") {
        throw new AppError("VALIDATION_ERROR", 400, "Email is required")
    }

    if (typeof password !== "string" || password === "") {
        throw new AppError("VALIDATION_ERROR", 400, "Passowrd is required")
    }

    return { email, password }
}