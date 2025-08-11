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
  origin: (origin, callback) => {
    const allowedOrigins = [
      process.env.FRONTEND_URL,
      process.env.FRONTEND_URL ? `${process.env.FRONTEND_URL}/` : null,
      process.env.FRONTEND_URL ? process.env.FRONTEND_URL.replace(/\/$/, '') : null
    ].filter(Boolean);
    if (process.env.FRONTEND_URL) {
      const nonWww = process.env.FRONTEND_URL.replace(/^https?:\/\/(www\.)?/, 'https://');
      const www = process.env.FRONTEND_URL.replace(/^https?:\/\//, 'https://www.');
      allowedOrigins.push(nonWww);
      allowedOrigins.push(www);
      allowedOrigins.push(`${nonWww}/`);
      allowedOrigins.push(`${www}/`);
    }

    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.error(`CORS blocked: Origin ${origin} not in allowed list. Allowed: ${allowedOrigins.join(', ')}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
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