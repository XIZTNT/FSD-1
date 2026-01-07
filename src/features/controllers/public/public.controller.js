//Contact Us Schema Import
const Contact = require('../../../shared/db/mongodb/schemas/contact.Schema');
const { ResponseUtil } = require('../../../shared/utils/response-util');

//I believe will be necessary for agent table creation
const Data = require('../../../shared/resources/data');

//const validator = require('validator'); // You might need this for future validations

//Contact Us Controller
const contactUs = async (req, res) => {
  const {
    fullname, email, phone, company_name,
    project_name, project_description,
    department, message
  } = req.body;

  try {
    // ORIGINAL: Create a new document using the Contact schema
    const newContact = new Contact({
      fullname,
      email,
      phone,
      company_name,
      project_name,
      project_description,
      department,
      message
    });

    // ORIGINAL: Save it to MongoDB
    await newContact.save();

    // UPDATED: standardized success response
    ResponseUtil.respondOk(
      res,
      newContact,
      `Message received from ${fullname}`,
      201
    );
  } catch (err) {
    console.error(err);

        // Call the static method directly to handle errors
        ResponseUtil.respondError(res, null, 'Failed to submit contact form');
  }
};

// NEW QUOTE CONTROLLER
const calculateQuote = (req, res) => {
  let { building_type, numFloors, numApts, maxOccupancy, tier, regular_elevators, freight_elevators } = req.query;

  // Convert numeric strings to numbers
  numFloors = Number(numFloors) || 0;
  numApts = Number(numApts) || 0;
  maxOccupancy = Number(maxOccupancy) || 0;
  regular_elevators = Number(regular_elevators) || 0;
  freight_elevators = Number(freight_elevators) || 0;

  let elevatorCount = 0;

  // Residential calculation
  if (building_type === "residential") {
    elevatorCount = Math.max(1, Math.ceil(numApts / numFloors / 6) * Math.ceil(numFloors / 20));
  }

  // Commercial calculation
  else if (building_type === "commercial") {
    const regular = Math.ceil((maxOccupancy * numFloors) / 200) * Math.ceil(numFloors / 10);
    const freight = Math.ceil(numFloors / 10);

    // Use specified quantities for each elevator type if provided
    elevatorCount = regular_elevators + freight_elevators;

    // If quantities are not specified, fallback to calculated values
    if (regular_elevators === 0) {
      elevatorCount += regular;
    }
    if (freight_elevators === 0) {
      elevatorCount += freight;
    }
  }

  // Industrial calculation
  else if (building_type === "industrial") {
    elevatorCount = regular_elevators + freight_elevators;
  }

  // Pricing based on tier
  let unitPrice = 0;
  let installRate = 0;

  switch (tier) {
    case "premium":
      unitPrice = 12000;
      installRate = 0.15;
      break;
    case "excelium":
      unitPrice = 15000;
      installRate = 0.2;
      break;
    default: // "standard"
      unitPrice = 8000;
      installRate = 0.1;
  }

  const elevatorCost = elevatorCount * unitPrice;
  const installationFee = elevatorCost * installRate;
  const totalCost = elevatorCost + installationFee;

  // UPDATED: standardized success response
  ResponseUtil.respondOk(res, {
    elevatorCount,
    unitPrice,
    elevatorCost,
    installationFee,
    totalCost
  }, 'Quote calculated');
};

//FIXATED ON CURRENT AGENT CONTROLLER DUE TO WORKING WITH MONGODB SCHEMA AND OTHER REQUIREMENTS NECESSARY
//FOR SEPARATION

module.exports = { contactUs, calculateQuote };
