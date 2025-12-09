const PublicController = require('../features/public/public.controller');

const registerPublicRoutes = (app) => {
  //contact route
  app.post('/contact-us', PublicController.contactUs);

//calc route renamed from 'calc-residential', and no longer "GET"
  app.get('/calc', PublicController.calculateQuote);
}

module.exports = {registerPublicRoutes};