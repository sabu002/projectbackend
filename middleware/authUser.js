import jwt from 'jsonwebtoken';
const authUser = async(req,res,next)=>{
    
const{token} =req.cookies;
if(!token){
   return res.status(401).json({ success: false, message: error.message });
}
try{
const tokenDecode =jwt.verify(token,process.env.JWT_SECRET)
if(tokenDecode.id){
      req.userId = tokenDecode.id; 

    // req.body.userId=tokenDecode.id
    
}else{
    return res.json({success:false,message:"Not Authorized"});
}
next();
}catch(error){
 res.json({success:false,message:error.message});
}
}
export default authUser