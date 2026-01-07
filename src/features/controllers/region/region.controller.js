const Agent = require('../../../shared/db/mongodb/schemas/agent.Schema');
const Region = require('../../../shared/db/mongodb/schemas/region.Schema');
const { ResponseUtil } = require('../../../shared/utils/response-util');
const asyncWrapper = require('../../../shared/util/base-utils');

// Create Region
const createRegion = asyncWrapper(async (req, res) => {
  // Create new region from request body
  const region = await Region.create(req.body);

  // Standardized success response
  return ResponseUtil.respondOk(res, region, 'Region created', 201);  // Return the response
});

// Get specific Region based on query parameter
const getRegion = asyncWrapper(async (req, res) => {
  const regionSelected = req.query.region;

  // Find the region by name
  const region = await Region.find({ region: regionSelected.toLowerCase() });

  // Escape clause if no region found
  if (!region.length) {
    return ResponseUtil.respondError(
      res,
      null,
      `No region with name ${regionSelected}`,
      404
    );
  }

  // Standardized success response
  return ResponseUtil.respondOk(res, region, `Region ${regionSelected} data fetched`);  // Return the response
});

// Get top agents from North, South, and East regions
const getAllStars = asyncWrapper(async (req, res) => {
  const regions = ['north', 'south', 'east']; // Loop through to avoid repetitive code
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
