const Project = require('../models/project.model');
const Task = require('../models/task.model');
const mongoose = require('mongoose');

exports.createProject = async (req, res) => {
  try {
    const allowedStatus = ['To Do', 'In Progress', 'Completed', 'Blocked'];
    const { name, description, status } = req.body;

    if (!name) {
      return res
        .status(400)
        .json({ message: 'Invalid input, please enter a valid name.' });
    }

    if (!description) {
      return res
        .status(400)
        .json({ message: 'Inavlid input, please enter a valid description.' });
    }

    if (status && !allowedStatus.includes(status)) {
      return res.status(400).json({
        error:
          'Invalid input: Allowed values are: To Do, In Progress, Completed, Blocked',
      });
    }

    const project = new Project(req.body);
    const savedProject = await project.save();
    res.status(200).json({ savedProject });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Failed to create a project', error: error.message });
  }
};

exports.getProjects = async (req, res) => {
  try {
    allowedStatus = ['To Do', 'In Progress', 'Completed', 'Blocked'];
    const filter = {};

    const { name, status } = req.query;

    if (name) {
      filter.name = req.query.name;
    }

    if (status) {
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({ error: 'Invalid status.' });
      }
      filter.status = status;
    }

    const projects = await Project.find(filter);
    console.log('Filtered projects', projects);

    if (projects.length > 0) {
      res.status(200).json({ projects });
    }
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch the project data.',
      error: error.message,
    });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    const { projectId } = req.params;

    const project = await Project.findById(projectId);
    console.log(project);

    const deletedProject = await Project.findByIdAndDelete(projectId);

    if (deletedProject) {
      res.status(200).json({ message: 'Project deleted successfully' });
    } else {
      res
        .status(404)
        .json({ message: `Project with ID${projectId} not found.` });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.completeProject = async (req, res) => {
  try {
    const { projectId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ message: 'Invalid projectId' });
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Count tasks that are NOT completed
    const incompleteCount = await Task.countDocuments({
      project: projectId,
      status: { $ne: 'Completed' },
    });

    if (incompleteCount > 0) {
      // Optional: return a small sample of incomplete tasks for UI/debug
      const sample = await Task.find({
        project: projectId,
        status: { $ne: 'Completed' },
      })
        .select('_id name status')
        .limit(5);

      return res.status(400).json({
        message:
          'Cannot mark project as Completed. Some tasks are not completed.',
        incompleteTasksCount: incompleteCount,
        sampleIncompleteTasks: sample,
      });
    }

    // If you want to allow completing projects with zero tasks, keep this as is.
    // If you want to require at least one task, add a check here.
    project.status = 'Completed';
    await project.save();

    return res.status(200).json({
      message: 'Project marked as Completed.',
      project,
    });
  } catch (err) {
    console.error('completeProject error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
