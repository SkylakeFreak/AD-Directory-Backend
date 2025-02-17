const express=require("express");
const User=require("./Model/userModel")
const dotenv=require('dotenv');
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const cors=require('cors');
const connectDB = require("./Config/databaseconnection");
const bodyParser = require("body-parser")
dotenv.config();
connectDB();

const app=express();
app.use(cookieParser());
console.log("server is running")


const allowedOrigins = ["http://localhost:3000", "https://apiad.vercel.app"];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};





app.use(cors(corsOptions));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/api/cron", async (req, res) => {
  console.log('cron called')
  const currentTime = new Date();

  // Find users whose session has expired and update their 'currentsession' to false
  await User.updateMany(
      { sessionExpiresAt: { $lte: currentTime }, currentsession: true },
      { $set: { currentsession: false } }
  );

  console.log("Checked and updated expired sessions.");
  return res.status(200).json({ message: "Expired sessions updated." });
});

app.use("/",require("./Routes/userRoutes"));
const PORT=5000;
app.listen(PORT,()=>console.log("Server is running over port 5000"));

