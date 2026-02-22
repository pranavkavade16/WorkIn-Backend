const express = require('express');
const router = express.Router();

const teamController = require("../controllers/teamController");

// Create team
router.post('/', teamController.createTeam);

// Get teams (using filters)
router.get('/', teamController.getTeams);

// Delete team
router.delete('/:teamId', teamController.deleteTeam);

module.exports = router;
