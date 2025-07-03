const mongoose = require('mongoose')
const ATLAS_DB_URI = "mongodb://0.0.0.0:27017/konnekt"
const connectToDB = async () => {
  await mongoose.connect(ATLAS_DB_URI);
}


module.exports = connectToDB;
