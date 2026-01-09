const AdminController = require('../features/controllers/admin/admin.controller');
//Bonus Validator Import
const {regionAvgValidator} = require ('../shared/middleware/validator-middleware');

const registerAdminRoutes = (app) => {
  app.get('/email-list', AdminController.emailList);
  
//Bonus Validaton Middleware Applied
  app.get('/region-avg', regionAvgValidator, AdminController.regionAverage);
}

module.exports = {registerAdminRoutes};