// backend/app.js
import { configDotenv } from 'dotenv';
import express from 'express';
import connectDb from './src/config/mongo.config.js';
import { redirectFromShortUrl } from './src/controller/shortUrl.controller.js';
import shortUrlRoutes from './src/routes/shortUrl.route.js';
import authRoutes from './src/routes/auth.route.js';
import { errorHandler } from './src/utils/errorHandler.js';
import admin from 'firebase-admin';

configDotenv({ path: "./.env" });

admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_ADMIN_KEY))
});

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/api/create-test", (req, res) => {
    console.log("Received test POST request to /api/create-test");
    console.log("Request Body:", req.body);
    res.status(200).json({ message: "Test POST successful!", receivedUrl: req.body.url });
});

app.use("/api", shortUrlRoutes);
app.use("/api/auth", authRoutes);

app.get("/:id", redirectFromShortUrl);

app.get("/", (req, res) => {
  res.send("Welcome to the URL Shortener API");
});

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  connectDb();
  console.log(`Server is running on http://localhost:${PORT}`);
});