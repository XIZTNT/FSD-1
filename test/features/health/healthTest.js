const chai = require('chai');
const sinon = require('sinon');
//Changed file path to have extra "../" to match test folder structure
const HealthController = require('../../../src/features/health/health.controller');
const ResponseUtil = require('../../../src/shared/utils/response-util').ResponseUtil;

describe('HealthController', () => {
  //All tests for HealthController go inside this block
  afterEach(() => {
    //Changes reset after each test runs/
    sinon.restore();
  });

  describe('#helloWorld()', () => {
    it('respond with Hello World', (done) => {
      sinon.stub(ResponseUtil, 'respondOk').callsFake((res, data, message) => {
        chai.assert.equal(message, 'Hello World');
        done();
      });

      void HealthController.helloWorld();
    });
  });

  //Status Testing
  describe('#status()', () => {
    it('respond with status ok', (done) => {
      sinon.stub(ResponseUtil, 'respondOk').callsFake((res, data, message) => {
        chai.assert.equal(message, 'Status OK');
        done();
      });

      void HealthController.status();
    });
  });

  //Error Testing
  describe('#error()', () => {
    it('respond with error message', (done) => {
      const errorMessage = 'Test Error Message';
      sinon.stub(ResponseUtil, 'respondError').callsFake((res, error, message) => {
        chai.assert.equal(message, errorMessage);
        done();
      });

      void HealthController.error(new Error(errorMessage));
    });
  });
  
//Individual tests end here
});
