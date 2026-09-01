const TeamMember = require('../models/TeamMember');
const Task = require('../models/Task');

exports.getAllMembers = async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};

    if (search) {
      query = {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { position: { $regex: search, $options: 'i' } },
          { department: { $regex: search, $options: 'i' } }
        ]
      };
    }

    const members = await TeamMember.find(query).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: members });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

exports.getMemberById = async (req, res) => {
  try {
    const member = await TeamMember.findById(req.params.id);
    if (!member) {
      return res.status(404).json({ success: false, message: 'Team member not found.' });
    }
    res.status(200).json({ success: true, data: member });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

exports.createMember = async (req, res) => {
  try {
    const { name, email, phone, position, department, joiningDate, skills, avatar } = req.body;

    if (!name || !email || !position || !department) {
      return res.status(400).json({ success: false, message: 'Name, email, position, and department are required.' });
    }

    const existingMember = await TeamMember.findOne({ email: email.toLowerCase() });
    if (existingMember) {
      return res.status(400).json({ success: false, message: 'A member with this email already exists.' });
    }

    const member = await TeamMember.create({
      name,
      email: email.toLowerCase(),
      phone,
      position,
      department,
      joiningDate,
      skills: skills || [],
      avatar
    });

    res.status(201).json({ success: true, message: 'Team member created successfully.', data: member });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

exports.updateMember = async (req, res) => {
  try {
    const { name, email, phone, position, department, joiningDate, skills, avatar } = req.body;

    const member = await TeamMember.findById(req.params.id);
    if (!member) {
      return res.status(404).json({ success: false, message: 'Team member not found.' });
    }

    if (email && email.toLowerCase() !== member.email) {
      const existingMember = await TeamMember.findOne({ email: email.toLowerCase() });
      if (existingMember) {
        return res.status(400).json({ success: false, message: 'A member with this email already exists.' });
      }
    }

    const updatedMember = await TeamMember.findByIdAndUpdate(
      req.params.id,
      {
        name: name || member.name,
        email: email ? email.toLowerCase() : member.email,
        phone: phone !== undefined ? phone : member.phone,
        position: position || member.position,
        department: department || member.department,
        joiningDate: joiningDate || member.joiningDate,
        skills: skills !== undefined ? skills : member.skills,
        avatar: avatar !== undefined ? avatar : member.avatar
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({ success: true, message: 'Team member updated successfully.', data: updatedMember });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

exports.deleteMember = async (req, res) => {
  try {
    const member = await TeamMember.findById(req.params.id);
    if (!member) {
      return res.status(404).json({ success: false, message: 'Team member not found.' });
    }

    await Task.deleteMany({ assignedTo: req.params.id });
    await TeamMember.findByIdAndDelete(req.params.id);

    res.status(200).json({ success: true, message: 'Team member deleted successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};
