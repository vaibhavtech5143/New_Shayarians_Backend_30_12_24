import mongoose from 'mongoose';

const confessionSchema = new mongoose.Schema({
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Confession', confessionSchema);
