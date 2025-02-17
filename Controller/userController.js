    const User=require("../Model/userModel")
    
    const jwt = require('jsonwebtoken');

    const referealentry=async(req, res) => {
        const {safetystring,orgName,deviceid,isFingerprintauthenticated,adminname,socketiocode} = req.query; 
        console.log("check status of get",socketiocode,orgName);
    

        if (!safetystring) {
            return res.status(400).json({ error: "safetystring parameter is missing" });
        }
        console.log(safetystring,orgName,deviceid,isFingerprintauthenticated);    
        const temp="test"  
        const newUser=new User({orgName,adminname,safetystring,isFingerprintauthenticated});
        await newUser.save();
        await User.findOneAndUpdate(
            { 
                safetystring: safetystring, 
                orgName: orgName, 
                adminname: adminname, 
            }, 
            { 
                $set: { 
                    onetimeloginstring:socketiocode
                } 
            },
        );

        res.status(200).json({ message: "Received safetystring..", safetystring,orgName,deviceid,isFingerprintauthenticated,adminname });   
        
        
    }; 

    const frontendlogs = async (req, res) => {
        try {
            const {domainname1,tenantname,connectionstring} = req.body; // Assuming it's in request body
            console.log(domainname1,tenantname,connectionstring)
    
            // Find the user
            const findUser = await User.findOne({
                orgName: tenantname,
                adminname: domainname1,
                onetimeloginstring:connectionstring,
            });
    
            if (findUser) {
                return res.status(200).json({ message: "signedup in Sucessfully!"      });
            } else {
                return res.status(400).json({ message: "User not found or not signed up yet." });
            }
    
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: "Some error occurred" });
        }
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
            if (token){
                jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
                    if (err) {
                        return res.status(403).json({ error: "Invalid or expired token.",isauthenticated:false });
                    }
                    
        
                    return res.status(200).json({ message: "Already exists: " ,name:decoded.username,org:decoded.orgname,isauthenticated:true,ttl:decoded.iat,exp:decoded.exp });
                });
                

            }
            else{
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
                token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: '30m' })
    

                res.cookie("authToken", token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",  
                    sameSite: "None",  
                    maxAge: 30 * 60 * 1000,
                });
    
                return res.status(201).json({ message: "New token created" });
            }
    
            jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
                if (err) {
                    return res.status(403).json({ error: "Invalid or expired token." });
                }
    
                return res.status(200).json({ message: "User Authenticated: " ,name:decoded.username,org:decoded.orgname });
            });
        }
    
        } catch (error) {
            return res.status(500).json({ error: "Error in authentication logic" });
        }
    };
     


    module.exports={referealentry,verifyuser,frontendfetchlogic,frontendlogs};