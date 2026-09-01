const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');
const TeamMember = require('./models/TeamMember');
const Task = require('./models/Task');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected for seeding...');

    // Clear existing data
    await User.deleteMany({});
    await TeamMember.deleteMany({});
    await Task.deleteMany({});
    console.log('Existing data cleared.');

    // Create Users (Admin and Manager)
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'admin123',
      role: 'admin'
    });

    const manager = await User.create({
      name: 'Manager User',
      email: 'manager@example.com',
      password: 'manager123',
      role: 'manager'
    });

    console.log('Users created.');

    // Create Team Members
    const members = await TeamMember.insertMany([
      {
        name: 'Madhavi porte',
        email: 'madhavi@example.com',
        phone: '+91-735415582',
        position: 'Frontend Developer',
        department: 'Engineering',
        joiningDate: new Date('2026-01-15'),
        skills: ['React', 'JavaScript', 'CSS', 'HTML'],
        avatar: ''
      },
      {
        name: 'Beer singh',
        email: 'beer@example.com',
        phone: '+91-8765382948',
        position: 'Backend Developer',
        department: 'Engineering',
        joiningDate: new Date('2024-02-20'),
        skills: ['Node.js', 'Python', 'MongoDB', 'Express'],
        avatar: ''
      },
      {
        name: 'Anil Alok',
        email: 'anil@example.com',
        phone: '+91-6739765849',
        position: 'UI/UX Designer',
        department: 'Design',
        joiningDate: new Date('2025-03-10'),
        skills: ['Figma', 'Adobe XD', 'Photoshop', 'Illustration'],
        avatar: ''
      },
      {
        name: 'Bhumika Tiwari',
        email: 'bhumika@example.com',
        phone: '+91-4873562987',
        position: 'DevOps Engineer',
        department: 'Operations',
        joiningDate: new Date('2024-04-05'),
        skills: ['AWS', 'Docker', 'Kubernetes', 'CI/CD'],
        avatar: ''
      },
      {
        name: 'Kanika',
        email: 'kanika@example.com',
        phone: '+91-9768372627',
        position: 'Product Manager',
        department: 'Product',
        joiningDate: new Date('2025-05-12'),
        skills: ['Agile', 'JIRA', 'Analytics', 'Strategy'],
        avatar: ''
      },
      {
        name: 'Pragati Ghos',
        email: 'pragati@example.com',
        phone: '+91-98763976983',
        position: 'QA Engineer',
        department: 'Engineering',
        joiningDate: new Date('2026-06-01'),
        skills: ['Selenium', 'Jest', 'Manual Testing', 'Automation'],
        avatar: ''
      }
    ]);

    console.log('Team members created.');

    // Create Tasks
    const tasks = await Task.insertMany([
      {
        title: 'Build Landing Page',
        description: 'Create a responsive landing page for the new product launch with modern design.',
        assignedTo: members[0]._id,
        assignedBy: admin._id,
        priority: 'High',
        status: 'In Progress',
        dueDate: new Date('2026-09-15')
      },
      {
        title: 'Design User Dashboard',
        description: 'Create wireframes and high-fidelity mockups for the user dashboard.',
        assignedTo: members[2]._id,
        assignedBy: manager._id,
        priority: 'Medium',
        status: 'Pending',
        dueDate: new Date('2026-09-20')
      },
      {
        title: 'API Integration',
        description: 'Integrate third-party payment API with the backend services.',
        assignedTo: members[1]._id,
        assignedBy: admin._id,
        priority: 'High',
        status: 'In Progress',
        dueDate: new Date('2026-09-12')
      },
      {
        title: 'Setup CI/CD Pipeline',
        description: 'Configure automated deployment pipeline for staging and production.',
        assignedTo: members[3]._id,
        assignedBy: admin._id,
        priority: 'Medium',
        status: 'Completed',
        dueDate: new Date('2026-09-05')
      },
      {
        title: 'User Acceptance Testing',
        description: 'Perform UAT for the new features before production release.',
        assignedTo: members[5]._id,
        assignedBy: manager._id,
        priority: 'Low',
        status: 'Pending',
        dueDate: new Date('2026-09-25')
      },
      {
        title: 'Sprint Planning Documentation',
        description: 'Document sprint goals, tasks, and acceptance criteria for Q4.',
        assignedTo: members[4]._id,
        assignedBy: admin._id,
        priority: 'Medium',
        status: 'In Progress',
        dueDate: new Date('2026-09-18')
      }
    ]);

    console.log('Tasks created.');
    console.log('\nSeeding completed successfully!');
    console.log('\nTest Credentials:');
    console.log('Admin:    admin@example.com / admin123');
    console.log('Manager:  manager@example.com / manager123');

    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error.message);
    process.exit(1);
  }
};

seedData();
