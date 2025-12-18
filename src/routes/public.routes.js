const PublicController = require('../features/public/public.controller');
const {contactValidator} = require ('../shared/middleware/validator-middleware');
const {quoteValidator} = require ('../shared/middleware/validator-middleware');
//need to add residential fields validator when the api is called by the controller   

const registerPublicRoutes = (app) => {
  //contact route
  app.post('/contact-us', contactValidator, PublicController.contactUs);

//calc route renamed from 'calc-residential', and no longer "GET"
  app.get('/calc', quoteValidator, PublicController.calculateQuote);
}

module.exports = {registerPublicRoutes};