import User from "../model/User.model.js"
import crypto from "crypto"
import nodemailer from "nodemailer";

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
        text:`please click on the following link:${process.env.BASEURL}/api/v1/users/verify/${token}`
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

export {
    registerUser,
    verifyUser
}