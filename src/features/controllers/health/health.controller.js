const { ResponseUtil } = require('../../../shared/utils/response-util');
require('dotenv').config();
const port = process.env.PORT || 3004;

const helloWorld = async (req, res) => {
  //Debug log after response-util logic centralization
  console.log('helloWorld method called');
  ResponseUtil.respondOk(res, null, 'Hello World');
};

const status = async (req, res) => {
  //Debug log after response-util logic centralization
  console.log('status method called');
  ResponseUtil.respondOk(res, null, 'Status OK');
};

const error = async (req, res) => {
  //Debug log after response-util logic centralization
  console.log('error method called');
  const errorMessage = 'Test Error Message';
  ResponseUtil.respondError(res, null, errorMessage);
};

module.exports = { helloWorld, status, error };
