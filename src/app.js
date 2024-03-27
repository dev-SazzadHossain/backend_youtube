import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import colors from "colors";
import cookieParser from "cookie-parser";
import mainRoute from "./Routes/main.route.js";

const app = express();

app.use(express.json({ limit: "50kb" }));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true, limit: "50kb" }));
app.use(cors({ origin: process.env.CORS_ORGIN, credentials: true }));
app.use(cookieParser());

// routes use
app.use(mainRoute);

export default app;
