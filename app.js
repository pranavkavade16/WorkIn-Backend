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
const authRoutes = require("./routes/signupRoutes");

const app = express();

const corsOptions = {
  origin: "*",
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(express.json());

app.use("/", adminRoutes);
app.use("/auth", authRoutes);
app.use("/team", verifyJWT, teamRoutes);
app.use("/task", verifyJWT, taskRoutes);
app.use("/project", verifyJWT, projectRoutes);
app.use("/user", verifyJWT, userRoutes);

(async () => {
  try {
    await initializeDatabase();

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}.`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
})();

module.exports = app;
