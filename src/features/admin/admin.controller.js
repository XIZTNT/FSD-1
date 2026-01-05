const Data = require('../../shared/resources/data');
const { ResponseUtil } = require('../../shared/utils/response-util');
//NEED
//TO ASK WHAT IS THE DIFFERENCE BETWEEN LOGIC AND ESCAPE CLAUSE
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

  // ORIGINAL ESCAPE CLAUSE
  if (!agents.length) {
    // UPDATED: standardized error response
    return ResponseUtil.respondError(
      res,
      null,
      `No agents in region: ${region}`,
      404
    );
  }

  const avgRating =
    agents.reduce((total, current) => {
      return total + +current.rating;
    }, 0) / agents.length;

  const avgFee =
    agents.reduce((total, current) => {
      return total + +current.fee;
    }, 0) / agents.length;

  // UPDATED: use ResponseUtil instead of res.send
  ResponseUtil.respondOk(
    res,
    {
      region,
      average_rating: avgRating.toFixed(2),
      average_fee: avgFee.toFixed(2)
    },
    'Region averages calculated'
  );
};

module.exports = { emailList, regionAverage };

