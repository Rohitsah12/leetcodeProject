
const jwt=require('jsonwebtoken')
const redisClient=require('../config/redis');
const College = require('../models/college');

const collegeMiddleware= async (req,res,next)=>{
    try {
        const {token}= req.cookies;
        if(!token) throw new Error("Token is not present");

        const payload=jwt.verify(token,process.env.JWT_KEY);

        const {_id}=payload;

        if(!_id){
            throw new Error("Invalid Token");
            
        }
        const result=await College.findById(_id);

        console.log(result);
        

        if(!result){
            throw new Error("User Doesn't Exist");
        }
        //Redis k blocklist mein present toh nhi h

        const IsBlocked = await redisClient.exists(`token:${token}`);


        if(IsBlocked)
            throw new Error("Invalid token");

        req.result=result
            
        next();

    } catch (error) {
        res.status(401).send("Error: "+error)
    }
}

module.exports=collegeMiddleware;