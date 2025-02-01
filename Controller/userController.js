const User=require("../Model/userModel")

const createUser=async(req,res)=>{
    try{
        const {organizationname,adminusername,devicebiometricidentity}=req.body;
        const newUser=new User({organizationname,adminusername,devicebiometricidentity});
        await newUser.save();
        res.status(201).json(newuser);
    }
    catch(err){
        res.status(400).json({error:err.message});
    }
};

module.exports={createUser};