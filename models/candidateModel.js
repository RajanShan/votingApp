const mongoose = require('mongoose');

const { Schema } = mongoose;
require('mongoose-type-email');
mongoose.SchemaTypes.Email.defaults.message = 'Email address is invalid';

const candidateSchema = new Schema({
    name: {
        type: String,
        required: true,
      },
      party : {
        type : String,
        required :true
      },
      age: {
        type: Number
      },
      votes : [{
        votedBywhom: {
            type : mongoose.Schema.ObjectId,
            ref : 'user',
            required : true
        },
        votedAt : {
            type : Date,
            default:Date.now()
        }
      }],
      voteCount : {
        type: Number,
        default : 0
      }
});

const candidate = mongoose.model('candidate', candidateSchema);
module.exports = candidate;