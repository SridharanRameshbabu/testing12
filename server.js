// import express from "express";
// import cors from "cors";
// import dotenv from "dotenv";
// import sequelize from "./config/db.js";
// import applicationRoutes from "./routes/applicationRoutes.js";

const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const sequelize = require('./config/db.js')
const applicationRoutes = require('./routes/applicationRoutes.js')
// import Application from "./models/Application.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/api", applicationRoutes);

const PORT = process.env.PORT || 5000;

// Sync DB and start server
sequelize
  .sync({alter:false})
  .then(() => {

    console.log("✅ PostgreSQL Connected & Synced via Sequelize");
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => console.error("❌ DB Connection Failed:", err));
