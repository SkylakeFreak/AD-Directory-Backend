const express=require("express")

const {referealentry, verifyuser,frontendfetchlogic,frontendlogs,logouttheuserandroid,cookieclear,verifyuserstatusredgreen,lowleveluserenrollments}=require("../Controller/userController");
const router=express.Router();
router.post("/userenrollment",referealentry);
router.post("/userverification",verifyuser);
router.post("/frontendfetch",frontendfetchlogic);   
router.post("/frontendstatus",frontendlogs);
router.post("/logoutprocessandroid",logouttheuserandroid);
router.post("/clearthecookie",cookieclear);
router.post("/verifyuserstatusredgreen",verifyuserstatusredgreen);
router.post("/lowleveluserenrollments",lowleveluserenrollments);


module.exports=router;