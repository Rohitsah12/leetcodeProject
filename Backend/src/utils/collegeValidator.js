const validator=require('validator')

//req.body=data
const collegeValidate=(data)=>{
    const mandatoryField=['collegeName','emailId','password'];

    console.log(data.collegeName);
    console.log(data.emailId);
    console.log(data.password);
    

    const IsAllowed=mandatoryField.every((k)=>Object.keys(data).includes(k));

    if(!IsAllowed){
        throw new Error("Some Field Missing");
    }
    if(!validator.isEmail(data.emailId))
        throw new Error("Invalid EMail");

    if(!validator.isStrongPassword(data.password))
        throw new Error("Week Password");
        
}
module.exports=collegeValidate;