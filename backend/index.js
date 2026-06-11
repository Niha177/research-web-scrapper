import express from "express"
import cors from "cors"

const PORT = 4000
const app = express()

app.use(cors())
app.use(express.json())

app.get("/api/testing", (req,res) => {
    res.json({message: "hello from backend"})
})

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})