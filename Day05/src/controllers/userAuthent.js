const redisClient = require('../config/redis');
const Submission = require('../models/submission');
const User=require('../models/user');
const validate=require('../utils/validator')
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken')


const register=async (req,res)=>{
    try {
        //validate the data;
        validate(req.body);
        const {firstName,emailId,password}=req.body;
        req.body.password=await bcrypt.hash(password,10);
        req.body.role='user'

        //If this emailId already or not
        const user = await User.create(req.body);
        //jwt token

        const token=jwt.sign({_id:user._id,emailId:emailId,role:'user'},process.env.JWT_KEY,{expiresIn:3600});

        res.cookie('token',token,{maxAge:60*60*1000})
        res.status(201).send("User Registered Successfully");
    } catch (error) {
        res.status(400).send("Error:"+error);
    }
}


const login=async (req,res)=>{
    try {
        const {emailId,password}=req.body;

        if(!emailId)
            throw new Error("Invalid Credentials");

        if(!password)
            throw new Error("Invalid Credentials");

        const user=await User.findOne({emailId});

        const match=bcrypt.compare(password,user.password);

        if(!match)
            throw new Error("Ivalid Credentials");
        const token=jwt.sign({_id:user._id,emailId:emailId,role:user.role},process.env.JWT_KEY,{expiresIn:3600});

        res.cookie('token',token,{maxAge:60*60*1000})
        res.status(200).send("Loged In Successfully");   
    } catch (error) {
        res.status(401).send("Error: ",error)
    }
}


const logout=async (req,res)=>{
    try {
        
        //valdidate the token
        //Token ko add krr dunga Redis k blockList
        // Cookies ko clear krr dena......

        const {token}=req.cookies;

        const payload=jwt.decode(token);

        await redisClient.set(`token:${token}`,'Blocked');
        await redisClient.expireAt(`token:${token}`, payload.exp);


        res.cookie("token",null,{expires:new Date(Date.now())});
        res.send(":Logged out Successfully");

    } catch (error) {
        res.status(503).send("Error"+error);
    }
}

const adminRegister=async (req,res)=>{
    try {
        //validate the data;

        // if(req.result.role!='admin')
        //     throw new Error("Invalid Credentials");
            
        validate(req.body);
        const {firstName,emailId,password}=req.body;
        req.body.password=await bcrypt.hash(password,10);
        // req.body.role='admin'

        //If this emailId already or not
        const user = await User.create(req.body);
        //jwt token

        const token=jwt.sign({_id:user._id,emailId:emailId,role:user.role},process.env.JWT_KEY,{expiresIn:3600});

        res.cookie('token',token,{maxAge:60*60*1000})
        res.status(201).send("User Registered Successfully");
    } catch (error) {
        res.status(400).send("Error:"+error);
    }
}


const deleteProfile=async (req,res)=>{
    try {
        const userId=req.result._id;
        await User.findByIdAndDelete(userId);

        await Submission.deleteMany({userId});

        res.status(200).send("Deleted Successfully")
    } catch (error) {
    res.status(200).send("Deleted Successfully");
    }
}
module.exports={register,login,logout,adminRegister,deleteProfile}