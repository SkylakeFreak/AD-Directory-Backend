const mongoose=require("mongoose");
const organizationSchema=new mongoose.Schema({
    organizationname:{type:String,required:true},
    adminusername:{type:String,require:true,unique:true},
    devicebiometricidentity:{type:String,require:true},


})

module.exports=mongoose.model("User",organizationSchema);