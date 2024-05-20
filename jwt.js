const { JsonWebTokenError } = require("jsonwebtoken");

const jwt = require('jsonwebtoken');

const jwtAuthMiddleware = (req,res,next)=>{
    const authorization = req.headers.authorization;

    if(!authorization){
        return res.status(401).json({error:'Token not found'})
    }
    const token = authorization.split(' ')[1];

    if(!token){
        return res.status(401).json({error:'Unauthorized'})
    }
    try{
        const verifiedToken = jwt.verify(token,process.env.JWT_SECRET_KEY);
        req.user = verifiedToken;
        next();
    }catch(err){
        console.log(err);
        res.status(401).json({error: 'Invalid token'});
    }
}

const generateToken = (userDataPayload) => {
    return jwt.sign(userDataPayload,process.env.JWT_SECRET_KEY);
}
module.exports = {jwtAuthMiddleware,generateToken};