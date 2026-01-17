const chai = require('chai');
const sinon = require('sinon');
const { ResponseUtil } = require('../../../src/shared/utils/response-util');
const AdminController = require('../../../src/features/controllers/admin/admin.controller');
const Data = require('../../../src/shared/resources/data');

describe('AdminController', () => {
  let originalAgents;

  beforeEach(() => {
    // Preserve original shared data before each test
    originalAgents = Data.agents;
  });

  afterEach(() => {
    // Restore shared state and clean up stubs
    Data.agents = originalAgents;
    sinon.restore();
  });

  describe('#emailList()', () => {
    it('should return a list of emails', (done) => {
      // Arrange: mock agent data
      Data.agents = [
        { email: 'test1@example.com' },
        { email: 'test2@example.com' }
      ];

      // Arrange: stub ResponseUtil
      sinon.stub(ResponseUtil, 'respondOk').callsFake((res, data, message) => {
        chai.assert.equal(message, 'Email list retrieved');
        chai.assert.isArray(data);
        chai.assert.deepEqual(data, [
          'test1@example.com',
          'test2@example.com'
        ]);
        done();
      });

      // Act
      AdminController.emailList({ query: {} }, {});
    });
  });

  describe('#regionAverage()', () => {
    it('should return the average rating and fee for a region', (done) => {
      // Arrange: mock agent data
      Data.agents = [
        { region: 'north', rating: 4, fee: 100 },
        { region: 'north', rating: 3, fee: 150 }
      ];

      // Arrange: stub ResponseUtil
      sinon.stub(ResponseUtil, 'respondOk').callsFake((res, data, message) => {
        chai.assert.equal(message, 'Region averages calculated');
        chai.assert.deepEqual(data, {
          region: 'north',
          average_rating: '3.50',
          average_fee: '125.00'
        });
        done();
      });

      // Act
      AdminController.regionAverage(
        { query: { region: 'north' } },
        {}
      );
    });
  });
});
