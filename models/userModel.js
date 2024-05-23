const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const { Schema } = mongoose;
require('mongoose-type-email');
mongoose.SchemaTypes.Email.defaults.message = 'Email address is invalid';

const addressSchema = new Schema({
  fulladdress: {
    type: String
  },
  city: {
    type: String
  },
  state: {
    type: String
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
  address: [addressSchema],
  aadharCardNumber: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['voter', 'admin'],
    default: 'voter'
  },
  isVoted: {
    type: Boolean,
    default: false
  }
});

userSchema.pre('save', async function (next) {
  const user = this;
  // Check if the password has been modified, if not, skip hashing
  if (!user.isModified('password')) {
    return next();
  }
  try {
    // Generate a salt with a complexity factor of 10
    const salt = await bcrypt.genSalt(saltRounds);

    // Hash the password with the generated salt
    const hashedPassword = await bcrypt.hash(user.password, salt);

    // Replace the plain text password with the hashed password
    user.password = hashedPassword;
    next();
  } catch (error) {
    // Pass any error to the next middleware
    return next(error);
  }
});

userSchema.methods.comparePassword = async function(candidatePassword){
  try {
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    return isMatch;
  } catch (err) {
    throw err;
  }
}
const user = mongoose.model('user', userSchema);
module.exports = user;