const express = require('express');
const app = express();
const db = require ("./db");
const userRoutes = require('./routes/userRoute');
const candidateRoutes = require('./routes/candidateRoute');
const {jwtAuthMiddleware,generateToken} = require('./jwt');
require('dotenv').config();

const bodyparser = require('body-parser')
app.use(bodyparser.json());


app.use('/users',userRoutes);
app.use('/candidate',candidateRoutes);

app.listen(3000, ()=>{
    console.log("Server is listening at 3000");
})