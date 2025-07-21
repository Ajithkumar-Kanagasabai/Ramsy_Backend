const express = require('express');
const connectDB = require('./config/db');
const bodyParser = require('body-parser');
const cors = require('cors');
const formRoutes = require('./routes/formRoutes');

const app = express();
const port = process.env.PORT || 5000;

connectDB();

app.use(bodyParser.json());
app.use(cors());

app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/contact', require('./routes/contact'));
app.use('/api/jobs', require('./routes/jobRoutes'));
// app.use('/api/form', require('./routes/formRoutes'));
app.use('/api', formRoutes);
app.use('/api/subscriptions', require('./routes/subscribe'));
app.use('/api/token', require('./routes/tokenRoutes'));
app.use('/api/CrmJobs', require('./routes/routesJob'));

app.get('/', (req, res) => {
  res.send('<h1>Welcome to the Server!!</h1>');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
