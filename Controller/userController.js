    const User=require("../Model/userModel")
    const SECRET_KEY = "234H2345**@#922231211@FEBF"
    const jwt = require('jsonwebtoken');

    const referealentry=async(req, res) => {
        const {safetystring,orgName,deviceid,isFingerprintauthenticated,adminname} = req.query; 
    

        if (!safetystring) {
            return res.status(400).json({ error: "safetystring parameter is missing" });
        }
        console.log(safetystring,orgName,deviceid,isFingerprintauthenticated);      
        const newUser=new User({orgName,adminname,safetystring,isFingerprintauthenticated});
        await newUser.save();

        res.status(200).json({ message: "Received safetystring..", safetystring,orgName,deviceid,isFingerprintauthenticated,adminname });   
        
        
    };  

    
    const verifyuser=async(req, res) => {
        const {safetystring,orgName,deviceid,isFingerprintauthenticated,adminname,socketiocode} = req.query; 
        
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
                    isFingerprintauthenticated: isFingerprintauthenticated,
                }, 
                { 
                    $set: { 
                        currentsession: true, 
                        sessionExpiresAt: new Date(Date.now() + 60 * 1000),
                        socketiocode:socketiocode // Extend session for 1 minute
                    } 
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

    const frontendfetchlogic = async (req, res) => {
        let token = req.cookies.authToken;
        const { orgname, username,connectionstring } = req.body;
        console.log("Its frontend fetch logic",connectionstring)
    
        try {
            const findUser = await User.findOne({
                orgName: orgname,
                adminname: username,
                currentsession: true,
                socketiocode:connectionstring,
            });
    
            if (!findUser) {
                return res.status(403).json({ error: "User not Authenticated or Authorized" });
            }
    
            if (!token) {
                const payload = { username: username, orgname:orgname,socketiocode:connectionstring };
                token = jwt.sign(payload, SECRET_KEY, { expiresIn: '2m' });
    

                res.cookie("authToken", token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",  
                    sameSite: "None",  
                    maxAge: 2 * 60 * 1000,
                });
    
                return res.status(201).json({ message: "New token created" });
            }
    
            jwt.verify(token, SECRET_KEY, (err, decoded) => {
                if (err) {
                    return res.status(403).json({ error: "Invalid or expired token." });
                }
    
                return res.status(200).json({ message: "User Authenticated: " + decoded.username+decoded.orgname });
            });
    
        } catch (error) {
            return res.status(500).json({ error: "Error in authentication logic" });
        }
    };
     


    module.exports={referealentry,verifyuser,frontendfetchlogic};