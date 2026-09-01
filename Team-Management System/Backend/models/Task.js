const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Task title is required'],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
    default: '',
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TeamMember',
    required: [true, 'Task must be assigned to a team member'],
  },
  assignedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'assignedBy is required'],
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium',
  },
  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Completed'],
    default: 'Pending',
  },
  dueDate: {
    type: Date,
    required: [true, 'Due date is required'],
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Task', taskSchema);
