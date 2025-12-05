const PublicController = require('../features/public/public.controller');

const registerPublicRoutes = (app) => {
  //contact route
  app.post('/contact', PublicController.contactUs);

//calc route renamed from 'calc-residential'
  app.get('/calc/:buildingType/:tier', PublicController.calculateResidentialQuote);
}

module.exports = {registerPublicRoutes};