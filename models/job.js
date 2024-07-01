const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
  Sector: {
    type: String,
    required: true,
  },
  JobName: {
    type: String,
    required: true,
  },
  Band: {
    type: String,
    required: true,
  },
  Salary: {
    type: String,
    required: true,
  },
  Location: {
    type: String,
    required: true,
  },
  Experience: {
    type: String,
    required: true,
  },
  JobType: {
    type: String,
    required: true,
  },
  
  
});

module.exports = mongoose.model('Job', JobSchema);
