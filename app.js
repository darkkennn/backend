import { configDotenv } from 'dotenv';
import express from 'express';
import connectDb from './src/config/mongo.config.js';
import { redirectFromShortUrl } from './src/controller/shortUrl.controller.js';
import shortUrlRoutes from './src/routes/shortUrl.route.js';
import authRoutes from './src/routes/auth.route.js';
import { errorHandler } from './src/utils/errorHandler.js';
import admin from 'firebase-admin';
import cors from 'cors';

configDotenv({ path: "./.env" });

admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_ADMIN_KEY))
});

const app = express();

const corsOptions = {
  origin: 'https://url-shortener-front-pi.vercel.app',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204
};
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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