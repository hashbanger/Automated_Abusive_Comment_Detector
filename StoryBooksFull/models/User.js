const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Shema
const UserSchema = new Schema({
  googleID: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  firstName: {
    type: String
  },
  lastName: {
    type: String
  },
  image: {
    type: String
  },
  warnings: {
    type: Number,
    default: 0
  },
  warned_for: [
    {
      warningFor: {
        type: Array
      },
      originalComment: {
        type: String
      }
    }
  ]
});

// Create collection and add schema
let User = mongoose.model('users', UserSchema);

module.exports = { User }