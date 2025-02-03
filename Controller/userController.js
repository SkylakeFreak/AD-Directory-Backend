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

const referealentry=(req,res)=>{
    try{
        const safetystring=req.query.safetystring;

        console.log(safetystring);
        res.status(200).json({ message: "Authentication status updated successfully", data: updatedText });
    }
    catch(err){
        console.log(err);
        res.status(400)
    }

}

module.exports={createUser,referealentry};