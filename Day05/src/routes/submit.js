const express=require('express');
const userMiddleware = require('../middleware/userMiddleWare');

const submitRouter=express.Router();

submitRouter.post("/submit/:id"userMiddleware,)