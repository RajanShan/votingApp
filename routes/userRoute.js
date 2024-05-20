const express = require('express');
const router = express.Router();
const user = require('../models/userModel');
const {jwtAuthMiddleware,generateToken} = require('../jwt');

router.post('/signUp',async (req,res)=>{
    try{
        let data = req.body;
        let newUser = new user(data);
        let response = await newUser.save();
        console.log('Data inserted in the DB');

        const payload={
            id:response.id
        };

        const token = generateToken(payload);
        console.log('Token is: ', token);
        res.status(200).json({response:response,token:token});      
    }catch(err){
        console.log('error while updating the database', err);
        res.status(500).json({err:'Internal server error'});
    }
})

router.post('/login',async (req,res)=>{
    try{
        let {aadharCardNumber, password} = req.body;
        let foundUserInDB = await user.findOne({aadharCardNumber:aadharCardNumber});
        if(!foundUserInDB){
            return res.status(401).json('Invalid username')
        }
        console.log(foundUserInDB);
        if(foundUserInDB.password!==password){
           return res.status(401).json('Invalid password')
        }
        const payload={
            id:foundUserInDB.id
        }

        let token = generateToken(payload);
        res.json(token)       
    }catch(err){
        console.log('error while updating the database', err);
        res.status(500).json({err:'Internal server error'});
    }
})

router.get('/profile',jwtAuthMiddleware, async (req,res)=>{
    try{
        let id = req.user.id;
        let foundUserDataInDB = await user.findById(id);

        res.status(400).json(foundUserDataInDB);
    }catch(err){
        console.log('error while updating the database', err);
        res.status(500).json({err:'Internal server error'});
    }
})

router.get('/profile/updatePassword', async(req,res)=>{
  try{
    let id = req.user.id;
    let {currPassword,newPassword} = req.body;
    
    let foundUserDataInDB = await user.findById(id);
    if(foundUserDataInDB.password!==currPassword){
        return res.status(401).json('Wrong password');
    }

    foundUserDataInDB.password = newPassword;
    await user.save(foundUserDataInDB);
    
    console.log('Password Updated');
    res.status(400).json('Password Updated');

  }catch(err){
    console.log('error while updating the database', err);
    res.status(500).json({err:'Internal server error'});
  } 
})


//comment addded for testing purpose
module.exports=router;