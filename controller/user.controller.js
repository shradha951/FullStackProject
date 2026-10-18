import User from "../model/User.model.js"
import crypto from "crypto"

const registerUser= async (req,res)=>{

    //get Data
    const {name,email,password} =req.body || {};

    //validate 

    if(!name || !email || !password){
        return res.status(400).json({
            message:"All fields are required"
        })
    }

    console.log(name+"\n"+email+"\n"+password)

    //check if the user already exist
    try {
        const existingUser= await User.findOne({email});
        if(existingUser){
            return res.status(400).json({
                message:"User already exist"
            })
   }

   // create the user in the database
    const user= await User.create({
    name,
    email,
    password
   })

   // check if user get created succesfully
   if(!user){
    return res.status(400).json({
        message:"User not registered !"
    })
   }
   console.log(user)

    // create a verification token
    const token=crypto.randomBytes(32).toString("hex");
    //save the token in the database
    user.verificationToken=token;
    await user.save()
    




    } catch (error) {
        
    }
   

   



    

   

    

    // send token as email to the user

    // send success status to the user


   // res.send('registered!');
};


export {
    registerUser
}