const mongoose = require("mongoose");
require('dotenv').config();

mongoose.connect("mongodb://localhost:27017/votingApp", {
   useNewUrlParser: true,
   useUnifiedTopology: true
});

const db = mongoose.connection;

db.on('connected',()=>{
    console.log('Connected to MongoDB server');
})

db.on('error',(err)=>{
    console.log('Error connecting the server',err);
})

module.exports = db;