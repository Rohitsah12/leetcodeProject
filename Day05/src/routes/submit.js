const express=require('express');
const userMiddleware = require('../middleware/userMiddleWare');
const submitCode = require('../controllers/userSubmission');

const submitRouter=express.Router();

submitRouter.post("/submit/:id",userMiddleware,submitCode)