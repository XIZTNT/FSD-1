const Agent = require('../../shared/db/mongodb/schemas/agent.Schema')
const asyncWrapper = require('../../shared/util/base-utils')
//COLOR BY RATING UTILITY
const getColorByRating = require('../../shared/util/getColorByRating');

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
const getAgentsByRegion = asyncWrapper(async (req, res) => {
  const { firstName, lastName, fee, rating, region, sortBy = "name", sortDirection = "asc" } = req.query;

  // Construct filters based on query parameters
  let filters = {};

  if (firstName) filters.first_name = new RegExp(firstName, 'i');  // Case-insensitive search for first name
  if (lastName) filters.last_name = new RegExp(lastName, 'i');     // Case-insensitive search for last name
  if (fee) filters.fee = fee;  // Exact fee match
  if (rating) filters.rating = rating;  // Exact rating match
  if (region) filters.region = region.toLowerCase();  // Ensure region is case-insensitive

  // Define the sorting options (default to sorting by name)
  let sortOptions = {};
  if (sortBy === "name") {
      sortOptions.last_name = sortDirection === "asc" ? 1 : -1;  // Sort by last_name
  } else if (sortBy === "rating") {
      sortOptions.rating = sortDirection === "asc" ? 1 : -1;
  } else if (sortBy === "fee") {
      sortOptions.fee = sortDirection === "asc" ? 1 : -1;
  }

  try {
      // Fetch agents based on filters and sorting options
      const agents = await Agent.find(filters).sort(sortOptions);

      if (agents.length === 0) {
          return res.status(404).json({ msg: 'No agents found matching the criteria.' });
      }

      // Add color based on rating (if needed)
      const agentsWithColor = agents.map(agent => {
          agent.ratingColor = getColorByRating(agent.rating);  // Assuming you have a utility to return colors based on rating
          return agent;
      });

      // Send back the agents data
      res.status(200).json({ agents: agentsWithColor });

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