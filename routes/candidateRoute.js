const express = require('express');
const router = express.Router();
const User = require('../models/userModel');
const candidate = require('../models/candidateModel');
const { jwtAuthMiddleware, generateToken } = require('../jwt');

const isAdmin = async (userId) => {
    try {
        let user = await User.findById(userId);
        return user.role === "admin";
    } catch (err) {
        console.log('user is not an admin')
        return false;
    }
}
//create a candidate
router.post('/', jwtAuthMiddleware, async (req, res) => {
    try {
        if (await isAdmin(req.user.id)) {
            let data = req.body
            let newCandidate = new candidate(data);
            let response = await newCandidate.save();
            console.log('data saved');
            res.status(200).json({ response: response });
        } else {
            console.log('Unauthorized user or user is not an admin');
            res.status(401).json({ err: 'Your are not an admin' });
        }
    } catch (err) {
        console.log('error while updating the database', err);
        res.status(500).json({ err: 'Internal server error' });
    }
})

router.put('/:candidateId', jwtAuthMiddleware, async (req, res) => {
    try {
        if (await isAdmin(req.user.id)) {
            let candidateId = req.params.candidateId;
            let dataToBeUpdated = req.body;

            let response = await candidate.findByIdAndUpdate(candidateId, dataToBeUpdated);
            //if candidate in not present in the DB/id is wrong
            if (!response) {
                res.status(403).json({ error: 'Candidate not found' });
            }

            console.log('candidate data updated');
            res.status(200).json(response);
        } else {
            console.log('Unauthorized user or user is not an admin');
            res.status(401).json({ err: 'Your are not an admin' });
        }
    } catch (err) {
        console.log('error while updating the database', err);
        res.status(500).json({ err: 'Internal server error' });
    }
});

router.delete('/:candidateId',jwtAuthMiddleware, async (req, res) => {
    try {
        let candidateId = req.params.candidateId;
        if (await isAdmin(req.user.id)) {
            let candidateId = req.params.candidateId;
            let response = await candidate.findByIdAndDelete(candidateId)

            if (!response) {
                res.status(403).json({ error: 'Candidate not found' });
            }
            console.log('candidate deleted successfully');
            res.status(200).json('Candidate deleted');
        } else {
            console.log('Unauthorized user or user is not an admin');
            res.status(401).json({ err: 'Your are not an admin' });
        }
    } catch (err) {
        console.log('error while updating the database', err);
        res.status(500).json({ err: 'Internal server error' });
    }
})


router.post('/vote/:candidateID', jwtAuthMiddleware, async(req,res)=>{
    let userId = req.user.id;
    let candidateId = req.params.candidateID;
    try{
        let Candidate = await candidate.findById(candidateId);
        //wrong candidateid or candidate not found in the DB
        if(!Candidate){
            res.status(404).json({ message: 'Candidate not found' });
        }
        let user = await User.findById(userId);
        //wrong userid or user not found in the DB
        console.log(user+"----------------------------------------------------------");
        if(!user){
            res.status(404).json({ message: 'user not found' });
        }
        //user has already voted
        console.log(user.isVoted+"----------------------------------------------------------");
        if(user.isVoted){
            res.status(404).json({ message: 'you have already voted' });
            return;
        }
        
        //Admin cannot vote
        console.log(user.role+"----------------------------------------------------------");
        if(user.role==='admin'){
            res.status(403).json({ message: 'Admin cannot vote' });
            return;
        }
        
        Candidate.votes.push({votedBywhom:userId});
        Candidate.voteCount++;
        await Candidate.save()
    
        user.isVoted=true;
        await user.save();
    
        res.status(200).json({message:'Thankyou for Voting'});
    }catch(err){
        console.log('error while updating the database', err);
        res.status(500).json({err:'Internal server error'});
    }
})

router.get('/vote/count',async(req,res)=>{
    try{
        let Candidate = await candidate.find();
        let partyData = [];
        for(let i=0;i<Candidate.length;i++){
            partyData[i] = {
                party :  Candidate[i].party,
                count : Candidate[i].voteCount
            };

        }
        partyData=partyData.sort((c1, c2) => 
        (c1.count < c2.count) ? 1 : (c1.count > c2.count) ? -1 : 0);
        res.status(200).json(partyData);
    }catch(err){
        console.log('error while updating the database', err);
        res.status(500).json({err:'Internal server error'});
    }
})

router.get('/listOfCandidates', async(req,res)=>{
    try{
        let candidates = await candidate.find();
        let listOfCandidates =[];
        for(var i = 0;i<candidates.length;i++){
            listOfCandidates[i]=candidates[i].name;
        }
        res.status(200).json({message:'List of Electors is as follow',response:listOfCandidates});
    }catch(err){
        console.log('error while updating the database', err);
        res.status(500).json({err:'Internal server error'});
    }
})

module.exports = router;