const mongoose = require('mongoose');

const { Schema } = mongoose;
require('mongoose-type-email');
mongoose.SchemaTypes.Email.defaults.message = 'Email address is invalid';

const addressSchema = new Schema({
  fulladdress:{
      type : String
  },
  city:{
      type : String
  },
  state:{
      type : String
  }
});


const userSchema = new Schema({
    name: {
        type: String,
        required: true,
      },
      age: {
        type: Number
      },
      email: {
        type: mongoose.SchemaTypes.Email,
        required: true,
        unique: true
      },
      phoneNumber: {
        type: String,
        unique: [true, "Phone number is already in use."],
        minLength: [10, "no should have minimum 10 digits"],
        maxLength: [10, "no should have maximum 10 digits"],
        match: [/\d{10}/, "no should only have digits"],
        default: "",
      },
      address:[addressSchema],
      aadharCardNumber:{
        type : String,
        required : true,
        unique : true
      },
      password:{
        type: String,
        required: true
      },
      role: {
        type: String,
        enum:['voter','admin'],
        default : 'voter'
      },
      isVoted:{
        type : Boolean,
        default : false
      }
});

const user = mongoose.model('user', userSchema);
module.exports = user;