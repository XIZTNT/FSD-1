const AgentController = require('../features/controllers/agent/agent.controller');
const {agentRegionValidator} = require ('../shared/middleware/validator-middleware');
//BONUS VALIDATORS BELLOW
const {createAgentValidator} = require ('../shared/middleware/validator-middleware');
const {updateAgentValidator} = require ('../shared/middleware/validator-middleware');
const {deleteAgentValidator} = require ('../shared/middleware/validator-middleware');

const registerAgentRoutes = (app) => {
  app.post('/agent-create', createAgentValidator, AgentController.createAgent);

  app.get('/agents', AgentController.getAllAgents);

  app.get('/agents-by-region', agentRegionValidator, AgentController.getAgentsByRegion);

  app.post('/agent-update-info/:id', updateAgentValidator, AgentController.updateAgentInfo);

  app.post('/agent-delete/:id', deleteAgentValidator, AgentController.deleteAgent);
}

module.exports = {registerAgentRoutes};