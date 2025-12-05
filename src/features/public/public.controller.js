const Data = require('../../shared/resources/data');
//Contact Us Schema Import
const Contact = require ('../../shared/db/mongodb/schemas/contact.Schema')
//NPM Validator Import
var validator = require ('validator');


//Contact Us Controller
const contactUs = async (req,res) => {

  const fullname = req.body.fullname; 

  try {

    // Create a new document using the Contact schema
    const newContact = new Contact ({
      fullname,
      email: req.body.email,
      phone: req.body.phone,
      company_name: req.body.company_name,
      project_name: req.body.project_name,
      department: req.body.department,
      message: req.body.message
    });

    // Save it to MongoDB
    await newContact.save();

    // Send a simple confirmation
    res.status(201).send({ message: `Message received from ${fullname}` });

  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Failed to submit contact form" });
  }
};
//watch video, FOR DEMO FOR ROAD MAP, AND PREDETERMINED, AND ADD THINGS FOR HEALTH
//
//WILL NEED TO REUSE, JAVASCRIPT FILES WILL BE USED AND LET'S SAY 
//RESIDENTIAL.JS FILE that will HOLD AGENTS FOR THE TABLE AND THE QUOTE.JS AND GAIN EACCESS TO THE HTML
//FOR QUOTE.JS I WILL NEED THE QUOTE FORM SUBMISSION...
//QUOTE FORM SUBMISSION WILL HAVE 
//CONTACT POST YOU'LL WANT TO IMPORT CONTACT FORM, SETTING IT UP FOR DOCUMENT.GETELEMENT.ID AND MAP ALL CONTACT FIELDS
//THEN FOR CONTACT, YOU'LL HAVE AN EVENET, SUCCESS MODEL

const calculateResidentialQuote = (req,res) => {
  // define constants
  const apts = +req.query.apts;
  const floors = +req.query.floors;
  const elevators = +req.query.elevators;
  const occupancies = +req.query.occupancies;
  const tier = req.query.tier.toLowerCase();
    // Define valid tiers

  // validate request object
  if(!Object.keys(Data.unitPrices).includes(tier)){
    res.status(400);
    res.send(`Error: invalid tier`);
    return;
  }
  
  if(isNaN(floors) || isNaN(apts)){
    res.status(400);
    res.send(`Error: apts and floors must be specified as numbers`);
    return;
  }

  if(!Number.isInteger(floors) || !Number.isInteger(apts)){
    res.status(400);
    res.send(`Error: apts and floors must be integers`);
    return;
  }

  if(floors < 1 || apts < 1){
    res.status(400);
    res.send(`apts and floors must be greater than zero`);
    return;
  }

  // business logic
  const numElevators = calcResidentialElev(floors,apts);
  const totalCost = calcInstallFee(numElevators,tier);

  // format response
  res.send({
    elevators_required:numElevators,
    cost: totalCost
  });
};

const calcResidentialElev = (numFloors, numApts) => {
  const elevatorsRequired = Math.ceil(numApts / numFloors / 6)*Math.ceil(numFloors / 20);
  return elevatorsRequired;
};

const calcCommercialElev = (numFloors, maxOccupancy) => {
  const elevatorsRequired = Math.ceil((maxOccupancy * numFloors) / 200)*Math.ceil(numFloors / 10);
  const freighElevatorsRequired = Math.ceil(numFloors / 10);
  return freighElevatorsRequired + elevatorsRequired;
};

const calcInstallFee = (numElvs, tier) => {
  const unitPrice = Data.unitPrices[tier];
  const installPercentFees = Data.installPercentFees[tier];
  const total = numElvs * unitPrice * installPercentFees;
  return total;
};

module.exports = {contactUs,calculateResidentialQuote};