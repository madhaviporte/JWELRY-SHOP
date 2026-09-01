const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const TeamMember = require('./models/TeamMember');
const Task = require('./models/Task');

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected for seeding...');

    // Clear team members and tasks (re-create each time)
    await TeamMember.deleteMany({});
    await Task.deleteMany({});

    // Upsert exactly ONE admin and ONE manager using role as identifier.
    // If they already exist, preserve their current name/email/password.
    console.log('\nSeeding users...');

    let admin = await User.findOne({ role: 'admin' });
    if (admin) {
      console.log('  ⏭  Admin already exists (id: ' + admin._id + '), skipping.');
    } else {
      admin = await User.create({
        name: 'Admin',
        email: 'admin@example.com',
        password: 'admin123',
        role: 'admin',
      });
      console.log('  ✓  Admin created: ' + admin.email);
    }

    let manager = await User.findOne({ role: 'manager' });
    if (manager) {
      console.log('  ⏭  Manager already exists (id: ' + manager._id + '), skipping.');
    } else {
      manager = await User.create({
        name: 'Manager',
        email: 'manager@example.com',
        password: 'manager123',
        role: 'manager',
      });
      console.log('  ✓  Manager created: ' + manager.email);
    }

    console.log('Users seeded');

    // Create team members
    const members = await TeamMember.insertMany([
      {
        name: 'Madhavi Porte',
        email: 'madhavi@example.com',
        phone: '555-0101',
        position: 'Frontend Developer',
        department: 'Engineering',
        joiningDate: new Date('2024-01-15'),
        skills: ['React', 'JavaScript', 'CSS', 'TypeScript'],
      },
      {
        name: 'Bhumika Tiwari',
        email: 'bhumika@example.com',
        phone: '555-0102',
        position: 'Backend Developer',
        department: 'Engineering',
        joiningDate: new Date('2024-02-20'),
        skills: ['Node.js', 'Python', 'MongoDB', 'PostgreSQL'],
      },
      {
        name: 'Anil Alok',
        email: 'anil@example.com',
        phone: '555-0103',
        position: 'UI/UX Designer',
        department: 'Design',
        joiningDate: new Date('2024-03-10'),
        skills: ['Figma', 'Adobe XD', 'CSS', 'User Research'],
      },
      {
        name: 'Aditya Verma',
        email: 'aditya@example.com',
        phone: '555-0104',
        position: 'DevOps Engineer',
        department: 'Engineering',
        joiningDate: new Date('2024-04-05'),
        skills: ['AWS', 'Docker', 'Kubernetes', 'CI/CD'],
      },
      {
        name: 'Kanika',
        email: 'kanika@example.com',
        phone: '555-0105',
        position: 'Product Manager',
        department: 'Product',
        joiningDate: new Date('2024-05-01'),
        skills: ['Agile', 'Scrum', 'Jira', 'Analytics'],
      },
      {
        name: 'Pragati Ghos',
        email: 'pragati@example.com',
        phone: '555-0106',
        position: 'QA Engineer',
        department: 'Quality Assurance',
        joiningDate: new Date('2024-06-15'),
        skills: ['Selenium', 'Jest', 'Cypress', 'Manual Testing'],
      },
    ]);

    console.log('Team members seeded');

    // Create tasks (reference the admin/manager found or created above)
    await Task.insertMany([
      {
        title: 'Build login page UI',
        description: 'Create a responsive login page with email and password fields',
        assignedTo: members[0]._id,
        assignedBy: admin._id,
        priority: 'High',
        status: 'Completed',
        dueDate: new Date('2024-08-01'),
      },
      {
        title: 'Design API for user management',
        description: 'Create REST API endpoints for user CRUD operations',
        assignedTo: members[1]._id,
        assignedBy: admin._id,
        priority: 'High',
        status: 'In Progress',
        dueDate: new Date('2024-08-15'),
      },
      {
        title: 'Create design system components',
        description: 'Build reusable UI components in Figma for the design system',
        assignedTo: members[2]._id,
        assignedBy: admin._id,
        priority: 'Medium',
        status: 'In Progress',
        dueDate: new Date('2024-08-20'),
      },
      {
        title: 'Set up CI/CD pipeline',
        description: 'Configure automated testing and deployment pipeline',
        assignedTo: members[3]._id,
        assignedBy: admin._id,
        priority: 'High',
        status: 'Pending',
        dueDate: new Date('2024-08-25'),
      },
      {
        title: 'Write product requirements document',
        description: 'Draft PRD for the new team management features',
        assignedTo: members[4]._id,
        assignedBy: admin._id,
        priority: 'Medium',
        status: 'Completed',
        dueDate: new Date('2024-07-30'),
      },
      {
        title: 'Test authentication flow',
        description: 'Perform end-to-end testing of login and registration',
        assignedTo: members[5]._id,
        assignedBy: manager._id,
        priority: 'High',
        status: 'Pending',
        dueDate: new Date('2024-08-30'),
      },
    ]);

    console.log('Tasks created');
    console.log('Seeding complete!');
    console.log('Note: If users already existed, their current credentials are preserved.');

    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error.message);
    process.exit(1);
  }
};

seedData();
