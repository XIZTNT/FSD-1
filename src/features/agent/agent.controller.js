const Agent = require('../../shared/db/mongodb/schemas/agent.Schema')
const asyncWrapper = require('../../shared/util/base-utils')
//COLOR BY RATING UTILITY (NEED TO)
// const getColorByRating = require('../../shared/util/getColorByRating');

const createAgent = asyncWrapper( async (req,res) => {
  const agent = await  Agent.create(req.body);
  res.status(201).json({ msg: 'Agent created', data: agent }); 
});

const getAllAgents = asyncWrapper( async (req,res) => {
  const agents = await Agent.find({});
  const agentsAlpha = agents.sort((a, b) => a.last_name.localeCompare(b.last_name));
  res.status(200).json({ data: agentsAlpha });
});

//UPDATED "AGENTSBYREGION" TO INCLUDE SORTING AND COLORS
//"NO RESIDENTIAL.JS FOR FRONT END CONNECTED, FOR EXAMPLE, DUE TO HTML PRIMARILY COMMUNICATING 
//WITH BACK END VIA JSON"
const getAgentsByRegion = asyncWrapper(async (req, res) => {
  const { firstName, lastName, fee, rating, region } = req.query;

  // ---------------- Filters ----------------
  const filters = {};
  if (region && region !== '') filters.region = region.toLowerCase();

  // ---------------- Sorting ----------------
  const sortOptions = {};

  // Handle first name sorting
  if (firstName && firstName !== 'all') {
    sortOptions.first_name = firstName === 'asc' ? 1 : -1;
  }

  // Handle last name sorting
  if (lastName && lastName !== 'all') {
    sortOptions.last_name = lastName === 'asc' ? 1 : -1;
  }

  // Handle fee sorting
  if (fee && fee !== 'all') {
    sortOptions.fee = fee === 'asc' ? 1 : -1;
  }

  // Handle rating sorting
  if (rating && rating !== 'all') {
    sortOptions.rating = rating === 'asc' ? 1 : -1;
  }

  // ---------------- Query ----------------
  try {
    const agents = await Agent.find(filters).sort(sortOptions);
    res.status(200).json({ agents });
  } catch (err) {
    res.status(500).json({ msg: "Error fetching agents.", error: err.message });
  }
});
  
//END OF UPDATED "AGENTSBYREGION" TO INCLUDE SORTING AND COLORS

const updateAgentInfo = asyncWrapper( async (req,res) => {
  const { id:agentID } = req.params;
  const agent = await Agent.findByIdAndUpdate({ _id:agentID }, req.body, {
    new:true,
    runValidators:true
  });
  if (!agent) {
    return res.status(404).json({ msg:`No agent with id ${agentID}` })    
  }
  res.status(200).json({ agent }) 
});

const deleteAgent = asyncWrapper( async (req,res) => {
  const { id:agentID } = req.params;
  const agent = await Agent.findOneAndDelete({ _id: agentID });   
  if (!agent) {
    return res.status(404).json({ msg:`No agent with id ${agentID}` })    
  }
  if (agent.length > 1) {
    return res.status(404).json({ msg:'Multiple agents returned, can only delete one at a time' })    
  }
  res.status(201).json({ msg:'Agent deleted', agent });  
});


module.exports = {
  createAgent,
  getAllAgents,
  getAgentsByRegion,
  updateAgentInfo,
  deleteAgent
};