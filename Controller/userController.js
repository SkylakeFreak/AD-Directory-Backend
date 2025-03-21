    const User=require("../Model/userModel")
    
    const jwt = require('jsonwebtoken');

    const referealentry=async(req, res) => {
        const {safetystring,orgName,deviceid,isFingerprintauthenticated,adminname,socketiocode,modeoflogin} = req.query; 
        console.log("here it is modeoflofin comment: ",modeoflogin);
    

        if (!safetystring) {
            return res.status(400).json({ error: "safetystring parameter is missing" });
        }
        console.log(safetystring,orgName,deviceid,isFingerprintauthenticated);    


        const finduser = await User.findOne({
            orgName:orgName,
            adminname:adminname
        })
        if (finduser){
            console.log("user already exists via android app");
            return res.status(400).json({ message: "User Already Exists"}); 

        }
        console.log("created new via android app")
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
                    onetimeloginstring:socketiocode,
                    category:modeoflogin
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
            const findUser1 = await User.findOne({
                orgName: tenantname,
                adminname: domainname1,
            });

            if (findUser) {
                return res.status(200).json({ message: "Logged IN Successfully"      });
            } 
            
            else {

                if (findUser1){
                    console.log("User exists but different conenction string that means User exists Already")
                    return res.status(400).json({ message: "User exists but different conenction string that means User exists Already" });

                }
                return res.status(400).json({ message: "Purely User Not Found" });
            }

    
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: "Some error occurred" });
        }
    };


    const verifyuserstatusredgreen=async(req,res)=>{
        let token = req.cookies.authToken;

        try {
            if (token){
                jwt.verify(token, process.env.SECRET_KEY, async (err, decoded) => {
                    if (err) {
                        return res.status(403).json({ error: "Invalid or expired token for the red green status."});
                    }
                    const findUser = await User.findOne({
                        orgName: decoded.orgname,
                        adminname: decoded.username,
                        currentsession: true,
                    });
                    if (findUser){
                        return res.status(200).json({message:true})
                    }
                    return res.status(400).json({ message: false});
                });
            }
        }
        catch(err){
            return res.status(403).json({error:"some error occured"})

        }


    }


    const cookieclear = (req, res) => {
        if (!req.cookies.authToken) {
            return res.status(400).json({ message: "No cookie found" });
        }
    
        res.cookie("authToken", "", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "None",
            expires: new Date(0), 
        });
        res.status(200).json({ message: true });
    };


    const logouttheuserandroid=async(req, res) => {
        const {safetystring,orgName,deviceid,isFingerprintauthenticated,adminname,socketiocode} = req.query; 
        
        if (!safetystring) {
            console.log("Safety string is missing logout")
            return res.status(400).json({ error: "safetystring parameter is missing" });
        }
        console.log(safetystring,orgName,adminname);  
        try {
            const updatedUser = await User.findOneAndUpdate(
                { 
                    safetystring: safetystring, 
                    orgName: orgName, 
                    adminname: adminname, 
                }, 
                { 
                    $set: { 
                        currentsession: false, 
                    } 
                },
                { new: true } // Return the updated document
            );
            
    
            if (!updatedUser) {
                return res.status(404).json({ error: "User not found or logout failed" });
            }

            res.status(200).json({ message: "Logout the User Successfuly" });
        } catch (error) {
            res.status(500).json({ error: "Error while logging out the user" });
        }

        

        res.status(200).json({ message: "Received safetystring..", safetystring,orgName,deviceid,isFingerprintauthenticated,adminname });
        
        
    };  









    
    
    const verifyuser=async(req, res) => {
        const {safetystring,orgName,deviceid,isFingerprintauthenticated,adminname,socketiocode,modeoflogin} = req.query; 
        
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
                    category:modeoflogin
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
        const { orgname, username,connectionstring,modeoflogin } = req.body;
        console.log("Its frontend fetch logic")
    
        try {
            if (token){
                jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
                    console.log(decoded.modeoflogin)
                    if (err) {
                        return res.status(403).json({ error: "Invalid or expired token.",isauthenticated:false });
                    }
                    
        
                    return res.status(200).json({ message: "Already exists: " ,name:decoded.username,org:decoded.orgname,isauthenticated:true,ttl:decoded.iat,exp:decoded.exp,modeoflogin:decoded.modeoflogin });
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
                const payload = { username: username, orgname:orgname,socketiocode:connectionstring,modeoflogin:findUser.category};//change here code optimizable
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
                    return res.status(403).json({ error: "Invalid or expired token."});
                }
    
                return res.status(200).json({ message: "User Authenticated: " ,name:decoded.username,org:decoded.orgname,modeoflogin:decoded.modeoflogin });
            });
        }
    
        } catch (error) {
            return res.status(500).json({ error: "Error in authentication logic" });
        }
    };





    const lowleveluserenrollments=async(req, res) => {
        const {nameofemployee,personalemailid,phonenumber,gender,designation,
            date,orgName,safetystring,adminname,category,usertier,selectedDepartment,selectedRole } = req.body; 


        const finduser = await User.findOne({
            orgName:orgName,
            adminname:adminname,
            nameofemployee:nameofemployee
        })
        if (finduser){
            console.log("user already exists");
            return res.status(400).json({ message: "User Already Exists"}); 

        }
        console.log("created new user")
        const newUser=new User({nameofemployee,phonenumber,personalemailid,gender,designation,category,date,orgName,adminname,usertier,selectedDepartment,selectedRole});
        await newUser.save();
        res.status(200).json({ message: "Low Level Data Saved Successfully" });   
        
        
    }; 
     


    module.exports={referealentry,verifyuser,frontendfetchlogic,frontendlogs,logouttheuserandroid,cookieclear,verifyuserstatusredgreen,lowleveluserenrollments};