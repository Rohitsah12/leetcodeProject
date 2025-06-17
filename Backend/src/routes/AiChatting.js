const express=require('express');

const aiRouter=express.Router();

const userMiddleWare=require('../middleware/userMiddleWare')
aiRouter.post('/chat',userMiddleWare,solveDoubt);

module.exports=aiRouter;