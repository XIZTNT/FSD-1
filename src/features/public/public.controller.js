//I believe will be necessary for agent table creation
const Data = require('../../shared/resources/data');
//Contact Us Schema Import
const Contact = require ('../../shared/db/mongodb/schemas/contact.Schema')
const Quote = require ('../../shared/db/mongodb/schemas/quote.Schema')

//I need to use with building types for request quote portion
const validator = require('validator');

//Contact Us Controller
const contactUs = async (req,res) => {

  const { fullname, email, phone, company_name, project_name, project_description, department, message } = req.body;

  try {

    // Create a new document using the Contact schema
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

    // Save it to MongoDB
    await newContact.save();

    // Send a simple confirmation, with JSON to communicate with HTML script
    res.status(201).json({ message: `Message received from ${fullname}` });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to submit contact form" });
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

  // Return JSON with results
  res.json({
    elevatorCount,
    unitPrice,
    elevatorCost,
    installationFee,
    totalCost
  });
};

//AGENT TABLE








//NOTES FOR CONTACT US CONTROLLER: 
//Watch video, FOR DEMO FOR ROAD MAP, AND PREDETERMINED, AND ADD THINGS FOR HEALTH
//WILL NEED TO REUSE, JAVASCRIPT FILES WILL BE USED AND LET'S SAY 
//RESIDENTIAL.JS FILE that will HOLD AGENTS FOR THE TABLE AND THE QUOTE.JS AND GAIN EACCESS TO THE HTML
//FOR QUOTE.JS I WILL NEED THE QUOTE FORM SUBMISSION...
//QUOTE FORM SUBMISSION WILL HAVE 
//CONTACT POST YOU'LL WANT TO IMPORT CONTACT FORM, SETTING IT UP FOR DOCUMENT.GETELEMENT.ID AND MAP ALL CONTACT FIELDS
//THEN FOR CONTACT, YOU'LL HAVE AN EVENET, SUCCESS MODEL

//QUOTE CONTROLLER
// controllers/quoteController.js
// const calculateQuote = async (req, res) => {
//   const { building_type, numFloors, numApts, maxOccupancy, numElevators, productLine } = req.body;

//   try {
//     // 1. Run calculations
//     let elevatorsRequired;
//     if (building_type === "residential") {
//       elevatorsRequired = calcService.calcResidentialElev(numFloors, numApts);
//     } else if (building_type === "commercial") {
//       elevatorsRequired = calcService.calcCommercialElev(numFloors, maxOccupancy);
//     } else {
//       elevatorsRequired = numElevators;
//     }

//     const unitPrices = Data.unitPrices;
//     const installPercentFees = Data.installPercentFees;

//     if (!unitPrices[productLine]) {
//       return res.status(400).json({ error: "Invalid product line" });
//     }

//     const unitPrice = unitPrices[productLine];
//     const subtotal = unitPrice * elevatorsRequired;
//     const installFee = calcService.calcInstallFee(subtotal, installPercentFees[productLine]);
//     const totalCost = subtotal + installFee;

//     // 2. Save to MongoDB using Quote schema
//     const newQuote = new Quote({
//       building_type,
//       numFloors,
//       numApts,
//       maxOccupancy,
//       numElevators: elevatorsRequired, // store calculated value
//       productLine,
//       unitPrice,
//       elevatorCost: subtotal,
//       installationFee: installFee,
//       totalCost,
//     });

//     await newQuote.save();

//     // 3. Respond to frontend
//     res.status(201).json({
//       message: "Quote calculated and saved",
//       unitPrice,
//       elevatorCost: subtotal,
//       installationFee: installFee,
//       totalCost,
//     });

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Failed to calculate quote" });
//   }
// };

module.exports = {contactUs,calculateQuote};