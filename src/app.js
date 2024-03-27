import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import colors from "colors";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json({ limit: "50kb" }));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true, limit: "50kb" }));
app.use(cors({ origin: process.env.CORS_ORGIN, credentials: true }));
app.use(cookieParser());

export default app;
