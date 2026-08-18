import express from "express";
import cors from "cors";
import 'dotenv/config';
import mongoose from "mongoose";
import chatroutes from "./routes/chat.js";
import authroutes from "./routes/auth.js";

const app = express();

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));


const connectDB = async () => {
    try {
        if (mongoose.connection.readyState === 1) {
            return;
        }
        if (!process.env.MONGO_URI) {
            console.error("MONGO_URI is missing in environment variables!");
            throw new Error("MONGO_URI environment variable is not defined");
        }
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected with Database");
    } catch (err) {
        console.error("Failed to connect with Database:", err.message);
        throw err;
    }
};

// Middleware to ensure DB connection before handling API routes
app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (err) {
        return res.status(500).json({ error: "Database connection failed. " + err.message });
    }
});

app.use("/api/auth", authroutes);
app.use("/api", chatroutes);

// 404 JSON handler for unhandled API routes
app.use("/api", (req, res) => {
    res.status(404).json({ error: `API endpoint ${req.originalUrl} not found.` });
});

// Global JSON error handler
app.use((err, req, res, next) => {
    console.error("Server Error:", err);
    res.status(err.status || 500).json({ error: err.message || "Internal Server Error" });
});

if (process.env.NODE_ENV !== "production") {
    const port = 8080;
    app.listen(port, () => {
        console.log(`Listening on port ${port}`);
    });
}

export default app;