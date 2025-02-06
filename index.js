const express=require("express");
const dotenv=require('dotenv');
const cors=require('cors');
const connectDB = require("./Config/databaseconnection");
const bodyParser = require("body-parser")
dotenv.config();
connectDB();

const app=express();
console.log("server is running")

app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"],
  }));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/",require("./Routes/userRoutes"));
const PORT=5000;
app.listen(PORT,()=>console.log("Server is running over port 5000"));

