const mongoose = require("mongoose");
require('dotenv').config();
const mongoDbOnlineDBHostURL = process.env.MongoDB_URL;
const mongoDbLocalURL = process.env.MongoDB_URL_Local;
mongoose.connect(mongoDbOnlineDBHostURL, {
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