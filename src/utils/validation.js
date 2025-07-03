const validator = require('validator')
const validateSignupData = (req) => {

  if (!req.body) throw new Error("Missing request data");
  const { firstName, lastName, emailID, password } = req.body;

  if (!firstName || !lastName) {
    throw new Error("Both First Name and Last Name Required");
  }
  else if (!validator.isEmail(emailID)) {
    throw new Error("Invalid Email Address");
  }
};

const validateProfileEditData = (req) => {
  if (!req.body) throw new Error("Missing Update Data");
  const allowedEditFields = [
    "firstName",
    "lastName",
    "age",
    "gender",
    "photoUrl",
    "about",
    "skills",
  ];

  const isEditAllowed = Object.keys(req.body).every((field) =>
    allowedEditFields.includes(field)
  );
  return isEditAllowed;
};

const validateUpdatePassword = (req) => {
  if (!req.body) throw new Error("No Password Provided");

  const allowedField = ["oldPassword", "newPassword"];

  const isUpdateAllowed = Object.keys(req.body).every((field) =>
    allowedField.includes(field)
  );
  return isUpdateAllowed;

}
module.exports = { validateSignupData, validateProfileEditData, validateUpdatePassword };
