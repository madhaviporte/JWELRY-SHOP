const TeamMember = require('../models/TeamMember');
const Task = require('../models/Task');

// GET /api/members
const getMembers = async (req, res) => {
  try {
    const { search, department } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { position: { $regex: search, $options: 'i' } },
      ];
    }

    if (department) {
      query.department = department;
    }

    const members = await TeamMember.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: members.length,
      data: members,
    });
  } catch (error) {
    console.error('GetMembers error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch team members',
    });
  }
};

// GET /api/members/:id
const getMember = async (req, res) => {
  try {
    const member = await TeamMember.findById(req.params.id);

    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Team member not found',
      });
    }

    res.status(200).json({
      success: true,
      data: member,
    });
  } catch (error) {
    console.error('GetMember error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch team member',
    });
  }
};

// POST /api/members
const createMember = async (req, res) => {
  try {
    const { name, email, phone, position, department, joiningDate, skills, avatar } = req.body;

    if (!name || !email || !position || !department) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, position, and department',
      });
    }

    const existingMember = await TeamMember.findOne({ email: email.toLowerCase() });
    if (existingMember) {
      return res.status(400).json({
        success: false,
        message: 'A team member with this email already exists',
      });
    }

    const member = await TeamMember.create({
      name,
      email,
      phone,
      position,
      department,
      joiningDate,
      skills: skills || [],
      avatar,
    });

    res.status(201).json({
      success: true,
      message: 'Team member created successfully',
      data: member,
    });
  } catch (error) {
    console.error('CreateMember error:', error.message);
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'A team member with this email already exists',
      });
    }
    res.status(500).json({
      success: false,
      message: 'Failed to create team member',
    });
  }
};

// PUT /api/members/:id
const updateMember = async (req, res) => {
  try {
    const member = await TeamMember.findById(req.params.id);

    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Team member not found',
      });
    }

    const { name, email, phone, position, department, joiningDate, skills, avatar } = req.body;

    // Check if new email conflicts with another member
    if (email && email.toLowerCase() !== member.email) {
      const emailExists = await TeamMember.findOne({ email: email.toLowerCase(), _id: { $ne: req.params.id } });
      if (emailExists) {
        return res.status(400).json({
          success: false,
          message: 'A team member with this email already exists',
        });
      }
    }

    const updatedMember = await TeamMember.findByIdAndUpdate(
      req.params.id,
      { name, email, phone, position, department, joiningDate, skills, avatar },
      { returnDocument: 'after', runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Team member updated successfully',
      data: updatedMember,
    });
  } catch (error) {
    console.error('UpdateMember error:', error.message);
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'A team member with this email already exists',
      });
    }
    res.status(500).json({
      success: false,
      message: 'Failed to update team member',
    });
  }
};

// DELETE /api/members/:id
const deleteMember = async (req, res) => {
  try {
    const member = await TeamMember.findById(req.params.id);

    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Team member not found',
      });
    }

    // Remove assigned tasks for this member
    await Task.deleteMany({ assignedTo: req.params.id });
    await TeamMember.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Team member deleted successfully',
    });
  } catch (error) {
    console.error('DeleteMember error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to delete team member',
    });
  }
};

module.exports = { getMembers, getMember, createMember, updateMember, deleteMember };
