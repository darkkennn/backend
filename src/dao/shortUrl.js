import UrlSchema from "../models/shortUrl.model.js";

export const saveShortUrl = async (shortUrlCode, longUrl, userId = null) => {
  try {
    const newUrl = new UrlSchema({
      full_url: longUrl,
      short_url: shortUrlCode,
      user: userId,
    });
    await newUrl.save();
    return newUrl;
  } catch (error) {
    console.error("Error saving short URL:", error);
    throw new Error("Failed to save short URL to database.");
  }
};

export const getShortUrl = async (shortUrlCode) => {
  try {
    return await UrlSchema.findOne({ short_url: shortUrlCode });
  } catch (error) {
    console.error("Error getting short URL:", error);
    throw new Error("Failed to retrieve short URL from database.");
  }
};

export const getAllShortUrls = async (userId) => {
  try {
    return await UrlSchema.find({ user: userId }).sort({ createdAt: -1 });
  } catch (error) {
    console.error("Error getting all short URLs for user:", error);
    throw new Error("Failed to retrieve user URLs from database.");
  }
};

export const updateUrlClick = async (shortUrlCode) => {
  try {
    return await UrlSchema.findOneAndUpdate(
      { short_url: shortUrlCode },
      { $inc: { clicks: 1 } },
      { new: true }
    );
  } catch (error) {
    console.error("Error updating URL click count:", error);
    throw new Error("Failed to update click count.");
  }
};