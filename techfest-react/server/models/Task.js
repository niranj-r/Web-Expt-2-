import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: [true, 'Task text is required'],
      trim: true
    },
    completed: {
      type: Boolean,
      default: false
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  {
    timestamps: true
  }
);

const Task = mongoose.model('Task', taskSchema);
export default Task;
