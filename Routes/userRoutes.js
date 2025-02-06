const express=require("express")

const {referealentry, verifyuser}=require("../Controller/userController");
const router=express.Router();
router.post("/userenrollment",referealentry);
router.post("/userverification",verifyuser);

module.exports=router;