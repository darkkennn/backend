import { configDotenv } from 'dotenv';
import express from 'express';
import connectDb from './src/config/mongo.config.js';
import { redirectFromShortUrl } from './src/controller/shortUrl.controller.js';
import shortUrlRoutes from './src/routes/shortUrl.route.js';
import authRoutes from './src/routes/auth.route.js';
import { errorHandler } from './src/utils/errorHandler.js';
import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const serviceAccountPath = path.resolve(__dirname, './firebase-admin-key.json');
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

configDotenv({ path: "./.env" });

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", shortUrlRoutes);
app.use("/api/auth", authRoutes);

app.get("/:id", redirectFromShortUrl);

app.get("/", (req, res) => {
  res.send("Welcome to the URL Shortener API");
});

app.use(errorHandler);

app.listen(3000, () => {
  connectDb();
  console.log('Server is running on http://localhost:3000');
});