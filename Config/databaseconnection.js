const mongoose=require("mongoose");
require("dotenv").config(;


const conenctDB=async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URI,{
            useNewUrlParser:true,
            useUnifiedTopology:true,
        });
        console.log("MongoDB Conencted");

    }
    catch(err){
        console.error("Database Connection Failed",err);
        process.exit(1);
    }
};