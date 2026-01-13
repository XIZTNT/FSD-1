//VALIDATOR MIDDLEWARE 

import validator from "validator";


//CONTACT US FIELDS VALIDATION
export const contactValidator = (req, res, next) => {
  const {
    fullname,
    email,
    phone,
    company_name,
    project_name,
    project_description,
    message
  } = req.body;

  // Required fields
  if (
    validator.isEmpty(fullname || "") ||
    validator.isEmpty(email || "") ||
    validator.isEmpty(company_name || "") ||
    validator.isEmpty(project_name || "") ||
    validator.isEmpty(project_description || "") ||
    validator.isEmpty(message || "")
  ) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // Email
  if (!validator.isEmail(email)) {
    return res.status(400).json({ error: "Invalid email address" });
  }

  // Phone (optional)
  if (phone && !validator.isMobilePhone(phone, "any")) {
    return res.status(400).json({ error: "Invalid phone number" });
  }

  next(); // ✅ validation passed
};

//QUOTE CALCULATION QUERY VALIDATION
export const quoteValidator = (req, res, next) => {
  const { building_type, numApts, numFloors, maxOccupancy, regular_elevators, freight_elevators } = req.query;

  const fieldsByType = {
      residential: ["numApts", "numFloors"],
      commercial: ["numFloors", "maxOccupancy"],
      industrial: ["regular_elevators", "freight_elevators"]
  };

  const requiredFields = fieldsByType[building_type] || [];

  for (let field of requiredFields) {
      if (!req.query[field] || validator.isEmpty(req.query[field].toString())) {
          return res.status(400).json({ error: `${field} is required for ${building_type}` });
      }
      if (!validator.isInt(req.query[field].toString(), { min: 0 })) {
          return res.status(400).json({ error: `${field} must be a positive integer` });
      }
  }

  next();
};


// AGENT TABLE QUERY VALIDATION WITHIN POSTMAN
export const agentRegionValidator = (req, res, next) => {
  const { region } = req.query;

  // If region is NOT provided, skip validation
  if (!region) {
    return next();
  }

  const allowedRegions = ["north", "south", "east", "west"];

  if (!allowedRegions.includes(region.toLowerCase())) {
    return res.status(400).json({ error: "Invalid region provided" });
  }

  next();
};

//BONUS: REMAINING APIS VALIDATION MIDDLEWARE
//BONUS VALIDATION FOR ADMIN APIS
export const regionAvgValidator = (req, res, next) => {
  const { region } = req.query;

  if (!region || validator.isEmpty(region.toString())) {
    return res.status(400).json({ error: "region query parameter is required" });
  }

  const allowedRegions = ["north", "south", "east", "west"];

  if (!allowedRegions.includes(region.toLowerCase())) {
    return res.status(400).json({ error: "Invalid region provided" });
  }

  next();
};


//BONUS VALIDATION FOR AGENT APIS

//AGENT CREATION VALIDATION
export const createAgentValidator = (req, res, next) => {
  const { first_name, last_name, email, region, fee, rating } = req.body;

  if (
    validator.isEmpty(first_name || '') ||
    validator.isEmpty(last_name || '') ||
    validator.isEmpty(email || '') ||
    validator.isEmpty(region || '')
  ) {
    return res.status(400).json({ error: 'Missing required agent fields' });
  }

  if (!validator.isEmail(email)) {
    return res.status(400).json({ error: 'Invalid email address' });
  }

  const allowedRegions = ['north', 'south', 'east', 'west'];
  if (!allowedRegions.includes(region.toLowerCase())) {
    return res.status(400).json({ error: 'Invalid region value' });
  }

  if (fee && !validator.isFloat(fee.toString(), { min: 0 })) {
    return res.status(400).json({ error: 'Fee must be a positive number' });
  }

  if (rating && !validator.isFloat(rating.toString(), { min: 0, max: 5 })) {
    return res.status(400).json({ error: 'Rating must be between 0 and 5' });
  }

  next();
};

//AGENT UPDATE VALIDATION
export const updateAgentValidator = (req, res, next) => {
  const { id } = req.params;

  if (!validator.isMongoId(id)) {
    return res.status(400).json({ error: 'Invalid agent ID' });
  }

  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({ error: 'Update data is required' });
  }

  next();
};



//AGENT DELETE VALIDATION
export const deleteAgentValidator = (req, res, next) => {
  const { id } = req.params;

  if (!validator.isMongoId(id)) {
    return res.status(400).json({ error: 'Invalid agent ID' });
  }

  next();
};


//REGION CREATION VALIDATION (validator already imported from first line)

export const createRegionValidator = (req, res, next) => {
  const { region, top_agents } = req.body;

  if (validator.isEmpty(region || '')) {
    return res.status(400).json({ error: 'Region name is required' });
  }

  const allowedRegions = ['north', 'south', 'east', 'west'];

  if (!allowedRegions.includes(region.toLowerCase())) {
    return res.status(400).json({ error: 'Invalid region name' });
  }

  // Optional: validate top_agents is an array
  if (top_agents && !Array.isArray(top_agents)) {
    return res.status(400).json({ error: 'top_agents must be an array' });
  }

  next();
};

//GET REGION VALIDATION

export const getRegionValidator = (req, res, next) => {
  const { region } = req.query;

  if (!region || validator.isEmpty(region.toString())) {
    return res.status(400).json({ error: 'region query parameter is required' });
  }

  const allowedRegions = ['north', 'south', 'east', 'west'];

  if (!allowedRegions.includes(region.toLowerCase())) {
    return res.status(400).json({ error: 'Invalid region value' });
  }

  next();
};


//HEALTH CONTROLLER VALIDATOR
export const healthMessageValidator = (req, res, next) => {
  const messageMap = {
    '/hello': 'Hello World',
    '/status': 'Status OK',
    '/error': 'Test Error Message',
  };

  const expectedMessage = messageMap[req.path];

  if (!expectedMessage || typeof expectedMessage !== 'string' || expectedMessage.length === 0) {
    return res.status(500).json({ error: 'Invalid response message' });
  }

  next();
};

//ADMIN/EMAIL LIST VALIDATOR
export const emailListValidator = (req, res, next) => {
  const { email } = req.query;

  // If email filter is provided, validate it
  if (email && !validator.isEmail(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  next();
};

//GetALL AGENTS VALIDATOR
