import mongoose from 'mongoose';

const registrationSchema = new mongoose.Schema(
  {
    registrationId: {
      type: String,
      unique: true,
      required: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false // Allowed for guest or authenticated users
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: false
    },
    eventName: {
      type: String,
      default: ''
    },
    events: [
      {
        type: String,
        required: true
      }
    ],
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true
    },
    dob: {
      type: String,
      required: [true, 'Date of birth is required']
    },
    gender: {
      type: String,
      required: [true, 'Gender is required']
    },
    college: {
      type: String,
      required: [true, 'College name is required'],
      trim: true
    },
    department: {
      type: String,
      required: [true, 'Department is required']
    },
    year: {
      type: String,
      required: [true, 'Year of study is required']
    },
    message: {
      type: String,
      default: ''
    },
    status: {
      type: String,
      enum: ['confirmed', 'pending', 'cancelled'],
      default: 'confirmed'
    }
  },
  {
    timestamps: true
  }
);

const Registration = mongoose.model('Registration', registrationSchema);
export default Registration;
