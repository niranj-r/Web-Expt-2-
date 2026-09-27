import express from 'express';
import {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent
} from '../controllers/eventController.js';
import { protect, organizerOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getEvents)
  .post(protect, organizerOnly, createEvent);

router.route('/:id')
  .get(getEventById)
  .put(protect, organizerOnly, updateEvent)
  .delete(protect, organizerOnly, deleteEvent);

export default router;
