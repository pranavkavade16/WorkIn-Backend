const Team = require('../models/team.model');

const mongoose = require('mongoose');

exports.createTeam = async (req, res) => {
  try {
    let { name, members, description } = req.body;

    // Normalize inputs
    name = typeof name === 'string' ? name.trim() : name;
    description =
      typeof description === 'string' ? description.trim() : description;

    // Basic validations
    if (!name) {
      return res.status(400).json({ message: 'Team name is required.' });
    }

    // Ensure members is an array
    if (!Array.isArray(members) || members.length === 0) {
      return res.status(400).json({ message: 'Select at least one member.' });
    }

    // Validate ObjectIds
    const invalidMembers = members.filter(
      (id) => !mongoose.isValidObjectId(id)
    );
    if (invalidMembers.length > 0) {
      return res.status(400).json({
        message: `Members contain invalid ObjectIds: ${invalidMembers.join(
          ', '
        )}`,
      });
    }

    // Create + save
    const team = await Team.create({
      name,
      members,
      // If description is optional, store "" instead of undefined/null
      description: description || '',
    });

    // Populate members (single additional round-trip or in-memory populate)
    const populatedTeam = await Team.findById(team._id).populate('members');
    // Alternatively:
    // await team.populate("members");
    // const populatedTeam = team;

    return res.status(201).json(populatedTeam);
  } catch (err) {
    // Known error classes
    if (err?.code === 11000) {
      // Duplicate key (likely unique 'name')
      return res.status(409).json({ message: 'Team name must be unique.' });
    }
    if (err?.name === 'ValidationError') {
      return res.status(400).json({ message: err.message });
    }
    if (err?.name === 'CastError') {
      return res.status(400).json({ message: `Invalid ID: ${err.value}` });
    }

    console.error('[CreateTeam] Unhandled error:', err);
    return res.status(500).json({ message: 'Failed to create the team' });
  }
};

exports.getTeams = async (req, res) => {
  try {
    const filter = {};

    if (req.query.name) {
      filter.name = req.query.name;
    }

    const team = await Team.find(filter).populate('members');

    if (team.length != 0) {
      res.status(200).json({ team });
    } else {
      res.status(400).json({ message: 'Team not found.' });
    }
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch the teams data.',
      error: error.message,
    });
  }
};

exports.deleteTeam = async (req, res) => {
  try {
    const { teamId } = req.params;

    const deletedTeam = await Team.findByIdAndDelete(teamId);

    if (deletedTeam) {
      res.status(200).json({ message: 'Team deleted sucessfully.' });
    } else {
      res
        .status(404)
        .json({ error: `Failed to delete the team with ${teamId}` });
    }
  } catch (error) {
    res.status(500).json({
      message: 'Failed to find and delete the team',
      error: error.message,
    });
  }
};
