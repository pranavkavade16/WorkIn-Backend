const mongoose = require('mongoose');
const Task = require('../models/task.model');
const Project = require('../models/project.model');
const Team = require('../models/team.model');
const User = require('../models/user.model');

exports.createTask = async (req, res) => {
  try {
    const {
      name,
      project,
      team,
      owners,
      tags = [],
      timeToComplete,
      status = 'To Do',
    } = req.body;

    const allowedStatus = ['To Do', 'In Progress', 'Completed', 'Blocked'];
    const isOid = (v) => mongoose.isValidObjectId(v);

    if (!name) {
      return res
        .status(400)
        .json({ error: 'Invalid input: Please add a valid name.' });
    }

    if (!isOid(project))
      errors.push(`project is not a valid ObjectId: ${project}`);
    if (!isOid(team)) errors.push(`team is not a valid ObjectId: ${team}`);

    const invalidOwners = owners.filter((id) => !isOid(id));
    if (invalidOwners.length)
      errors.push(
        `owners contain invalid ObjectIds: ${invalidOwners.join(', ')}`
      );

    if (status && !allowedStatus.includes(status)) {
      return res.status(400).json({
        error:
          'Invalid input: Allowed values are: To Do, In Progress, Completed, Blocked',
      });
    }

    const task = new Task({
      name: name.trim(),
      project,
      team,
      owners,
      tags,
      timeToComplete: Number(timeToComplete),
      status,
    });

    const savedTask = await task.save();
    const populatedTask = await Task.findById(savedTask._id)
      .populate('project')
      .populate('team')
      .populate('owners');
    res.status(201).json({ populatedTask });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Failed to create a task', error: error.message });
  }
};

exports.getTask = async (req, res) => {
  try {
    const filter = {};

    const {
      sortBy = 'createdAt',
      order = 'desc',
      name,
      project,
      team,
      status,
      owners,
      tags,
    } = req.query;

    allowedStatus = ['To Do', 'In Progress', 'Completed', 'Blocked'];

    if (name) {
      filter.name = name;
    }

    if (project) {
      if (!mongoose.Types.ObjectId(project)) {
        return res.status(400).json({ error: 'Invalid project id' });
      }
      filter.project = project;
    }
    if (status) {
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({ error: 'Invalid status.' });
      }
      filter.status = status;
    }

    if (owners) {
      const ownerIds = owners.split(',').map((s) => s.trim());
      // Validate all owner IDs
      const allValid = ownerIds.every((id) =>
        mongoose.Types.ObjectId.isValid(id)
      );
      if (!allValid) {
        return res
          .status(400)
          .json({ error: 'One or more owner ids are invalid' });
      }
      filter.owners = { $in: ownerIds };
    }

    if (tags) {
      filter.tags = { $in: tags.split(',') };
    }

    const sortOrder = order.toLowerCase() === 'asc' ? 1 : -1;
    const sort = { [sortBy]: sortOrder };

    const task = await Task.find(filter)
      .populate('project') // ✅ ensure these paths exist in Task schema
      .populate('team')
      .populate('owners')
      .sort(sort);

    if (task.length != 0) {
      res.status(200).json({ task });
    } else {
      res.status(400).json({ message: 'Task not found.' });
    }
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch the task data.',
      error: error.message,
    });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const { taskId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      return res.status(400).json({ message: 'Invalid taskId' });
    }
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const deletedTask = await Task.findByIdAndDelete(taskId);

    if (deletedTask) {
      return res
        .status(200)
        .json({ message: 'Task deleted successfully', deletedTask });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete the task' });
  }
};

exports.completeTask = async (req, res) => {
  try {
    const { taskId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      return res.status(400).json({ message: 'Invalid task id' });
    }

    const task = await Task.findByIdAndUpdate(
      taskId,
      { $set: { status: 'Completed' } },
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    return res.status(200).json({ task });
  } catch (error) {
    console.error('completeTask error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
