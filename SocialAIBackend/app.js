const express=require("express");
const app=express();
const mongoose=require("mongoose");
const mongoUrl="mongodb+srv://shivaram:ram%401730@cluster0.pafie.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
mongoose.connect(mongoUrl).then(()=>{
    console.log("database connected");
}).catch((e)=>{
    console.log(e);
})
app.get("/",(req,res)=>{
        res.send({status:"Started"})
})
app.listen(5001,()=>{
    console.log("server is started");
})
app.post("/register",async(req,res)=>{
    const data=req.body;
})