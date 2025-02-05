const User=require("../Model/userModel")

const createUser=async(req,res)=>{
    try{
        const {organizationname,adminusername,devicebiometricidentity}=req.body;
        const newUser=new User({organizationname,adminusername,devicebiometricidentity});
        await newUser.save();
        res.status(201).json(newUser);
    }
    catch(err){
        res.status(400).json({error:err.message});
    }
};

const referealentry=(req, res) => {
    const {safetystring,orgName,deviceid,isFingerprintAuthenticated} = req.query; // Capture query parameter

    if (!safetystring) {
        return res.status(400).json({ error: "safetystring parameter is missing" });
    }

    res.status(200).json({ message: "Received safetystring", safetystring,orgName,deviceid,isFingerprintAuthenticated });
};




module.exports={createUser,referealentry};