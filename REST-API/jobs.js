const express = require('express');
const router = express.Router();
const JobsController = require('./JobsController');

// definiert die Routen für die Jobs
router.get('/', JobsController.listJobs);
router.post('/', JobsController.createJob);

// exportiert den Router
module.exports = router;