const express=require("express");
const app=express();
const mongoose=require("mongoose");
const {sendMail}=require("./helpers/sendMail")
const {v4:uuidv4 }=require("uuid");
const generateOTP=require("./utility/generateOTP");
const OTP=require("./model/otp");
const sendOTP=require("./utility/sendOTP");
const cors=require("cors");
const axios=require("axios");
const mongoUrl="mongodb+srv://shivaram:ram%401730@cluster0.pafie.mongodb.net/?retryWrites=true&w=majority&appName=Cluster00";
const bcrypt=require("bcryptjs")
const jwt=require("jsonwebtoken");
// const { sendMail, main } = require("./helpers/sendMail");
const JWT_secret="jkfjdfjikjijo[]kajfiojioj1234jdfdfjji";


mongoose.connect(mongoUrl).then(()=>{
    console.log("database connected");
}).catch((e)=>{
    console.log(e);
})


require("./userDetails")
const user=mongoose.model('userInfo');
app.use(express.json());
app.use(cors());


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
    const emailResponse= await sendMail(email,"Welcome to Our App",`Hi ,${name} Thank you for registering ! Now you can explore our app`);
    if(!emailResponse.success){
        console.log("failed to send email");
        return res.status(500).send({status:"error",data:"It seems email doesn't exist"});
    }
    try{
    await user.create({
        id:uuidv4(),
        name:name,
        email:email,
        password:encryptedPass
    });
    res.send({status:"ok",data:"user created"});
    }catch(error){
        res.send({status:"error",data:error});
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



app.post("/otp",async(req,res)=>{
    let {email}=req.body;
    try{
        let isExit=await user.findOne({email});
        if(!isExit){
           return res.status(400).send("Account not yet created using this email");
        }
        await OTP.deleteOne({email});
        const generatedOTP=await generateOTP();
        console.log("otp generated");
        const hasedData=await bcrypt.hash(generatedOTP,10);
        const emailResponse= await sendOTP(email,"Forgot password","By entering otp you can change password now",`<p>Your OTP code is:</p>
<p style="color:tomato; font-size:25px;letter-spacing:2px;"><b>${generatedOTP}</b></p>
<p>This code <b>expires in 10 minutes</b>.</p>`);
            console.log("email send");
        if (!emailResponse.success) {
            return res.status(500).send("Failed to send OTP email. Please try again.");
        }
        const newOTP=new OTP({
            email,
            otp:hasedData,
            createdAt:Date.now(),
            expiresAt:Date.now() + 10 * 60 * 1000,
        });
        await newOTP.save();
        res.status(200).send({
            message: "OTP sent successfully",
            data: { email }
        });

    }
    catch (error) {
        console.error("Error in /otp endpoint:", error);
        res.status(500).send("Internal Server Error");
    }
})


app.post("/verifyOtp",async(req,res)=>{
    let {otp,email}=req.body;
    console.log(email);
    try{
        const savedOTP=await OTP.findOne({email});
        console.log(savedOTP);
        let isMatch=await bcrypt.compare(otp,savedOTP.otp);
        console.log(isMatch);
        if(!isMatch){
            return res.status(400).json({message:"Invalid OTP"});
        }
        if(Date.now()>savedOTP.expiresAt){
            return res.status(401).json({message:"OTP has been Expired"});
        }
        return res.status(201).json({message:"Valid OTP"});
    }catch(error){
        return res.status(500).json({message:"Internal server error"});
    }
})


app.put("/changePassword",async(req,res)=>{
    let {email,password}=req.body;
    try{
        const User=await user.findOne({email});
        if(!User){
            return res.status(404).send("User not Found");
        }
        let hashPass=await bcrypt.hash(password,10);
        let changePass=await user.updateOne({email},{$set:{password:hashPass}});
        if(!changePass){
            return res.status(400).send("Failed");
        }
        return res.status(200).send("Password has been changed");
    }catch(err){
        return res.status(500).send("Internal server Error");
    }
})



// model
app.post('/process_question', async (req, res) => {
    const question = req.body.question;
    console.log(question);

    try {
        const response = await axios.post('https://b029-34-34-94-196.ngrok-free.app/process_question', {
            question: question
        });
        res.json({
            answer: response.data.answer
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error processing question' });
    }
});



