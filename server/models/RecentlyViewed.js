import mongoose from 'mongoose';

const recentlyViewedSchema = new mongoose.Schema({
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
  poster: {
    type: String,
  },
  backdrop: {
    type: String,
  },
  rating: {
    type: Number,
  },
  releaseYear: {
    type: Number,
  },
  genres: {
    type: [String],
    default: []
  },
  viewedAt: {
    type: Date,
    default: Date.now,
  }
}, {
  timestamps: true
});

// Ensure a user only has one entry per movie
recentlyViewedSchema.index({ userId: 1, movieId: 1 }, { unique: true });
// Index for sorting by viewedAt
recentlyViewedSchema.index({ userId: 1, viewedAt: -1 });

const RecentlyViewed = mongoose.model('RecentlyViewed', recentlyViewedSchema);

export default RecentlyViewed;
