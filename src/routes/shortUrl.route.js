import express from 'express';
const router = express.Router();

import { createShortUrl, getUserUrls } from '../controller/shortUrl.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

router.post("/create", authenticateToken, createShortUrl);
router.get("/user", authenticateToken, getUserUrls);

export default router;