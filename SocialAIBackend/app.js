const express=require("express");
const app=express();
const mongoose=require("mongoose");
const mongoUrl="mongodb+srv://shivaram:ram%401730@cluster0.pafie.mongodb.net/?retryWrites=true&w=majority&appName=Cluster00";
const bcrypt=require("bcryptjs")
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