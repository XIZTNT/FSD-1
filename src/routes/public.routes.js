const PublicController = require('../features/public/public.controller');

const registerPublicRoutes = (app) => {
  app.post('/contact', PublicController.contactUs);
//API renamed from 'calc-residential'
  app.get('/calc/:buildingType/:tier', PublicController.calculateResidentialQuote);
}

module.exports = {registerPublicRoutes};