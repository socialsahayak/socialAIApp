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
const JWT_secret="jkfjdfjikjijo[]kajfiojioj1234jdfdfjji";
const ChatHistory=require("./model/history");

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
        return res.status(401).send({data:"user already exists"});
    }
    const encryptedPass=await bcrypt.hash(password,10);
   
    const emailResponse= await sendMail(email,"Welcome to Our App",`Hi ,${name} Thank you for registering ! Now you can explore our app`);
    console.log(emailResponse);
    if(emailResponse.success==="false"){
        console.log("failed to send email");
        return res.status(400).send({status:"error",data:"It seems email doesn't exist"});
    }
    try{
    const newUser=await user.create({
        id:uuidv4(),
        name:name,
        email:email,
        password:encryptedPass
    });
    const token = jwt.sign({ email: newUser.email }, JWT_secret, { expiresIn: "1h" });
    res.send({status:"ok",token,data:"user created"});
    }catch(error){
        res.status(500).send({status:"error",data:error});
    }
    
});


app.post("/login-user",async(req,res)=>{
        try{
        const {email,password}=req.body;
        const oldUser=await user.findOne({email:email});
        if(!oldUser){
            return res.status(400).send({data:"user doesn't exist"});

        }
        if(await bcrypt.compare(password,oldUser.password)){
            const token=jwt.sign({email:oldUser.email},JWT_secret,{ expiresIn: "1h" });
                return res.status(201).send({data:token});
                
        }else{
            return res.status(401).send("Password is Incorrect");
        }
     } catch(err){
            return res.status(500).send({error:"error"});
            
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
app.post('/process_question/:email', async (req, res) => {
  const { email } = req.params;
  console.log(email);

  try {
      // Fetch user ID based on email
      const userRecord = await user.findOne({ email: email }, { _id: 1 });
      if (!userRecord) {
          return res.status(404).json({ message: 'User not found' });
      }
      const user_id = userRecord._id;

      const { question, session_id } = req.body;
      console.log(question, session_id);

      // Send the question to the external API
      const response = await axios.post('https://e184-34-87-158-196.ngrok-free.app/process_question', {
          question: question
      });
      const botAnswer = response.data.answer;

      let chatHistory;

      // Check if session_id is provided
      if (!session_id) {
          // Create a new chat history if no session_id
          chatHistory = new ChatHistory({
              id: user_id,  // Use user ID here
              messages: [],
          });
      } else {
          // Find existing chat history by session_id
          chatHistory = await ChatHistory.findOne({ session_id }).sort({ _id: -1 });
      }

      // If no chat history exists, create a new one
      if (!chatHistory) {
          chatHistory = new ChatHistory({
              id: user_id,  // Ensure 'id' field is set correctly
              messages: [],
              session_id: session_id  // Store session ID for tracking
          });
      }

      // Add user and bot messages to the chat history
      chatHistory.messages.push({ sender: 'user', message: question });
      chatHistory.messages.push({ sender: 'bot', message: botAnswer });

      // Save the updated chat history
      await chatHistory.save();

      // Respond with the bot's answer and the session ID
      res.json({
          answer: botAnswer,
          session_id: chatHistory.session_id || session_id,  // Return correct session ID for client tracking
      });
  } catch (error) {
      console.error('Error processing question:', error);
      res.status(500).json({ message: 'Error processing question' });
  }
});


app.get("/user-details", async (req, res) => {
    console.log("hi");
    const token = req.headers.authorization?.split(" ")[1]; // Extract token from header
  
    if (!token) {
      return res.status(401).send({ status: "error", data: "No token provided" });
    }
  
    try {
      // Verify the token
      const decoded = jwt.verify(token, JWT_secret);
  
      // Find the user using the decoded email
      const userDetails = await user.findOne({ email: decoded.email });
      if (!userDetails) {
        return res.status(404).send({ status: "error", data: "User not found" });
      }
  
      // Send the user's details in the response
      res.send({
        status: "ok",
        data: {
          name: userDetails.name,
          email: userDetails.email,
        },
      });
    } catch (error) {
      console.error("Token verification error:", error);
      res.status(401).send({ status: "error", data: "Invalid token" });
    }
  });


app.get('/user/conversations/:email', async (req, res) => {
    try {
      const {email}=req.params;
      console.log(email);
      let user_id=await user.findOne({email:email},{_id:1});
      if (!user_id) {
        console.error('No user found with email:', email);
        return res.status(404).json({ error: 'No user found with the provided email' });
      }
  
      const conversations = await ChatHistory.find({id:user_id._id}).sort({ date: -1 });; 
      res.status(200).json(conversations); // Send the data as a JSON response
    } catch (error) {
      console.error('Error fetching conversations:', error);
      res.status(500).json({ error: 'Unable to load conversations. Please try again later.' });
    }
  });

  app.get('/conversations/session/:id', async (req, res) => {
    try {
     console.log(req.params);
      const conversations = await ChatHistory.find({session_id:req.params.id}); 
      if (!conversations || conversations.length === 0) {
        console.log('No conversations found for session:', sessionId);
        return res.status(404).json({ error: 'No conversations found' });
    }
      res.status(200).json(conversations); // Send the data as a JSON response
    } catch (error) {
      console.error('Error fetching conversations:', error);
      res.status(500).json({ error: 'Unable to load conversations. Please try again later.' });
    }
  });