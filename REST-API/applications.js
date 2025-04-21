const express = require('express');
const router = express.Router();
const ApplicationsController = require('./ApplicationsController');

// definiert die Routen für die Bewerbungen
router.post('/:jobId/applications', ApplicationsController.submitApplication);
router.get('/:jobId/applications', ApplicationsController.listApplications);

// exportiert den Router
module.exports = router;