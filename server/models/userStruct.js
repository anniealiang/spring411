const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  uid: String,
  email: String,
  name: String
});

userSchema.set('toJSON', {
  transform: (doc, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model('user', userSchema);