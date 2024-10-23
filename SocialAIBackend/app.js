const express=require("express");
const app=express();
const mongoose=require("mongoose");
const mongoUrl="mongodb+srv://shivaram:ram%401730@cluster0.pafie.mongodb.net/?retryWrites=true&w=majority&appName=Cluster00";
const bcrypt=require("bcryptjs")
const jwt=require("jsonwebtoken");
const JWT_secret="jkfjdfjikjijo[]kajfiojioj1234";
mongoose.connect(mongoUrl).then(()=>{
    console.log("database connected");
}).catch((e)=>{
    console.log(e);
})
require("./userDetails")
const user=mongoose.model('userInfo');
app.use(express.json());
app.get("/",(req,res)=>{
        res.send({status:"Started"})
})
app.listen(5001,()=>{
    console.log("server is started");
})
app.post("/register",async(req,res)=>{
    const {name,email,password}=req.body;
    const oldUser=await user.findOne({email:email});
    if(oldUser){
        return res.send({data:"user already exists"});
    }
    const encryptedPass=await bcrypt.hash(password,10);
    try{
        await user.create({
            name:name,
            email:email,
            password:encryptedPass
        });
        res.send({status:"ok",data:"user created"})
    }
    catch(error){
        res.send({status:"error",data:"error"})
    }
    
});
app.post("/login-user",async(req,res)=>{
        const {email,password}=req.body;
        const oldUser=await user.findOne({email:email});
        if(!oldUser){
            return res.send({data:"user doesn't exist"});

        }
        if(await bcrypt.compare(password,oldUser.password)){
            const token=jwt.sign({email:oldUser.email},JWT_secret);
            if(res.status(201)){
                return res.send({status:'ok',data:token});
            }else{
                return res.send({error:"error"});
            }
        }

    
})