import Event from '../models/Event.js';

// @desc    Get all events
// @route   GET /api/events
// @access  Public
export const getEvents = async (req, res, next) => {
  try {
    const { category, search } = req.query;
    let filter = {};

    if (category && category !== 'all') {
      filter.category = category;
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const events = await Event.find(filter).sort({ createdAt: -1 });
    res.json({
      success: true,
      count: events.length,
      data: events
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single event by ID
// @route   GET /api/events/:id
// @access  Public
export const getEventById = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }
    res.json({ success: true, data: event });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new event
// @route   POST /api/events
// @access  Private/Organizer
export const createEvent = async (req, res, next) => {
  try {
    const {
      title,
      category,
      tagline,
      description,
      date,
      time,
      location,
      prizePool,
      fee,
      teamSize,
      capacity,
      rules,
      coordinators,
      image
    } = req.body;

    if (!title || !category || !description || !date) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, category, description, and date'
      });
    }

    const event = await Event.create({
      title,
      category,
      tagline,
      description,
      date,
      time,
      location,
      prizePool,
      fee,
      teamSize,
      capacity,
      rules,
      coordinators,
      image
    });

    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      data: event
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update an event
// @route   PUT /api/events/:id
// @access  Private/Organizer
export const updateEvent = async (req, res, next) => {
  try {
    let event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    event = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.json({
      success: true,
      message: 'Event updated successfully',
      data: event
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete an event
// @route   DELETE /api/events/:id
// @access  Private/Organizer
export const deleteEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    await event.deleteOne();

    res.json({
      success: true,
      message: 'Event removed successfully'
    });
  } catch (error) {
    next(error);
  }
};
