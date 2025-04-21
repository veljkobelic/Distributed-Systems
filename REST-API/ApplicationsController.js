const { applications, users, jobs } = require('./data');

// Controller-Klasse für die Bewerbungen
class ApplicationsController {
    // methode um eine Bewerbung zu erstellen
  static submitApplication(req, res) {
    const { jobId } = req.params;
    const { userId } = req.body;
    const newAppId = `app${Object.keys(applications).length + 1}`;
    // erstellt ein neues Bewerbungsobjekt
    const newApplication = {
      id: newAppId,
      jobId,
      userId,
      submittedDate: new Date().toISOString().split('T')[0],
      status: "Submitted"
    };
    // fügt die Bewerbung in die Liste der Bewerbungen hinzu
    applications[newAppId] = newApplication;
    // gibt die Bewerbung zurück
    res.status(201).json({
      ...newApplication,
      user: users[userId]
    });
  }

    // Methode um alle Bewerbungen zu einem Job anzuzeigen
  static listApplications(req, res) {
    const { jobId } = req.params;
    // filtert alle Bewerbungen nach der jobId
    const jobApplications = Object.values(applications)
      .filter(app => app.jobId === jobId)
      .map(app => ({
        ...app,
        user: users[app.userId]
      }));
    res.json(jobApplications);
  }
}

// exportiert die Klasse
module.exports = ApplicationsController;