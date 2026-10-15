import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import db from "./utils/db.js";

//import all routes
import userRoutes from "./routes/user.routes.js"


dotenv.config();
const app=express();
app.use(cors({
    origin:process.env.BASE_URL,
    credentials:true,
    methods:['GET','POST','DELETE'], //not case sensitive
    allowedHeaders:['Content-Type','Authorization']
}))
app.use(express.json()); //use to accept json data
app.use(express.urlencoded({extended:true}))

const port =process.env.PORT || 3000;


app.get("/",(req,res)=>{
    res.send("hello World");
})




db();


//user Routes
app.use("/api/v1/users",userRoutes);


app.listen(port,()=>{
    console.log(`Example app listening on port ${port}`)
})