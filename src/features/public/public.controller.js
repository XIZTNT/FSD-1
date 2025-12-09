const Data = require('../../shared/resources/data');
//Contact Us Schema Import
const Contact = require ('../../shared/db/mongodb/schemas/contact.Schema')
const Quote = require ('../../shared/db/mongodb/schemas/quote.Schema')

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

//NEW QUOTE CONTROLLER
const calculateQuote = (req, res) => {
  const {
    building_type,
    numFloors,
    numBasements,
    numApts,
    maxOccupancy,
    numElevators,
    tier // <-- renamed here
  } = req.query;

  let elevatorCount = 0;
  if (building_type === "residential") {
    elevatorCount = Math.ceil(numApts / numFloors / 6);
  } else if (building_type === "commercial") {
    elevatorCount = Math.ceil(maxOccupancy / 1000);
  } else if (building_type === "industrial") {
    elevatorCount = parseInt(numElevators);
  }

  let unitPrice = 0;
  let installRate = 0;

  switch (tier) { // <-- using tier instead of productLine
    case "standard":
      unitPrice = 7565;
      installRate = 0.10;
      break;
    case "premium":
      unitPrice = 12345;
      installRate = 0.13;
      break;
    case "excelium":
      unitPrice = 15400;
      installRate = 0.16;
      break;
    default:
      unitPrice = 7565;
      installRate = 0.10;
  }

  const elevatorCost = elevatorCount * unitPrice;
  const installationFee = elevatorCost * installRate;
  const totalCost = elevatorCost + installationFee;

  res.json({ elevatorCount, unitPrice, elevatorCost, installationFee, totalCost });
};





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