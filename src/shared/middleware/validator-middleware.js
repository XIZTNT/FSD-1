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

