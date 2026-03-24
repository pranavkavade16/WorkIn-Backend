// app.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { initializeDatabase } = require("./db/db.connect");

const teamRoutes = require("./routes/teamRoutes");
const taskRoutes = require("./routes/taskRoutes");
const projectRoutes = require("./routes/projectRoutes");
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");
const verifyJWT = require("./middleware/auth.middleware");

const app = express();

const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));

app.use(express.json());

(async () => {
  try {
    await initializeDatabase(); // ✅ wait for DB connection

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}.`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
})();

// Routes
app.use("/", adminRoutes);

app.use("/team", verifyJWT, teamRoutes);

app.use("/task", verifyJWT, taskRoutes);

app.use("/project", verifyJWT, projectRoutes);

app.use("/user", verifyJWT, userRoutes);

module.exports = app;
