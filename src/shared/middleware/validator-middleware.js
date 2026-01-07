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
