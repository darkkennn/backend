import { getShortUrl, getAllShortUrls, updateUrlClick } from "../dao/shortUrl.js";
import { createShortUrlService, getShortUrlByShortCode } from "../services/shortUrl.service.js";

export const createShortUrl = async (req, res, next) => {
  try {
    const { url } = req.body;
    if (!url) {
      return res.status(400).json({ message: "URL is required" });
    }
    const userId = req.userId || null;
    const shortUrlCode = await createShortUrlService(url, userId);
    res.status(201).json({ shortUrl: process.env.APP_URL + shortUrlCode });
  } catch (error) {
    next(error);
  }
};

export const redirectFromShortUrl = async (req, res, next) => {
  try {
    const { id } = req.params;
    const urlEntry = await getShortUrlByShortCode(id);
    if (!urlEntry) {
      return res.status(404).json({ message: "Short URL not found" });
    }
    await updateUrlClick(urlEntry.short_url);

    console.log(`Attempting redirect for short URL: ${id}`);
    console.log(`Redirecting to full URL: ${urlEntry.full_url}`);

    if (typeof urlEntry.full_url !== 'string' || !urlEntry.full_url) {
        console.error(`Invalid full_url found for redirect: ${urlEntry.full_url}`);
        return res.status(500).send("Invalid URL for redirection.");
    }

    res.redirect(302, urlEntry.full_url);
  } catch (error) {
    next(error);
  }
};

export const getUserUrls = async (req, res, next) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const urls = await getAllShortUrls(userId);
    res.status(200).json(urls);
  } catch (error) {
    next(error);
  }
};