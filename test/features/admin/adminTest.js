const chai = require('chai'); 
const sinon = require('sinon');
const { ResponseUtil } = require('../../../src/shared/utils/response-util');
const AdminController = require('../../../src/features/controllers/admin/admin.controller');
const Data = require('../../../src/shared/resources/data');

// Start your test suite for AdminController
describe('AdminController', () => {
  afterEach(() => {
    // Reset all the spies and stubs after each test to ensure no interference
    sinon.restore();
  });

  // Test the email list functionality
  describe('#emailList()', () => {
    it('should return a list of emails', (done) => {
      // Create a stub for ResponseUtil.respondOk
      const respondOkStub = sinon.stub(ResponseUtil, 'respondOk').callsFake((res, data, message) => {
        chai.assert.equal(message, 'Email list retrieved');
        chai.assert.isArray(data);
        chai.assert.equal(data.length, 2); // Assuming there are 2 agents in Data.agents
        done();
      });

      // Mock the agents data (in case Data is not available)
      sinon.stub(Data, 'agents').value([
        { email: 'test1@example.com' },
        { email: 'test2@example.com' }
      ]);

      // Call the controller method
      AdminController.emailList({}, {});  // No real response object needed for this test
    });
  });

  // Test the region average functionality
  describe('#regionAverage()', () => {
    it('should return the average rating and fee for a region', (done) => {
      // Mock the agents data to simulate the region filter
      sinon.stub(Data, 'agents').value([
        { region: 'north', rating: 4, fee: 100 },
        { region: 'north', rating: 3, fee: 150 },
      ]);

      // Stub the ResponseUtil.respondOk method
      const respondOkStub = sinon.stub(ResponseUtil, 'respondOk').callsFake((res, data, message) => {
        chai.assert.equal(message, 'Region averages calculated');
        chai.assert.deepEqual(data, {
          region: 'north',
          average_rating: '3.50',
          average_fee: '125.00'
        });
        done();
      });

      // Call the controller method (simulate a request with region query)
      AdminController.regionAverage({ query: { region: 'north' } }, {});
    });
  });
});
