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

        //If this emailId already or not
        const user = await User.create(req.body);
        //jwt token

        const token=jwt.sign({_id:user._id,emailId},process.env.JWT_KEY,{expiresIn:3600});

        res.cookie('token',token,{maxAge:60*60*1000})
        res.status(201).send("User Registered Successfully");
    } catch (error) {
        res.status(400).send("Error:"+err);
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
        const token=jwt.sign({_id:user._id,emailId},process.env.JWT_KEY,{expiresIn:3600});

        res.cookie('token',token,{maxAge:60*60*1000})
        res.status(200).send("Loged In Successfully");   
    } catch (error) {
        res.status(401).send("Error: ",error)
    }
}


const logout=async (req,res)=>{
    try {
        
    } catch (error) {
        
    }
}