const chai = require('chai');
const sinon = require('sinon');
const { ResponseUtil } = require('../../../src/shared/utils/response-util');
const RegionController = require('../../../src/features/controllers/region/region.controller');
const Region = require('../../../src/shared/db/mongodb/schemas/region.Schema'); // MongoDB model

describe('RegionController', () => {
  afterEach(() => {
    sinon.restore(); // Clear stubs and mocks after each test
  });

  // Test: Create Region
  describe('#createRegion()', () => {
    it('should create a new region and return the region data', (done) => {
      const regionData = { region: 'north', top_agents: ['agent1', 'agent2'] };

      // Mock the region creation to avoid hitting the actual database
      sinon.stub(Region, 'create').resolves(regionData);

      // Stub ResponseUtil to avoid sending actual responses
      const respondOkStub = sinon.stub(ResponseUtil, 'respondOk').callsFake((res, data, message) => {
        chai.assert.equal(message, 'Region created');
        chai.assert.deepEqual(data, regionData);
        done();
      });

      // Call the controller method
      RegionController.createRegion({ body: regionData }, {});  // Send request with regionData in the body
    });
  });

  // Test: Get Region
  describe('#getRegion()', () => {
    it('should return the region data', (done) => {
      const regionData = { region: 'north', top_agents: ['agent1', 'agent2'] };

      // Mock the region search
      sinon.stub(Region, 'find').resolves([regionData]);  // Mock response as an array containing regionData

      // Stub ResponseUtil to avoid sending actual responses
      const respondOkStub = sinon.stub(ResponseUtil, 'respondOk').callsFake((res, data, message) => {
        chai.assert.equal(message, 'Region north data fetched');
        chai.assert.deepEqual(data, [regionData]);
        done();  // Ensure 'done()' is called when response is handled
      });

      // Call the controller method
      RegionController.getRegion({ query: { region: 'north' } }, {});  // Send query with region name 'north'
    });

    it('should return 404 when no region is found', (done) => {
      // Mock the region search to return an empty array (no region found)
      sinon.stub(Region, 'find').resolves([]);

      // Stub ResponseUtil to avoid sending actual responses
      const respondErrorStub = sinon.stub(ResponseUtil, 'respondError').callsFake((res, data, message) => {
        chai.assert.equal(message, 'No region with name north');
        done();  // Ensure 'done()' is called when response is handled
      });

      // Call the controller method with a region that doesn't exist
      RegionController.getRegion({ query: { region: 'north' } }, {});
    });
  });

  // Test: Get All Stars (Get top agents from all regions)
  describe('#getAllStars()', () => {
    it('should return top agents from each region', function(done) {
      this.timeout(5000);  // Set timeout to 5 seconds to allow for async operations
  
      const northRegion = { region: 'north', top_agents: ['agent1', 'agent2'] };
      const southRegion = { region: 'south', top_agents: ['agent3', 'agent4'] };
      const eastRegion = { region: 'east', top_agents: ['agent5', 'agent6'] };
  
      // Mock the region search for all regions
      sinon.stub(Region, 'find').callsFake((query) => {
        console.log('Region.find called with query:', query);  // Debugging line
        if (query.region === 'north') {
          return Promise.resolve([northRegion]);
        } else if (query.region === 'south') {
          return Promise.resolve([southRegion]);
        } else if (query.region === 'east') {
          return Promise.resolve([eastRegion]);
        }
        return Promise.resolve([]);  // Default empty array if region doesn't match
      });
  
      // Stub ResponseUtil to avoid sending actual responses
      const respondOkStub = sinon.stub(ResponseUtil, 'respondOk').callsFake((res, data, message) => {
        console.log('Responding with:', message, data);  // Debugging line
  
        chai.assert.equal(message, 'Top agents from regions fetched');
        chai.assert.deepEqual(data, {
          topAgent_North: 'agent1',
          topAgent_South: 'agent3',
          topAgent_East: 'agent5',
        });
  
        done();  // Ensure 'done()' is called when response is handled
      });
  
      // Call the controller method
      RegionController.getAllStars({}, {});  // No query data needed for this endpoint
    });
  });
  
});
