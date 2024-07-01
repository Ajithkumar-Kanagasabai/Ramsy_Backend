// server.js
const express = require('express');
const connectDB = require('./config/db');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 5000;

// Connect Database
connectDB();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Define Routes
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/contact', require('./routes/contact'));
app.use('/api/jobs', require('./routes/jobRoutes'));
app.use('/api/form', require('./routes/formRoutes'));

app.get('/', (req, res) => {
  res.send('<h1>Welcome to the Express Server!</h1>');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
