const express = require('express');
const router = express.Router();

const projectController = require('../controllers/projectController');
const verifyJWT = require('../middleware/auth.middleware');

// Create a project
router.post('/', projectController.createProject);

// filter project
router.get('/', projectController.getProjects);

// Delete project
router.delete('/:projectId', projectController.deleteProject);

// update the project as completed
router.patch('/:projectId', projectController.completeProject);

module.exports = router;
