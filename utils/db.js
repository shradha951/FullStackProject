import mongoose from "mongoose";
import dotenv from "dotenv"
dotenv.config();



const db=()=>{
    mongoose.connect(process.env.URL)
 .then(()=>{
    console.log("Connected to the mongodb")
 })
 .catch((err=>{
    console.log("Failed to connect to dataBase");
 }))
}

export default db
 