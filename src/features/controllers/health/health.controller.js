const { ResponseUtil } = require('../../../shared/utils/response-util');
require('dotenv').config();
const port = process.env.PORT || 3004;

// HELLO WORLD
const helloWorld = async (req, res) => {
  const message = 'Hello World';             //Variable for validation
  console.log('helloWorld method called');  //Debug log
  console.log('Message to send:', message); //Log w/ message

  ResponseUtil.respondOk(res, { message }, message);
};

// STATUS
const status = async (req, res) => {
  const message = 'Status OK';               // Variable for validation
  console.log('status method called');
  console.log('Message to send:', message);

  ResponseUtil.respondOk(res, { message }, message);
};

// ERROR
const error = async (req, res) => {
  const message = 'Test Error Message';      //Variable for validation
  console.log('error method called');
  console.log('Message to send:', message);

  ResponseUtil.respondError(res, null, message);
};

module.exports = { helloWorld, status, error };
