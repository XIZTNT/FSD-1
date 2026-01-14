const Agent = require('../../../shared/db/mongodb/schemas/agent.Schema')
const asyncWrapper = require('../../../shared/util/base-utils')
const { ResponseUtil } = require('../../../shared/utils/response-util')

// COLOR BY RATING UTILITY (NEED TO)
// const getColorByRating = require('../../shared/util/getColorByRating');

const createAgent = asyncWrapper(async (req, res) => {
  // ORIGINAL: create agent using request body
  const agent = await Agent.create(req.body);

  // UPDATED: standardized success response
  ResponseUtil.respondOk(res, agent, 'Agent created', 201);
});

const getAllAgents = asyncWrapper(async (req, res) => {
  // ORIGINAL: fetch all agents
  const agents = await Agent.find({});

  // ORIGINAL: alphabetical sorting by last name
  const agentsAlpha = agents.sort((a, b) =>
    a.last_name.localeCompare(b.last_name)
  );

  // UPDATED: standardized success response
  ResponseUtil.respondOk(res, agentsAlpha, 'Agents retrieved');
});

// UPDATED "AGENTSBYREGION" TO INCLUDE SORTING AND COLORS
// REFER TO AGENTS.JS (src/public/assets/js/agents.js) FOR FRONT END CONNECTION
const getAgentsByRegion = asyncWrapper(async (req, res) => {
  const { firstName, lastName, fee, rating, region, sortBy, sortDirection } = req.query;

  // ---------------- Filters ----------------
  const filters = {};
  if (region && region !== '') filters.region = region.toLowerCase();

  // ---------------- Sorting ----------------
  const sortOptions = {};

  // Use sortBy + sortDirection from frontend table header first
  if (sortBy) {
    const direction = sortDirection === 'desc' ? -1 : 1;

    switch (sortBy) {
      case 'first_name':
      case 'last_name':
      case 'fee':
      case 'rating':
      case 'region':
        sortOptions[sortBy] = direction;
        break;
      default:
        break; // ignore invalid sortBy
    }
  }

  // Then apply individual dropdowns (overrides header sort if set)
  if (firstName && firstName !== 'all') sortOptions.first_name = firstName === 'asc' ? 1 : -1;
  if (lastName && lastName !== 'all') sortOptions.last_name = lastName === 'asc' ? 1 : -1;
  if (fee && fee !== 'all') sortOptions.fee = fee === 'asc' ? 1 : -1;
  if (rating && rating !== 'all') sortOptions.rating = rating === 'asc' ? 1 : -1;

  // ---------------- Query ----------------
  try {
    const agents = await Agent.find(filters).sort(sortOptions);

    // Return the standardized success response
    ResponseUtil.respondOk(res, agents, 'Agents filtered by region');
  } catch (err) {
    ResponseUtil.respondError(res, err.message, 'Error fetching agents', 500);
  }
});


// END OF UPDATED "AGENTSBYREGION" TO INCLUDE SORTING AND COLORS

const updateAgentInfo = asyncWrapper(async (req, res) => {
  const { id: agentID } = req.params;

  // ORIGINAL: update agent by ID
  const agent = await Agent.findByIdAndUpdate(
    { _id: agentID },
    req.body,
    {
      new: true,
      runValidators: true
    }
  );

  // ORIGINAL: escape clause if agent not found
  if (!agent) {
    return ResponseUtil.respondError(
      res,
      null,
      `No agent with id ${agentID}`,
      404
    );
  }

  // UPDATED: standardized success response
  ResponseUtil.respondOk(res, agent, 'Agent updated');
});

const deleteAgent = asyncWrapper(async (req, res) => {
  const { id: agentID } = req.params;

  // ORIGINAL: delete agent by ID
  const agent = await Agent.findOneAndDelete({ _id: agentID });

  // ORIGINAL: escape clause if agent not found
  if (!agent) {
    return ResponseUtil.respondError(
      res,
      null,
      `No agent with id ${agentID}`,
      404
    );
  }

  // UPDATED: standardized success response
  ResponseUtil.respondOk(res, agent, 'Agent deleted', 201);
});

module.exports = {
  createAgent,
  getAllAgents,
  getAgentsByRegion,
  updateAgentInfo,
  deleteAgent
};
