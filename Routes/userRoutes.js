const express=require("express")

const {referealentry, verifyuser,frontendfetchlogic,frontendlogs}=require("../Controller/userController");
const router=express.Router();
router.post("/userenrollment",referealentry);
router.post("/userverification",verifyuser);
router.post("/frontendfetch",frontendfetchlogic);
router.post("/frontendstatus",frontendlogs)


module.exports=router;