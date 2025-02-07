    const User=require("../Model/userModel")

    const referealentry=async(req, res) => {
        const {safetystring,orgName,deviceid,isFingerprintauthenticated,adminname,socketiocode} = req.query; // Capture query parameter

        if (!safetystring) {
            return res.status(400).json({ error: "safetystring parameter is missing" });
        }
        console.log(safetystring,orgName,deviceid,isFingerprintauthenticated);      
        const newUser=new User({orgName,adminname,safetystring,isFingerprintauthenticated});
        await newUser.save();

        res.status(200).json({ message: "Received safetystring..", safetystring,orgName,deviceid,isFingerprintauthenticated,adminname,socketiocode });
        
        
    };  

    
    const verifyuser=async(req, res) => {
        const {safetystring,orgName,deviceid,isFingerprintauthenticated,adminname,socketiocode} = req.query; // Capture query parameter

        if (!safetystring) {
            return res.status(400).json({ error: "safetystring parameter is missing" });
        }
        console.log(safetystring,orgName,deviceid,isFingerprintauthenticated);  
        try {
            const updatedUser = await User.findOneAndUpdate(
                { 
                    safetystring: safetystring, 
                    orgName: orgName, 
                    adminname: adminname, 
                    isFingerprintauthenticated: isFingerprintauthenticated 
                }, 
                { 
                    $set: { currentsession: true } // Update the 'currentsession' field to true
                },
                { new: true } // Return the updated document
            );
    
            if (!updatedUser) {
                return res.status(404).json({ error: "User not found or update failed" });
            }

            res.status(200).json({ message: socketiocode });
        } catch (error) {
            console.error("Error updating session:", error);
            res.status(500).json({ error: "Error updating user session" });
        }

        

        res.status(200).json({ message: "Received safetystring..", safetystring,orgName,deviceid,isFingerprintauthenticated,adminname });
        
        
    };  

    const frontendfetchlogic=async(req, res) => {
        const {orgname,username} = req.body;
    
        try {
            const findUser = await User.findOne(
                { 
                    orgName: orgname, 
                    adminname: username, 
                    currentsession:true
                }, 
            );
    
            if (!findUser) {
                return res.status(404).json({ error: "User not Authenticated or Authorized" });
            }

            res.status(200).json({ message: "User Authenticated" });
        } catch (error) {
            res.status(500).json({ error: "Error logic" });
        }
    };  


    module.exports={referealentry,verifyuser,frontendfetchlogic};