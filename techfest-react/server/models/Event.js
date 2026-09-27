import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please enter event title'],
      trim: true
    },
    category: {
      type: String,
      required: [true, 'Please select event category'],
      trim: true
    },
    tagline: {
      type: String,
      default: ''
    },
    description: {
      type: String,
      required: [true, 'Please enter event description']
    },
    date: {
      type: String,
      required: [true, 'Please specify event date']
    },
    time: {
      type: String,
      default: '10:00 AM'
    },
    location: {
      type: String,
      default: 'Main Campus Hall'
    },
    prizePool: {
      type: String,
      default: 'Cash Prizes & Certificates'
    },
    fee: {
      type: String,
      default: 'Free'
    },
    teamSize: {
      type: String,
      default: '1 - 4 Members'
    },
    capacity: {
      type: Number,
      default: 100
    },
    registeredCount: {
      type: Number,
      default: 0
    },
    rules: [
      {
        type: String
      }
    ],
    coordinators: [
      {
        name: String,
        phone: String
      }
    ],
    image: {
      type: String,
      default: '/images/events/default.jpg'
    },
    status: {
      type: String,
      enum: ['upcoming', 'ongoing', 'completed'],
      default: 'upcoming'
    }
  },
  {
    timestamps: true
  }
);

const Event = mongoose.model('Event', eventSchema);
export default Event;
