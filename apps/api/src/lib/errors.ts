export type ErrorCode = 
    | "VALIDATION_ERROR"
    | "EMAIL_EXISTS"
    | "INVALID_CREDENTIALS"
    | "INVALID_REFRESH_TOKEN"
    | "UNAUTHORIZED"
    | "SERVER_ERROR"


export class AppError extends Error {
    constructor(
        public readonly code: ErrorCode,
        public readonly statusCode: number,
        message: string
    ) {
        super(message);
        this.name = "AppError"
    }
}