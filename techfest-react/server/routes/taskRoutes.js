import express from 'express';
import {
  getTasks,
  createTask,
  toggleTask,
  deleteTask,
  clearCompletedTasks
} from '../controllers/taskController.js';
import { protect, organizerOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getTasks)
  .post(protect, organizerOnly, createTask);

router.delete('/completed', protect, organizerOnly, clearCompletedTasks);

router.route('/:id')
  .delete(protect, organizerOnly, deleteTask);

router.put('/:id/toggle', protect, organizerOnly, toggleTask);

export default router;
