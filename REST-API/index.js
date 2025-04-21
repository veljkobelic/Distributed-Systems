const express = require('express');
const bodyParser = require('body-parser');
const jobsRouter = require('./jobs');
const applicationsRouter = require('./applications');

// Erstellt eine Express-App und definiert den Port
const app = express();
const port = 3001;

// Middleware um JSON-Body zu parsen
app.use(bodyParser.json());

// Routen für Jobs und Bewerbungen
app.use('/jobs', jobsRouter);
app.use('/jobs', applicationsRouter);

// Swagger UI einbinden
try {
  const swaggerUi = require('swagger-ui-express');
  const swaggerDocument = require('./swagger.json');
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  console.log('Swagger UI available at /api-docs');
} catch (error) {
  console.log('Swagger UI not available');
}

// Startet den Server
app.listen(port, () => {
  console.log(`Job Board API listening at http://localhost:${port}`);
});