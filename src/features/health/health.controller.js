const ResponseUtil = require('../../shared/utils/response-util').ResponseUtil;
require('dotenv').config();
const port = process.env.PORT || 3004;

const helloWorld = async(req, res) => {
  ResponseUtil.respondOk(res,null, 'Hello World')
  // res.send('Hello World!!');
};

//Updated Status for Testing
const status = async(req,res) => {
  ResponseUtil.respondOk(res, null, 'Status OK');
};

//Updated Error for Testing
const error = async(req,res) => {
  const errorMessage = 'Test Error Message';
  ResponseUtil.respondError(res, null, errorMessage);
};


module.exports = {helloWorld, status, error};