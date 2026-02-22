const express = require('express');
const router = express.Router();

const taskController = require('../controllers/taskController');

// Create a new task
router.post('/', taskController.createTask);

// Get task
router.get('/', taskController.getTask);

// Delete task
router.delete('/:taskId', taskController.deleteTask);

// Complete project
router.patch('/:taskId/complete', taskController.completeTask);

module.exports = router;
