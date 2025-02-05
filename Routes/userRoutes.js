const express=require("express")

const {createUser,referealentry}=require("../Controller/userController");
const router=express.Router();

router.post("/createUser",createUser);
router.post("/userenrollment",referealentry);

module.exports=router;