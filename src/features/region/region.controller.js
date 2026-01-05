const Agent = require('../../shared/db/mongodb/schemas/agent.Schema');
const Region = require('../../shared/db/mongodb/schemas/region.Schema');
const { ResponseUtil } = require('../../shared/utils/response-util');
const asyncWrapper = require('../../shared/util/base-utils');

// Create Region
const createRegion = asyncWrapper(async (req, res) => {
  // ORIGINAL: create new region from request body
  const region = await Region.create(req.body);

  // UPDATED: standardized success response
  ResponseUtil.respondOk(res, region, 'Region created', 201);
});

// Get specific Region based on query parameter
const getRegion = asyncWrapper(async (req, res) => {
  const regionSelected = req.query.region;

  // ORIGINAL: find region by name
  const region = await Region.find({ region: regionSelected.toLowerCase() });

  // ORIGINAL: escape clause if no region found
  if (!region.length) {
    return ResponseUtil.respondError(
      res,
      null,
      `No region with name ${regionSelected}`,
      404
    );
  }

  // UPDATED: standardized success response
  ResponseUtil.respondOk(res, region, `Region ${regionSelected} data fetched`);
});

// Get top agents from North, South, and East regions
const getAllStars = asyncWrapper(async (req, res) => {
  // ORIGINAL: fetch regions by name (north, south, east)
  const north_region = await Region.find({ region: 'north' });
  const south_region = await Region.find({ region: 'south' });
  const east_region = await Region.find({ region: 'east' });

  // UPDATED: standardized success response with region top agents
  ResponseUtil.respondOk(
    res,
    {
      region1: 'north',
      topAgent_North: north_region[0].top_agents[0],
      region2: 'east',
      topAgent_East: east_region[0].top_agents[0],
      region3: 'south',
      topAgent_South: south_region[0].top_agents[0]
    },
    'Top agents from regions fetched'
  );
});

module.exports = {
  createRegion,
  getRegion,
  getAllStars
};
