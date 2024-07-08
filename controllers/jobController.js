const Job = require('../models/job');

// Controller function to handle GET request for all jobs
const getAllJobs = async (req, res) => {
  try {
    const sector = req.query;
    const query={};
    if(sector){
      query= { sector: sector }
    }
    const jobs = await Job.find(query);
    res.json(jobs);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
const getAJob = async (req, res) => {
    try {
      const jobId = req.params.id; // Extract job ID from request parameters
      const job = await Job.findById(jobId);
  
      if (!job) {
        return res.status(404).json({ msg: 'Job not found' });
      }
  
      res.json(job); // Send the job as JSON response
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  };


module.exports = {
  getAllJobs,
  getAJob
};
