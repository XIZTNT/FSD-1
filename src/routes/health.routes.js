const HealthController = require('../features/controllers/health/health.controller');
//Bonus Validator
const {healthMessageValidator}  = require ('../shared/middleware/validator-middleware'); 

const registerHealthRoutes = (app) => {
  app.get('/hello',healthMessageValidator, HealthController.helloWorld);

  app.get('/status',healthMessageValidator, HealthController.status);

  app.get('/error',healthMessageValidator, HealthController.error);
}

module.exports = {registerHealthRoutes};