const Data = require('../../../shared/resources/data');
const { ResponseUtil } = require('../../../shared/utils/response-util');


const emailList = (req, res) => {
  // ORIGINAL LOGIC: collect agent emails
  const emails = Data.agents.map(agent => agent.email);

  // UPDATED: use ResponseUtil instead of res.send
  ResponseUtil.respondOk(res, emails, 'Email list retrieved');
};

const regionAverage = (req, res) => {
  // ORIGINAL: get region from query
  const region = req.query.region.toLowerCase();

  // ORIGINAL: filter agents by region
  const agents = Data.agents.filter(
    agent => agent.region.toLowerCase() === region
  );

  // ORIGINAL ESCAPE CLAUSE: check if no agents found for the region
  if (!agents.length) {
    // UPDATED: standardized error response using ResponseUtil
    return ResponseUtil.respondError(
      res,
      null,
      `No agents in region: ${region}`,
      404
    );
  }

  // Calculate averages
  const avgRating = (
    agents.reduce((total, current) => total + +current.rating, 0) / agents.length
  ).toFixed(2); // Fixed to 2 decimal places

  const avgFee = (
    agents.reduce((total, current) => total + +current.fee, 0) / agents.length
  ).toFixed(2); // Fixed to 2 decimal places

  // UPDATED: use ResponseUtil for success response instead of res.send
  ResponseUtil.respondOk(
    res,
    {
      region,
      average_rating: avgRating,
      average_fee: avgFee
    },
    'Region averages calculated'
  );
};

module.exports = { emailList, regionAverage };
