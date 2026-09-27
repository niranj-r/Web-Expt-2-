import express from 'express';
import {
  createRegistration,
  getRegistrations,
  getMyRegistrations,
  getRegistrationById,
  updateRegistration,
  deleteRegistration
} from '../controllers/registrationController.js';
import { protect, optionalProtect, organizerOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(optionalProtect, createRegistration)
  .get(protect, organizerOnly, getRegistrations);

router.get('/my-registrations', protect, getMyRegistrations);

router.route('/:id')
  .get(protect, getRegistrationById)
  .put(protect, updateRegistration)
  .delete(protect, deleteRegistration);

export default router;
