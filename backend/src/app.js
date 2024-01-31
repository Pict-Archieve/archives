import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

// App
const app = express();

// Cors
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

// Json Limit
app.use(express.json({ limit: "16kb" }));

// Url Encoding "+"
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

// Public Data
app.use(express.static("public"));

// Cookie Parser
app.use(cookieParser());

// Routes imports

import userRouter from "./routes/user.routes.js";

// Routes Declaration

app.use("/api/v1/users", userRouter);

export default app;
