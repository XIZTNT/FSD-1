const Agent = require('../../../shared/db/mongodb/schemas/agent.Schema');
const Region = require('../../../shared/db/mongodb/schemas/region.Schema');
const { ResponseUtil } = require('../../../shared/utils/response-util');
const asyncWrapper = require('../../../shared/util/base-utils');

// Create Region (need to add data within MONGO for WK6 so that other routes can work)
const createRegion = asyncWrapper(async (req, res) => {
  // Create new region from request body
  const region = await Region.create(req.body);

  // Standardized success response
  return ResponseUtil.respondOk(res, region, 'Region created', 201);  // Return the response
});

// Get specific Region based on query parameter
const getRegion = asyncWrapper(async (req, res) => {
  const regionSelected = req.query.region;

  if (!regionSelected || typeof regionSelected !== 'string') {
    return ResponseUtil.respondError(
      res,
      null,
      'region query parameter is required',
      400
    );
  }

  const region = await Region.find({
    region: { $regex: `^${regionSelected}$`, $options: 'i' } // case-insensitive match
  });

  if (!region.length) {
    return ResponseUtil.respondError(
      res,
      null,
      `No region with name ${regionSelected}`,
      404
    );
  }

  return ResponseUtil.respondOk(res, region, `Region ${regionSelected} data fetched`);
});


// Get top agents from North, South, and East regions
const getAllStars = asyncWrapper(async (req, res) => {
  const regions = ['north', 'south','west', 'east']; // Loop through to avoid repetitive code
  const topAgents = {};

  // Loop through each region and fetch top agent
  for (let regionName of regions) {
    const regionData = await Region.find({ region: regionName });
    if (regionData.length > 0) {
      topAgents[`topAgent_${regionName.charAt(0).toUpperCase() + regionName.slice(1)}`] = regionData[0].top_agents[0];
    }
  }

  // Standardized success response with region top agents
  return ResponseUtil.respondOk(
    res,
    topAgents,
    'Top agents from regions fetched'
  );  // Return the response
});

module.exports = {
  createRegion,
  getRegion,
  getAllStars
};
