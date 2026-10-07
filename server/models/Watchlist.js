import mongoose from 'mongoose';

const watchlistSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  movieId: {
    type: Number,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  poster: String,
  backdrop: String,
  overview: String,
  releaseDate: String,
  releaseYear: mongoose.Schema.Types.Mixed,
  rating: mongoose.Schema.Types.Mixed,
  voteCount: Number,
  genres: mongoose.Schema.Types.Mixed,
  duration: mongoose.Schema.Types.Mixed,
}, {
  timestamps: true,
});

// A user can only have a specific movie once in their watchlist
watchlistSchema.index({ userId: 1, movieId: 1 }, { unique: true });

// Ensure queries execute fast when sorting by createdAt for a user
watchlistSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model('Watchlist', watchlistSchema);
