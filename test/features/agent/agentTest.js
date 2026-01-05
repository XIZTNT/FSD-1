const chai = require('chai');
const sinon = require('sinon');
const { ResponseUtil } = require('../../../src/shared/utils/response-util');
const AgentController = require('../../../src/features/agent/agent.controller');
const Agent = require('../../../src/shared/db/mongodb/schemas/agent.Schema.js'); //MongoDB model

describe('AgentController', () => {
  afterEach(() => {
    sinon.restore(); // Clear stubs and mocks after each test
  });

  // Test: Create a new Agent
  describe('#createAgent()', () => {
    it('should create a new agent and return the agent data', (done) => {
      const agentData = { first_name: 'John', last_name: 'Doe', region: 'north', rating: 4 };

      // Mock the agent creation to avoid hitting the actual database
      sinon.stub(Agent, 'create').resolves(agentData);

      // Stub ResponseUtil to avoid sending actual responses
      const respondOkStub = sinon.stub(ResponseUtil, 'respondOk').callsFake((res, data, message) => {
        chai.assert.equal(message, 'Agent created');
        chai.assert.deepEqual(data, agentData);
        done();
      });

      // Call the controller method
      AgentController.createAgent({ body: agentData }, {});
    });
  });

  // Test: Get All Agents
  describe('#getAllAgents()', () => {
    it('should return a list of agents', (done) => {
      const agents = [
        { first_name: 'John', last_name: 'Doe', region: 'north', rating: 4 },
        { first_name: 'Jane', last_name: 'Smith', region: 'south', rating: 5 }
      ];

      // Mock the Agent.find method
      sinon.stub(Agent, 'find').resolves(agents);

      // Stub ResponseUtil to avoid sending actual responses
      const respondOkStub = sinon.stub(ResponseUtil, 'respondOk').callsFake((res, data, message) => {
        chai.assert.equal(message, 'Agents retrieved');
        chai.assert.isArray(data);
        chai.assert.equal(data.length, 2);
        done();
      });

      // Call the controller method
      AgentController.getAllAgents({}, {});
    });
  });

  // Test: Update Agent Info
  describe('#updateAgentInfo()', () => {
    it('should update an agent and return the updated agent', (done) => {
      const updatedAgent = { first_name: 'John', last_name: 'Doe', region: 'north', rating: 5 };
      const agentID = '12345';

      // Mock the agent update method
      sinon.stub(Agent, 'findByIdAndUpdate').resolves(updatedAgent);

      // Stub ResponseUtil to avoid sending actual responses
      const respondOkStub = sinon.stub(ResponseUtil, 'respondOk').callsFake((res, data, message) => {
        chai.assert.equal(message, 'Agent updated');
        chai.assert.deepEqual(data, updatedAgent);
        done();
      });

      // Call the controller method
      AgentController.updateAgentInfo({ params: { id: agentID }, body: updatedAgent }, {});
    });
  });

  // Test: Delete Agent
  describe('#deleteAgent()', () => {
    it('should delete an agent and return a success message', (done) => {
      const agentID = '12345';

      // Mock the agent delete method
      sinon.stub(Agent, 'findOneAndDelete').resolves({ msg: 'Agent deleted' });

      // Stub ResponseUtil to avoid sending actual responses
      const respondOkStub = sinon.stub(ResponseUtil, 'respondOk').callsFake((res, data, message) => {
        chai.assert.equal(message, 'Agent deleted');
        done();
      });

      // Call the controller method
      AgentController.deleteAgent({ params: { id: agentID } }, {});
    });
  });
});
