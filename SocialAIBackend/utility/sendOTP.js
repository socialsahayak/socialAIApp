const nodemailer=require("nodemailer");
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    secure: false, // true for port 465, false for other ports
    auth: {
      user: "socialaisahayak222@gmail.com",
      pass: "znvcpnppsddkrxyb",
    },
  });
  
  // async..await is not allowed in global scope, must use a wrapper
  async function sendOTP(to,subject,message,html) {
    // send mail with defined transport object
    console.log("hii");
    try{
    const info = await transporter.sendMail({
      from: "socialaisahayak222@gmail.com", // sender address
      to,
      subject,
      message,
      html
    });
    return {success:true};
  
  }catch(error){
    return {success:false};
  }
  };
  module.exports=sendOTP;