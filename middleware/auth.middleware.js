import jwt from "jsonwebtoken"


export const isLoggedIn=async (req,res,next)=>{
  
    try {
          //get the token
          console.log(req.cookies);
          let token=req.cookies?.sessionToken || ""
          console.log("Token Found",token ? "YES":"NO")
          //if no token
          if(!token){
            console.log("No token");
            return res.status(401).json({
                success:false,
                message:"Authentication failed"
            })
          }

          const decoded= jwt.verify(token,process.env.TOKEN_SECRET)

          console.log("decoded data: ",decoded);

          req.user=decoded;

          next();
    } catch (error) {
        console.log("Auth middleware failure")
        return res.status(500).json({
            success:false,
            message:"Internal server error"
        })
        
    }

    //next();
}