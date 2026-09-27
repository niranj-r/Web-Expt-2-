import User from '../models/User.js';
import Event from '../models/Event.js';
import Registration from '../models/Registration.js';
import Task from '../models/Task.js';

export const seedDatabase = async () => {
  try {
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('[Seed] Seeding default organizer and sample user accounts...');
      
      const organizer = await User.create({
        name: 'TechFest Organizer Admin',
        email: 'organizer@techfest.com',
        password: 'techfest2026',
        role: 'organizer',
        college: 'MBCET Campus',
        phone: '9876543210',
        department: 'cs',
        year: '4'
      });

      const demoUser = await User.create({
        name: 'Alex Johnson',
        email: 'alex.johnson@example.com',
        password: 'password123',
        role: 'user',
        college: 'MBCET Trivandrum',
        phone: '9876543210',
        department: 'cs',
        year: '3'
      });

      console.log(`[Seed] Created Organizer: ${organizer.email} and Demo User: ${demoUser.email}`);
    }

    const eventCount = await Event.countDocuments();
    if (eventCount === 0) {
      console.log('[Seed] Seeding initial TechFest 2026 events...');
      await Event.insertMany([
        {
          title: 'Hack The Grid',
          category: 'hackathon',
          tagline: '24-hour flagship hackathon',
          description: 'Build futuristic solutions for smart cities, renewable energy grid, and AI. High velocity coding challenge with hardware & cloud tracks.',
          date: 'Oct 16 - 17, 2026',
          time: '10:00 AM - 10:00 AM',
          location: 'Central Computer Center',
          prizePool: '₹50,000 + Incubation Support',
          fee: '₹200 per team',
          teamSize: '2 - 4 Members',
          capacity: 50,
          registeredCount: 1,
          rules: ['Maximum 4 members per team.', 'All code must be written during the hackathon.', 'Mentors available 24/7.'],
          coordinators: [{ name: 'Rahul V.', phone: '9876543210' }],
          image: '/images/events/hackathon.jpg',
          status: 'upcoming'
        },
        {
          title: 'Capture The Flag',
          category: 'cybersecurity',
          tagline: 'Offensive and defensive cybersecurity battle',
          description: 'Penetration testing, web exploits, cryptography, and reverse engineering. Test your ethical hacking skills in real time.',
          date: 'Oct 15, 2026',
          time: '01:00 PM - 06:00 PM',
          location: 'Lab 3, CS Department',
          prizePool: '₹30,000',
          fee: 'Free',
          teamSize: '1 - 2 Members',
          capacity: 40,
          registeredCount: 1,
          rules: ['Jeopardy format CTF.', 'No attacks on infrastructure host server.', 'Dynamic scoring based on solve speed.'],
          coordinators: [{ name: 'Ananya S.', phone: '9812345678' }],
          image: '/images/events/cybersecurity.jpg',
          status: 'upcoming'
        },
        {
          title: 'Algorithmic Art',
          category: 'ai-art',
          tagline: 'Generative design and shader creation',
          description: 'Blend mathematics with creative coding using p5.js, Three.js, or GLSL shaders to craft real-time interactive visual masterpieces.',
          date: 'Oct 17, 2026',
          time: '11:00 AM - 02:00 PM',
          location: 'Design Studio 1',
          prizePool: '₹20,000',
          fee: 'Free',
          teamSize: 'Individual',
          capacity: 30,
          registeredCount: 1,
          rules: ['Original code created during contest.', 'Output must run smoothly at 60FPS.'],
          coordinators: [{ name: 'David K.', phone: '9845012345' }],
          image: '/images/events/ai-art.jpg',
          status: 'upcoming'
        },
        {
          title: 'Design Sprint',
          category: 'ui-ux',
          tagline: 'Brutalist UI/UX & Product Design',
          description: 'Solve real-world usability challenges and craft intuitive digital interfaces under 4 hours.',
          date: 'Oct 18, 2026',
          time: '09:30 AM - 01:30 PM',
          location: 'Media Center',
          prizePool: '₹15,000',
          fee: 'Free',
          teamSize: '1 - 2 Members',
          capacity: 25,
          registeredCount: 1,
          rules: ['Figma or Web components permitted.', 'Must include complete interactive prototype.'],
          coordinators: [{ name: 'Sneha M.', phone: '9765432109' }],
          image: '/images/events/ui-ux.jpg',
          status: 'upcoming'
        }
      ]);
      console.log('[Seed] Seeded 4 initial events.');
    }

    const regCount = await Registration.countDocuments();
    if (regCount === 0) {
      console.log('[Seed] Seeding sample registrations...');
      await Registration.insertMany([
        {
          registrationId: 'REG-1001',
          fullName: 'Alex Johnson',
          email: 'alex.johnson@example.com',
          phone: '9876543210',
          dob: '2003-05-14',
          gender: 'male',
          college: 'MBCET Trivandrum',
          department: 'cs',
          year: '3',
          events: ['Hack The Grid', 'Algorithmic Art'],
          eventName: 'Hack The Grid, Algorithmic Art',
          message: 'Excited for the hackathon!',
          status: 'confirmed'
        },
        {
          registrationId: 'REG-1002',
          fullName: 'Priya Sharma',
          email: 'priya.s@example.com',
          phone: '9812345678',
          dob: '2004-09-21',
          gender: 'female',
          college: 'CET Trivandrum',
          department: 'it',
          year: '2',
          events: ['Capture The Flag', 'Design Sprint'],
          eventName: 'Capture The Flag, Design Sprint',
          message: 'Looking forward to security CTF.',
          status: 'confirmed'
        }
      ]);
      console.log('[Seed] Seeded initial registrations.');
    }

    const taskCount = await Task.countDocuments();
    if (taskCount === 0) {
      await Task.insertMany([
        { text: 'Verify event stage AV equipment setup', completed: true },
        { text: 'Confirm CTF server hosting credentials', completed: false },
        { text: 'Distribute participant identity badges', completed: false }
      ]);
      console.log('[Seed] Seeded organizer tasks.');
    }

  } catch (error) {
    console.error('[Seed Error]:', error);
  }
};
