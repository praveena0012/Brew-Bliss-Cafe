import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

//Routers
import reservationRouter from "./routes/reservationsRouter.js";


dotenv.config();
const app = express()

// For serving frontend
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, "public")));

//middleware
app.use(cors())
app.use(express.json())

//database connection
const connectionString = "mongodb+srv://pramira2:12345@cluster0.3ksb8xk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

mongoose
    .connect(connectionString)
    .then(() => console.log("Database Connected."))
    .catch((err) => {
        console.error("Database Connection Failed.", err?.message);
    });
app.set('etag', false);


// API Routes
app.use("/api/reservations", reservationRouter);

// Health check endpoint
app.get("/api/health", (req, res) => {
    res.status(200).json({
        message: "Brew Bliss Cafe API is running",
        timestamp: new Date().toISOString(),
        status: "healthy"
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`API running on http://localhost:${PORT}`);
})



