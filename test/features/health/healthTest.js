const chai = require('chai');
const sinon = require('sinon');
const { ResponseUtil } = require('../../../src/shared/utils/response-util');
const HealthController = require('../../../src/features/controllers/health/health.controller');

const { expect } = chai;

describe('HealthController', () => {

  afterEach(() => {
    // Ensure all stubs are reset after each test
    sinon.restore();
  });

  describe('#helloWorld()', () => {
    it('responds with Hello World', () => {
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub()
      };

      const respondOkStub = sinon.stub(ResponseUtil, 'respondOk');

      // Call helloWorld with mock req and res
      HealthController.helloWorld({}, res);

      // Log to see what the stub was called with
      console.log(respondOkStub.args);  // Debugging line

      // Check if the stub was called
      expect(respondOkStub.calledOnce).to.be.true;
      expect(respondOkStub.calledWith(res, null, 'Hello World')).to.be.true; // Adjusted expectation
    });
  });

  describe('#status()', () => {
    it('responds with status ok', () => {
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub()
      };

      const respondOkStub = sinon.stub(ResponseUtil, 'respondOk');

      // Call status with mock req and res
      HealthController.status({}, res);

      // Log to see what the stub was called with
      console.log(respondOkStub.args);  // Debugging line

      // Check if the stub was called
      expect(respondOkStub.calledOnce).to.be.true;
      expect(respondOkStub.calledWith(res, null, 'Status OK')).to.be.true; // Adjusted expectation
    });
  });

  describe('#error()', () => {
    it('responds with error message', () => {
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub()
      };

      const respondErrorStub = sinon.stub(ResponseUtil, 'respondError');

      // Call error with mock req and res
      HealthController.error({}, res);

      // Log to see what the stub was called with
      console.log(respondErrorStub.args);  // Debugging line

      // Check if the stub was called
      expect(respondErrorStub.calledOnce).to.be.true;
      expect(respondErrorStub.calledWith(res, null, 'Test Error Message')).to.be.true; // Adjusted expectation
    });
  });

});
