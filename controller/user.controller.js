import User from "../model/User.model.js"
import crypto from "crypto"
import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"

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


    // send token as email to the user

    const transporter =nodemailer.createTransport({
        host:process.env.MAILTRAP_HOST,
        port:process.env.MAILTRAP_PORT,
        secure:false,
        auth:{
            user:process.env.MAILTRAP_USER,
            pass:process.env.MAILTRAP_PASSWORD,
        },
    })


    const mailOptions={
        from:process.env.MAILTRAP_SENDEREMAIL,
        to:user.email,
        subject:"Verify you email",
        text:`please click on the following link:${process.env.BASE_URL}/api/v1/users/verify/${token}`
    }


    const info = await transporter.sendMail(mailOptions)


      // send success status to the user

      res.status(201).json({
        message:"User registered successfully",
        success:true,
      })


    } catch (error) {

        res.status(400).json({
            message:"User not registered",
            error,
            success:false

        })
        
    }
 // res.send('registered!');
};


const verifyUser =async (req,res)=>{
    //get token from the url
    const {token}=req.params
    //validate
    console.log(token);
    if(!token){
        return res.status(400).json({
            message:"Invalid token"
        })
    }
    // find user based on token
   const user = await User.findOne({
        verificationToken:token
    })
    //if not 
    if(!user){
        return res.status(404).json({
            message:"Invalid token"
        })
    }
    // isVerified token to true
    user.isVerified=true;
    // remove the verification token
    user.verificationToken=undefined;
    //save 
    await user.save();
    //return response

    return res.status(200).json({
        message:"User successfully verified"
    })
}


const login=async (req,res)=>{

     //get the data
    const {email,password}=req.body || {};

    if(!email||!password){
        return res.status(400).json({
            message:"All fileds are required"
        })
    }
    try {
        // check if the user exist
       const user= await User.findOne({
            email
        })
        //if no user exist
        if(!user){
            return res.status(400).json({
                message:"No User found with the email"
            })
        }
    // hash the password to compare & check the password maches to password in database
   const isMatch= await bcrypt.compare(password,user.password);
   
    console.log(isMatch)

    if(!isMatch){
        return res.status(400).json({
            message:"Invalid email or password"
        })
    }

    if(!user.isVerified){
        return res.status(400).json({
            message:"User email not verified"
        })
    }
    

    //generate a jwt session token
   const token= jwt.sign({
        id:user._id,
        role:user.role,
    },
    process.env.TOKEN_SECRET,
    {
        expiresIn:'24h'
    }
)


 //send the token to client as cookies
const cookieOptions={
    httpOnly:true,
    secure:true,
    maxAge:24*60*60*1000,
}
   res.cookie("sessionToken",token,cookieOptions)
   res.status(200).json({
    message:"Login successful",
    success:true,
    token,
    user:{
        id:user._id,
        name:user.name,
        role:user.role
    }
   })
   

    
        
    } catch (error) {
        return res.status(400).json({
            message:"Login not successfull",
            error,
            success:false
        })
    }
    

}




const getMe=async (req,res)=>{
    try {
        return res.status(200).json({
            message:"you found me"
        })
    } catch (error) {
        
    }
}


const logoutUser=async (req,res)=>{
    try {
        
    } catch (error) {
        
    }
}


const forgotPassword=async (req,res)=>{
    try {
        
    } catch (error) {
        
    }
}


const resetPassword=async (req,res)=>{
    try {
        
    } catch (error) {
        
    }
}



export {
    registerUser,
    verifyUser,
    login,
    getMe,
    logoutUser,
    forgotPassword,
    resetPassword
}