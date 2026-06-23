import express from "express";

const app = express()
const PORT = 3001

app.get("/health", (_req, res) => {
    res.status(200).json({status : "ok"})
})

app.listen(PORT, () => {
    console.log(`API running on http://localhost:${PORT}`)
})
