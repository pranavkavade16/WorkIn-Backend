// // server.js

// require('dotenv').config();

// const app = require('./app');
// const { initializeDatabase } = require('./db/db.connect');

// (async () => {
//   try {
//     await initializeDatabase(); // ✅ wait for DB connection

//     const PORT = process.env.PORT || 5000;
//     app.listen(PORT, () => {
//       console.log(`Server is running on port ${PORT}.`);
//     });
//   } catch (err) {
//     console.error('Failed to start server:', err);
//     process.exit(1);
//   }
// })();
