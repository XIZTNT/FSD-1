const chai = require('chai');
const sinon = require('sinon');
const { ResponseUtil } = require('../../../src/shared/utils/response-util');
const PublicController = require('../../../src/features/public/public.controller');
const Contact = require('../../../src/shared/db/mongodb/schemas/contact.Schema'); // Your MongoDB model

describe('PublicController', () => {
  afterEach(() => {
    sinon.restore(); // Clear stubs and mocks after each test
  });

  // Test: Contact Us
  describe('#contactUs()', () => {
    it('should save a contact form submission and return a success message', (done) => {
      const contactData = {
        fullname: 'John Doe',
        email: 'john.doe@example.com',
        phone: '123-456-7890',
        company_name: 'Doe Inc.',
        project_name: 'New Building',
        project_description: 'A new commercial building',
        department: 'Sales',
        message: 'Please contact me for a quote'
      };

      // Mock the contact save method
      sinon.stub(Contact.prototype, 'save').resolves(contactData);

      // Stub ResponseUtil to avoid sending actual responses
      const respondOkStub = sinon.stub(ResponseUtil, 'respondOk').callsFake((res, data, message) => {
        chai.assert.equal(message, 'Message received from John Doe');
        chai.assert.deepEqual(data, contactData);
        done();
      });

      // Call the controller method
      PublicController.contactUs({ body: contactData }, {});
    });

    it('should handle validation errors gracefully', (done) => {
      const contactData = {
        fullname: '', // Invalid: missing fullname
        email: 'john.doe@example.com',
        phone: '123-456-7890',
        company_name: 'Doe Inc.',
        project_name: 'New Building',
        project_description: 'A new commercial building',
        department: 'Sales',
        message: 'Please contact me for a quote'
      };

      // Mock validation error
      const validationError = new Error('Validation failed');
      validationError.name = 'ValidationError';
      sinon.stub(Contact.prototype, 'save').rejects(validationError);

      // Stub ResponseUtil to handle error response
      const respondErrorStub = sinon.stub(ResponseUtil, 'respondError').callsFake((res, data, message) => {
        chai.assert.equal(message, 'Failed to submit contact form');
        done();
      });

      // Call the controller method
      PublicController.contactUs({ body: contactData }, {});
    });
  });

  // Test: Calculate Quote
  describe('#calculateQuote()', () => {
    it('should calculate and return the quote for the building', (done) => {
      const queryParams = {
        building_type: 'residential',
        numFloors: 10,
        numApts: 100,
        maxOccupancy: 500,
        tier: 'standard',
        regular_elevators: 0,
        freight_elevators: 0
      };

      // Stub ResponseUtil to avoid sending actual responses
      const respondOkStub = sinon.stub(ResponseUtil, 'respondOk').callsFake((res, data, message) => {
        chai.assert.equal(message, 'Quote calculated');
        chai.assert.equal(data.elevatorCount, 2); // Based on your logic
        done();
      });

      // Call the controller method
      PublicController.calculateQuote({ query: queryParams }, {});
    });
  });
});
