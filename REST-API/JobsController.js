const { jobs, companies } = require('./data');

// Controller-Klasse für die Jobs
class JobsController {
  static listJobs(req, res) {
    const jobList = Object.values(jobs).map(job => ({
      ...job,
      company: companies[job.companyId]
    }));
    res.json(jobList);
  }

  // Methode um ein Job-Objekt zu erstellen
  static createJob(req, res) {
    const { title, description, location, type, companyId } = req.body;
    const newJobId = `job${Object.keys(jobs).length + 1}`;
    const newJob = {
      id: newJobId,
      title,
      description,
      location,
      type,
      companyId,
      postedDate: new Date().toISOString().split('T')[0]
    };
    jobs[newJobId] = newJob;
    res.status(201).json({
      ...newJob,
      company: companies[companyId]
    });
  }
}

// exportiert die Klasse
module.exports = JobsController;