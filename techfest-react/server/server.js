import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import { connectDB } from './config/db.js';
import { requestLogger } from './middleware/loggerMiddleware.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import { seedDatabase } from './utils/seedData.js';

import authRoutes from './routes/authRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import registrationRoutes from './routes/registrationRoutes.js';
import taskRoutes from './routes/taskRoutes.js';

// Environment configuration
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Custom Request Logger Middleware (Requirement #9)
app.use(requestLogger);

// Health check route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'TechFest 2026 REST API',
    timestamp: new Date().toISOString()
  });
});

// RESTful API Routes (Requirements #2, #3, #4, #8)
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/registrations', registrationRoutes);
app.use('/api/tasks', taskRoutes);

// Exception handling middleware (Requirements #6, #9)
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Connect to MongoDB (Requirement #5)
    await connectDB();
    
    // Seed initial data
    await seedDatabase();

    app.listen(PORT, () => {
      console.log(`==================================================`);
      console.log(`🚀 TechFest 2026 Express Server running on port ${PORT}`);
      console.log(`📡 API Base URL: http://localhost:${PORT}/api`);
      console.log(`==================================================`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
};

startServer();
