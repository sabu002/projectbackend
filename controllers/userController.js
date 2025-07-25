

//register user:api/user/register

import User from "../models/User.js"
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'


export const register =async(req,res)=>{
    try{
        const {name,email,password,role}=req.body
   if(!name || !email || !password){
    return res.json({success:false,message:"Missing details"})
   }
   const existingUser = await User.findOne({email})
   if(existingUser)
     return res.json({success:false,message:"User already exist"})
    const hashedPassword = await bcrypt.hash(password,10)
    const user = await User.create({name,email,password:hashedPassword})
    const token = jwt.sign({id:user._id,role:user.role}, process.env.JWT_SECRET,{expiresIn:'7d'})
    res.cookie('token',token,{
        httpOnly:true, //prevent javascript to access cookie
         secure:process.env.NODE_ENV==="production",//use secure cookies in production
         sameSite : process.env.NODE_ENV ===" production"?"none":"strict", 
         maxAge:7*24*60*60*1000, //cookies expiration time
    }) 
    return  res.json({success:true,user:{email:user.email ,name:user.name,role:user.role}})
    }catch(error){
        console.log(error.message)
        res.json({success:false,message:error.message})
    }
}
//login user:api/user/login
export const login =async(req,res)=>{
    try{
        const{email,password}=req.body
        if(!email || !password)
            return res.json({success:false,message:"Email and password required"});
        const user = await User.findOne({email});
        if(!user){
             return res.json({success:false,message:"Invalid email or password"});
        }
        const isMatch = await bcrypt.compare(password,user.password)
        if(!isMatch)
             return res.json({success:false,message:"Invalid email or password"});
             const token = jwt.sign({id:user._id}, process.env.JWT_SECRET,{expiresIn:'7d'})
    res.cookie('token',token,{
        httpOnly:true, 
         secure:process.env.NODE_ENV==="production",
         sameSite : process.env.NODE_ENV ===" production"?"none":"strict", 
         maxAge:7*24*60*60*1000, 
    }) 
    return  res.json({success:true,user:{email:user.email ,name:user.name}})

        }catch (error){
          console.log(error.message)
        res.json({success:false,message:error.message})
        }
}

//check auth: /api/user/is-auth
export const isAuth=async(req,res)=>{
    try{
  const {userId }=req
  const user = await User.findById(userId).select("-password")
  return res.json({success:true,user})
    }catch(error){
    console.log(error.message)
        res.json({success:false,message:error.message})
    }
}

//logout  user: /api/user/logout
export const logout=async(req,res)=>{
    try{
        res.clearCookie('token',{
              httpOnly:true, 
         secure:process.env.NODE_ENV==="production",
         sameSite : process.env.NODE_ENV === "production"?"none":"strict",    
        })
        return res.json({success:true,message:"Logged Out"})
 
    }catch(error){
    console.log(error.message)
        res.json({success:false,message:error.message})
    }
}
export const generateOTP = async (req, res) => {    
    
    try {
        const { email } = req.body;
        if (!email) {
            return res.json({ success: false, message: "Email is required" });
        }
        const user = await User.findOne({ email });
        if (!user) {        
            return res.json({ success: false, message: "User not found" });
        }
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.otp = otp;
        user.otpExpires = Date.now() + 10 * 60 * 1000; // OTP valid for 10 minutes
        await user.save();
        // Here you would send the OTP to the user's email
        console.log(`OTP for ${email}: ${otp}`);    
        return res.json({ success: true, message: "OTP generated and sent to email" });
    } catch (error) {   
        console.log(error.message);
        return res.json({ success: false, message: error.message });
        }
        
}