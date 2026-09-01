const Task = require('../models/Task');
const TeamMember = require('../models/TeamMember');

// GET /api/tasks
const getTasks = async (req, res) => {
  try {
    const { status, priority, assignedTo } = req.query;
    const query = {};

    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (assignedTo) query.assignedTo = assignedTo;

    const tasks = await Task.find(query)
      .populate('assignedTo', 'name email position department')
      .populate('assignedBy', 'name email role')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks,
    });
  } catch (error) {
    console.error('GetTasks error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch tasks',
    });
  }
};

// GET /api/tasks/:id
const getTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('assignedTo', 'name email position department')
      .populate('assignedBy', 'name email role');

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    res.status(200).json({
      success: true,
      data: task,
    });
  } catch (error) {
    console.error('GetTask error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch task',
    });
  }
};

// GET /api/tasks/member/:memberId
const getTasksByMember = async (req, res) => {
  try {
    const tasks = await Task.find({ assignedTo: req.params.memberId })
      .populate('assignedTo', 'name email position department')
      .populate('assignedBy', 'name email role')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks,
    });
  } catch (error) {
    console.error('GetTasksByMember error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch tasks for this member',
    });
  }
};

// POST /api/tasks
const createTask = async (req, res) => {
  try {
    const { title, description, assignedTo, priority, dueDate } = req.body;

    if (!title || !assignedTo || !dueDate) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, assign to, and due date',
      });
    }

    // Verify the member exists
    const member = await TeamMember.findById(assignedTo);
    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Team member not found',
      });
    }

    const task = await Task.create({
      title,
      description,
      assignedTo,
      assignedBy: req.user._id,
      priority: priority || 'Medium',
      dueDate,
    });

    const populatedTask = await Task.findById(task._id)
      .populate('assignedTo', 'name email position department')
      .populate('assignedBy', 'name email role');

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: populatedTask,
    });
  } catch (error) {
    console.error('CreateTask error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to create task',
    });
  }
};

// PUT /api/tasks/:id
const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    const { title, description, assignedTo, priority, status, dueDate } = req.body;

    if (assignedTo) {
      const member = await TeamMember.findById(assignedTo);
      if (!member) {
        return res.status(404).json({
          success: false,
          message: 'Team member not found',
        });
      }
    }

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      { title, description, assignedTo, priority, status, dueDate },
      { returnDocument: 'after', runValidators: true }
    )
      .populate('assignedTo', 'name email position department')
      .populate('assignedBy', 'name email role');

    res.status(200).json({
      success: true,
      message: 'Task updated successfully',
      data: updatedTask,
    });
  } catch (error) {
    console.error('UpdateTask error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to update task',
    });
  }
};

// DELETE /api/tasks/:id
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    await Task.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully',
    });
  } catch (error) {
    console.error('DeleteTask error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to delete task',
    });
  }
};

// PATCH /api/tasks/:id/status
const updateTaskStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status || !['Pending', 'In Progress', 'Completed'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be: Pending, In Progress, or Completed',
      });
    }

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    task.status = status;
    await task.save();

    const updatedTask = await Task.findById(task._id)
      .populate('assignedTo', 'name email position department')
      .populate('assignedBy', 'name email role');

    res.status(200).json({
      success: true,
      message: 'Task status updated successfully',
      data: updatedTask,
    });
  } catch (error) {
    console.error('UpdateTaskStatus error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to update task status',
    });
  }
};

module.exports = { getTasks, getTask, getTasksByMember, createTask, updateTask, deleteTask, updateTaskStatus };
