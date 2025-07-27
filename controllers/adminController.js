
// login seller: /api/seller/login
import jwt from 'jsonwebtoken'
export const AdminLogin =async(req,res)=>{
    try{
    const {email,password}=req.body
    if(password=== process.env.ADMIN_PASSWORD && email=== process.env.ADMIN_EMAIL){
        const token= jwt.sign({email,role:'admin'},process.env.JWT_SECRET,{
            expiresIn:'7d'
        })
        res.cookie('admintoken',token,{
        httpOnly:true, 
         secure:process.env.NODE_ENV==="production",
         sameSite : process.env.NODE_ENV ===" production"?"none":"strict", 
         maxAge:7*24*60*60*1000, 
    }) 
         return res.json({success:true,message:"Logged In"})

    }else{
          return res.json({success:false,message:"Invalid credentials"}) 
    }
    
}catch(error){
    console.log(error.message)
        res.json({success:false,message:error.message})
}
}
//check  seller auth: /api/seller/is-auth
export const isAdminAuth=async(req,res)=>{
    try{
  
  return res.json({success:true})
    }catch(error){
    console.log(error.message)
        res.json({success:false,message:error.message})
    }
}
//logout seller 
export  const AdminLogout=async(req,res)=>{
    try{
        res.clearCookie('admintoken',{
              httpOnly:true, 
         secure:process.env.NODE_ENV==="production",
         sameSite : process.env.NODE_ENV ==="production"?"none":"strict",    
        })
        return res.json({success:true,message:"Logged Out"})
 
    }catch(error){
    console.log(error.message)
        res.json({success:false,message:error.message})
    }
}