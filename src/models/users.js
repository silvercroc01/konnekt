const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String
  },
  emailID: {
    type: String,
    lowercase: true,
    required: true,
    unique: true,
    trim: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Invalid Email Address: " + value);
      }
    }
  },
  password: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    min: 18,
  },
  gender: {
    type: String,
    validate(value) {
      if (!["M", "F", "O"].includes(value)) {
        throw new Error(`Gender {${value}} Not Valid`)
      }
    },
  },
  photoUrl: {
    type: String,
    default: "https://www.seekpng.com/png/full/847-8474751_download-empty-profile.png",
    validate(value) {
      if (!validator.isURL(value)) {
        throw new Error("Photo Url in Not Valid: " + value);
      }
    }
  },
  about: {
    type: String,
    default: "This is default about of the user"
  },
  skills: {
    type: [String]
  },

}, {
  timestamps: true,
});

userSchema.methods.getJWT = async function() {
  const user = this;

  const token = await jwt.sign({ _id: this._id }, "$up$uckers", {
    expiresIn: "7d",
  });
  return token;
};

userSchema.methods.comparePassword = async function(passwordInput) {
  const user = this;
  const passwordHash = user.password;
  const isPasswordValid = await bcrypt.compare(passwordInput, passwordHash)
  return isPasswordValid;
};
const User = mongoose.model("User", userSchema);


module.exports = User;
