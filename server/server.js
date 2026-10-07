import app from './app.js';
import connectDB from './config/db.js';
import mongoose from 'mongoose';

const PORT = process.env.PORT || 5000;

let server;

const startServer = async () => {
  // Connect to Database
  await connectDB();

  // Start Express server
  server = app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  });
};

startServer();

// Handle graceful shutdown
const exitHandler = async () => {
  if (server) {
    server.close(async () => {
      console.log('Express server closed');
      if (mongoose.connection.readyState === 1) {
        await mongoose.connection.close(false);
        console.log('MongoDB connection closed');
      }
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error) => {
  console.error('Unexpected error:', error);
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
  console.log('SIGTERM received');
  if (server) {
    server.close();
  }
});
