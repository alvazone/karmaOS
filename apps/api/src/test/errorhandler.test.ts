import { Request, Response } from "express"
import { AppError } from "../lib/errors"
import { errorHandler } from "../middleware/errorHandler"

function mockResponse() {
    const json = jest.fn()
    const status = jest.fn().mockReturnValue({ json })
    const res = { status } as unknown as Response
    return { res, status, json } 
}

describe("errorHandler", () => {
    it("returns structured response for AppError", () => {
        const err = new AppError("VALIDATION_ERROR", 400, "Invalid input")
        const { res, status, json } = mockResponse()

        errorHandler(err, {} as Request, res, jest.fn())

        expect(status).toHaveBeenCalledWith(400)
        expect(json).toHaveBeenCalledWith({
            error: {
                code: "VALIDATION_ERROR",
                message: "Invalid input"
            }
        })
    })

    it("returns SERVER_ERROR for unknown errors", () => {
        const { res, status, json } = mockResponse()
        
        errorHandler(new Error("boom"), {} as Request, res, jest.fn())

        expect(status).toHaveBeenCalledWith(500)
        expect(json).toHaveBeenCalledWith({
            error: {
                code: "SERVER_ERROR",
                message: "Unexpected server failure"
            }
        })

    })
})