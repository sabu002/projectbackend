import jwt from 'jsonwebtoken'

const authseller = async(req,res,next)=>{
const   {sellertoken} =req.cookies;
 console.log("Cookies:", req.cookies);
  console.log("seller Token:", sellertoken);
  console.log("Type of sellerToken:", typeof sellertoken);
if(!sellertoken){
    return res.json({success:false,message:"No Authorized"});
}
try{
     
    
const tokenDecode =jwt.verify(sellertoken ,process.env.JWT_SECRET)
if(tokenDecode.email=== process.env.SELLER_EMAIL){
  
    next();
    
}else{
    return res.json({success:false,message:"N Authorized"});
}

}catch(error){
 res.json({success:false,message:error.message});
}
}
export default authseller