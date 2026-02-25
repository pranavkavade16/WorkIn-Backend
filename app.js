// app.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const {initializeDatabase} = require("./db/db.connect")

const teamRoutes = require('./routes/teamRoutes');
const taskRoutes = require('./routes/taskRoutes');
const projectRoutes = require('./routes/projectRoutes');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const verifyJWT = require('./middleware/auth.middleware');

const app = express();

// CORS config (pick one place to call it)
const corsOptions = {
  origin: '*',
  credentials: true,
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Body parser (only once)
app.use(express.json());

initializeDatabase()

// Routes
app.use('/', adminRoutes);

app.use('/team', teamRoutes);

app.use('/task', taskRoutes);

app.use('/project', projectRoutes);

app.use('/user', userRoutes);

module.exports = app;
