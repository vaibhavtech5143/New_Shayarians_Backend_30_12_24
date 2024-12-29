import mongoose from 'mongoose';

const pollSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [
    {
      text: String,
      votes: { type: Number, default: 0 },
    },
  ],
  expiresAt: {
    type: Date,
    required: true,
    default: () => new Date(+new Date() + 24 * 60 * 60 * 1000), // 24 hours from now
  },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Poll', pollSchema);
