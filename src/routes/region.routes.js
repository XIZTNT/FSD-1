
const RegionController = require('../features/controllers/region/region.controller');
//Bonus VALIDATION MIDDLEWARE
const createRegionValidator = require('../shared/middleware/validator-middleware').createRegionValidator;
const getRegionValidator = require('../shared/middleware/validator-middleware').getRegionValidator;
const allStarsLimitValidator = require('../shared/middleware/validator-middleware').allStarsLimitValidator;

const registerRegionRoutes = (app) => {
  app.post('/region-create', createRegionValidator, RegionController.createRegion);

  app.get('/region', getRegionValidator, RegionController.getRegion);

  app.get('/all-stars', allStarsLimitValidator, RegionController.getAllStars);
}

module.exports = {registerRegionRoutes};