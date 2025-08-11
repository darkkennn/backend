import mongoose from 'mongoose';

const shortUrlSchema = new mongoose.Schema({
  full_url: {
    type: String,
    required: true,
  },
  short_url: {
    type: String,
    required: true,
    index: true,
    unique: true,
  },
  clicks: {
    type: Number,
    default: 0,
    required: true,
  },
  user: {
    type: String,
    ref: 'User',
    default: null,
  },
}, {
  timestamps: true
});

const ShortUrl = mongoose.model('ShortUrl', shortUrlSchema);

export default ShortUrl;