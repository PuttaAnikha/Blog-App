import  exp from "express";
import { config } from "dotenv";
import { connect } from "mongoose";
import { userApp } from "./APIs/UserAPI.js";
import { authorApp } from "./APIs/AuthorAPI.js";
import { adminApp } from "./APIs/AdminAPI.js";
import { commonApp } from "./APIs/CommonAPI.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

config({ path: `${__dirname}/.env` });
//create express app
const app = exp();
//add cookie parser middeleware
app.use(cookieParser())
//add cors middleware
const allowedOrigins = ["http://localhost:5173", "http://127.0.0.1:5173"];
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}))
//body parser middleware with increased limit for Base64 images
app.use(exp.json({ limit: "5mb" }));
app.use(exp.urlencoded({ extended: true }));


//path level middlewares
app.use("/user-api", userApp);
app.use("/author-api", authorApp);
app.use("/admin-api", adminApp);
app.use("/auth", commonApp);

//connect to db
const connectDB = async () => {
  try {
    await connect(process.env.DB_URL);
    console.log("-----------------------------------------");
    console.log("✅ MongoDB Connected Successfully");
    
    //assign port
    const port = process.env.PORT || 4000;
    app.listen(port, () => {
      console.log(`🚀 Server is running on port ${port}`);
      console.log(`📡 Backend URL: http://localhost:${port}`);
      console.log("-----------------------------------------");
    });
  } catch (err) {
    console.log("-----------------------------------------");
    console.log("❌ CRITICAL: Database connection failed!");
    console.log("Make sure your MongoDB server is running.");
    console.log("Error details:", err.message);
    console.log("-----------------------------------------");
    process.exit(1); // Exit if DB connection fails to avoid state inconsistencies
  }
};

connectDB();

//to handle invalid path
app.use((req, res, next) => {
  console.log(req.url);
  res.status(404).json({ message: `path ${req.url} is invalid` });
});

//Error handling middleware
app.use((err, req, res, next) => {
  console.log("error is ",err)
  console.log("Full error:", JSON.stringify(err, null, 2));
  //ValidationError
  if (err.name === "ValidationError") {
    return res.status(400).json({ message: "error occurred", error: err.message });
  }
  //CastError
  if (err.name === "CastError") {
    return res.status(400).json({ message: "error occurred", error: err.message });
  }
  const errCode = err.code ?? err.cause?.code ?? err.errorResponse?.code;
  const keyValue = err.keyValue ?? err.cause?.keyValue ?? err.errorResponse?.keyValue;

  if (errCode === 11000) {
    const field = Object.keys(keyValue)[0];
    const value = keyValue[field];
    return res.status(409).json({
      message: "error occurred",
      error: `${field} "${value}" already exists`,
    });
  }

  //send server side error
  res.status(500).json({ 
    message: "error occurred", 
    error: err.message || "Server side error",
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined
  });
});