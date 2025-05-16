const express=require('express')
const app=express();
require('dotenv').config();
const main=require('./config/db')
const cookieParser=require('cookie-parser');

app.use(express.json());
app.use(cookieParser());

main.then(async()=>{
    app.listen(process.env.PORT,()=>{
        console.log("Server listening at port number: "+process.env.PORT);
        
    })
})
.catch(err=>console.log("Error Occured"+err));

