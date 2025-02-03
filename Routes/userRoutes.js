const express=require("express")

const {createUser,referealentry}=require("../Controller/userController");
const router=express.Router();

router.post("/createUser",createUser);
router.get("/sendsafetystring",referealentry);

module.exports=router;