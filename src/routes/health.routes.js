const HealthController = require('../features/controllers/health/health.controller');

const registerHealthRoutes = (app) => {
  app.get('/hello', HealthController.helloWorld);

  app.get('/status', HealthController.status);

  app.get('/error', HealthController.error);
}

module.exports = {registerHealthRoutes};