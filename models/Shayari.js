import mongoose from 'mongoose';

const shayariSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, default: 'Anonymous' },
  imageUrls: [{ type: String }], // Array for multiple image URLs
  genre: {
    type: String,
    required: true,
    enum: ['Love', 'Life', 'Nature', 'Friendship', 'Motivation', 'Other'],
  },
  content: { type: String, required: function () { return !this.imageUrls.length; } }, // Content required if no images
  likes: { type: Number, default: 0 },
  comments: [
    {
      text: String,
      author: String,
      createdAt: { type: Date, default: Date.now },
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Shayari', shayariSchema);
