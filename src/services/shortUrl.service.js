import { generateNanoId } from '../utils/helper.js';
import { saveShortUrl, getShortUrl } from '../dao/shortUrl.js';

export const createShortUrlService = async (longUrl, userId = null) => {
  try {
    let shortUrlCode;
    let exists = true;
    while (exists) {
      shortUrlCode = generateNanoId(7);
      const existingUrl = await getShortUrl(shortUrlCode);
      if (!existingUrl) {
        exists = false;
      }
    }

    await saveShortUrl(shortUrlCode, longUrl, userId);
    return shortUrlCode;
  } catch (error) {
    console.error("Error in createShortUrlService:", error);
    throw new Error("Failed to create short URL.");
  }
};

export const getShortUrlByShortCode = async (shortUrlCode) => {
  try {
    return await getShortUrl(shortUrlCode);
  } catch (error) {
    console.error("Error in getShortUrlByShortCode:", error);
    throw new Error("Failed to retrieve short URL by code.");
  }
};