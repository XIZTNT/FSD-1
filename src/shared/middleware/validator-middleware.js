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

export const quoteValidator = (req, res, next) => {
    const { buildingType, numberOfApartments, numberOfFloors, maximumOccupancy, numberOfElevators } = req.body;

    const fieldsByType = {
        residential: ["numberOfApartments", "numberOfFloors"],
        commercial: ["numberOfFloors", "maximumOccupancy"],
        industrial: ["numberOfElevators"]
    };

    const requiredFields = fieldsByType[buildingType] || [];

    for (let field of requiredFields) {
        if (!req.body[field] || validator.isEmpty(req.body[field].toString())) {
            return res.status(400).json({ error: `${field} is required for ${buildingType}` });
        }
        // Check numbers are valid integers
        if (!validator.isInt(req.body[field].toString(), { min: 0 })) {
            return res.status(400).json({ error: `${field} must be a positive integer` });
        }
    }

    next();
};


// AGENT TABLE QUERY VALIDATION
export const agentRegionValidator = (req, res, next) => {
    const { region } = req.query;  // Assuming region is passed as a query parameter
  
    // Required region check
    if (validator.isEmpty(region || "")) {
      return res.status(400).json({ error: "Region is required" });
    }
  
    // List of predefined valid regions (you could also fetch this dynamically from the database if needed)
    const allowedRegions = ["North", "South", "East", "West"];
    
    // Check if the region passed is in the predefined list
    if (!allowedRegions.includes(region)) {
      return res.status(400).json({ error: "Invalid region provided" });
    }
  
    next(); // Proceed with the query if region is valid
  };