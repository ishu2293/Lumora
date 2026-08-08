import express from "express";
import cors from "cors";
import 'dotenv/config';
import mongoose from "mongoose";
import chatroutes from "./routes/chat.js";
import authroutes from "./routes/auth.js";

const app = express();

app.use(express.json());
app.use(cors());

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

// app.listen(port, () => {
//     console.log(`Listening on port ${port}`)
//     connectDB();
// });

// const connectDB = async() => {
//     try{
//         await mongoose.connect(process.env.MONGO_URI);
//         console.log("Connected with Database");
//     }catch(err){
//         console.log("Failed to connect with Database", err);
//     }
// }
if (process.env.NODE_ENV !== "production") {

    const port = 8080;

    app.listen(port, () => {
        console.log(`Listening on port ${port}`);
    });

}
const connectDB = async () => {
    try {
        if (mongoose.connection.readyState === 1) {
            return;
        }
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected with Database");
    } catch (err) {
        console.log("Failed to connect with Database", err);
    }
};

connectDB();

export default app;