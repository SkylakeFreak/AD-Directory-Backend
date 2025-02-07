const express=require("express")

const {referealentry, verifyuser,frontendfetchlogic}=require("../Controller/userController");
const router=express.Router();
router.post("/userenrollment",referealentry);
router.post("/userverification",verifyuser);
router.post("/frontendfetch",frontendfetchlogic)


module.exports=router;