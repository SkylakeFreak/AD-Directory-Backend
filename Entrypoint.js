const express=require("express");
const conenctDB=require("./Config/databaseconnection");
const dotenv=require('dotenv');
const cors=require('cors');
const connectDB = require("./Config/databaseconnection");

dotenv.config();
connectDB();

const app=express();

app.use(cors());
app.use(express.json();

app.use("/api/users",require("./Routes/userRoutes"));
const port=process.env,P
