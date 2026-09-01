const Task = require('../models/Task');

exports.getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate('assignedTo', 'name email position department')
      .populate('assignedBy', 'name email role')
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: tasks });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('assignedTo', 'name email position department')
      .populate('assignedBy', 'name email role');

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found.' });
    }
    res.status(200).json({ success: true, data: task });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

exports.getTasksByMember = async (req, res) => {
  try {
    const tasks = await Task.find({ assignedTo: req.params.memberId })
      .populate('assignedTo', 'name email position department')
      .populate('assignedBy', 'name email role')
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: tasks });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

exports.createTask = async (req, res) => {
  try {
    const { title, description, assignedTo, priority, dueDate } = req.body;

    if (!title || !assignedTo || !dueDate) {
      return res.status(400).json({ success: false, message: 'Title, assigned member, and due date are required.' });
    }

    const task = await Task.create({
      title,
      description: description || '',
      assignedTo,
      assignedBy: req.user._id,
      priority: priority || 'Medium',
      dueDate
    });

    const populatedTask = await Task.findById(task._id)
      .populate('assignedTo', 'name email position department')
      .populate('assignedBy', 'name email role');

    res.status(201).json({ success: true, message: 'Task created successfully.', data: populatedTask });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const { title, description, assignedTo, priority, status, dueDate } = req.body;

    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found.' });
    }

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      {
        title: title || task.title,
        description: description !== undefined ? description : task.description,
        assignedTo: assignedTo || task.assignedTo,
        priority: priority || task.priority,
        status: status || task.status,
        dueDate: dueDate || task.dueDate
      },
      { new: true, runValidators: true }
    )
      .populate('assignedTo', 'name email position department')
      .populate('assignedBy', 'name email role');

    res.status(200).json({ success: true, message: 'Task updated successfully.', data: updatedTask });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found.' });
    }

    await Task.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Task deleted successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

exports.updateTaskStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status || !['Pending', 'In Progress', 'Completed'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Valid status is required (Pending, In Progress, Completed).' });
    }

    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found.' });
    }

    task.status = status;
    await task.save();

    const populatedTask = await Task.findById(task._id)
      .populate('assignedTo', 'name email position department')
      .populate('assignedBy', 'name email role');

    res.status(200).json({ success: true, message: 'Task status updated successfully.', data: populatedTask });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};
