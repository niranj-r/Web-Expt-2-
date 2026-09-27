import Task from '../models/Task.js';

// @desc    Get organizer tasks
// @route   GET /api/tasks
// @access  Public / Private
export const getTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.json({ success: true, count: tasks.length, data: tasks });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new task
// @route   POST /api/tasks
// @access  Private/Organizer
export const createTask = async (req, res, next) => {
  try {
    const { text } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ success: false, message: 'Task text is required' });
    }

    const task = await Task.create({
      text: text.trim(),
      createdBy: req.user ? req.user._id : undefined
    });

    res.status(201).json({ success: true, message: 'Task created', data: task });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle task completion status
// @route   PUT /api/tasks/:id/toggle
// @access  Private/Organizer
export const toggleTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    task.completed = !task.completed;
    await task.save();

    res.json({ success: true, data: task });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private/Organizer
export const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    await task.deleteOne();
    res.json({ success: true, message: 'Task removed' });
  } catch (error) {
    next(error);
  }
};

// @desc    Clear completed tasks
// @route   DELETE /api/tasks/completed
// @access  Private/Organizer
export const clearCompletedTasks = async (req, res, next) => {
  try {
    await Task.deleteMany({ completed: true });
    res.json({ success: true, message: 'Completed tasks cleared' });
  } catch (error) {
    next(error);
  }
};
