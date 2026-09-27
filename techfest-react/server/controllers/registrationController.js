import Registration from '../models/Registration.js';
import Event from '../models/Event.js';

// @desc    Register for event(s)
// @route   POST /api/registrations
// @access  Public / Optional Protect (if logged in, attaches user)
export const createRegistration = async (req, res, next) => {
  try {
    const {
      fullName,
      email,
      phone,
      dob,
      gender,
      college,
      department,
      year,
      events,
      message,
      eventId
    } = req.body;

    if (!fullName || !email || !phone || !college || !department || !year) {
      return res.status(400).json({
        success: false,
        message: 'Please fill in all required fields'
      });
    }

    const eventList = Array.isArray(events) ? events : events ? [events] : ['General Event'];
    if (eventList.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please select at least one event'
      });
    }

    // Generate unique Registration ID
    const randomCode = Math.floor(1000 + Math.random() * 9000);
    const registrationId = `REG-${randomCode}`;

    const registration = await Registration.create({
      registrationId,
      user: req.user ? req.user._id : undefined,
      event: eventId || undefined,
      events: eventList,
      eventName: eventList.join(', '),
      fullName,
      email,
      phone,
      dob: dob || '2000-01-01',
      gender: gender || 'other',
      college,
      department,
      year,
      message: message || '',
      status: 'confirmed'
    });

    // Update registered count on events if matching eventId or titles found
    for (const evtName of eventList) {
      await Event.findOneAndUpdate(
        { title: { $regex: new RegExp(evtName, 'i') } },
        { $inc: { registeredCount: 1 } }
      );
    }

    res.status(201).json({
      success: true,
      message: `Registration successful! Your ID is ${registrationId}`,
      data: registration
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all registrations (Organizer view)
// @route   GET /api/registrations
// @access  Private/Organizer
export const getRegistrations = async (req, res, next) => {
  try {
    const registrations = await Registration.find()
      .populate('user', 'name email role')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: registrations.length,
      data: registrations
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in user's registrations
// @route   GET /api/registrations/my-registrations
// @access  Private (User)
export const getMyRegistrations = async (req, res, next) => {
  try {
    // Search by logged in user ID OR user's registered email address
    const registrations = await Registration.find({
      $or: [
        { user: req.user._id },
        { email: req.user.email.toLowerCase() }
      ]
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: registrations.length,
      data: registrations
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get registration by ID or registrationId
// @route   GET /api/registrations/:id
// @access  Private
export const getRegistrationById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const registration = await Registration.findOne({
      $or: [{ _id: id }, { registrationId: id }]
    });

    if (!registration) {
      return res.status(404).json({ success: false, message: 'Registration record not found' });
    }

    res.json({ success: true, data: registration });
  } catch (error) {
    next(error);
  }
};

// @desc    Update registration
// @route   PUT /api/registrations/:id
// @access  Private
export const updateRegistration = async (req, res, next) => {
  try {
    const id = req.params.id;
    let registration = await Registration.findOne({
      $or: [{ _id: id }, { registrationId: id }]
    });

    if (!registration) {
      return res.status(404).json({ success: false, message: 'Registration record not found' });
    }

    registration = await Registration.findByIdAndUpdate(registration._id, req.body, {
      new: true,
      runValidators: true
    });

    res.json({
      success: true,
      message: 'Registration updated successfully',
      data: registration
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete registration
// @route   DELETE /api/registrations/:id
// @access  Private
export const deleteRegistration = async (req, res, next) => {
  try {
    const id = req.params.id;
    const registration = await Registration.findOne({
      $or: [{ _id: id }, { registrationId: id }]
    });

    if (!registration) {
      return res.status(404).json({ success: false, message: 'Registration record not found' });
    }

    await registration.deleteOne();

    res.json({
      success: true,
      message: 'Registration cancelled / deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
