const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  secure: false, // true for port 465, false for other ports
  auth: {
    user: "socialaisahayak222@gmail.com",
    pass: "znvcpnppsddkrxyb",
  },
});

// async..await is not allowed in global scope, must use a wrapper
async function sendMail(to,subject,text,html) {
  // send mail with defined transport object
  try{
  const info = await transporter.sendMail({
    from: "socialaisahayak222@gmail.com", // sender address
    to,
    subject,
    text,
    html
  });
  return {success:true};

}catch(error){
  return {success:false};
}
};
module.exports={sendMail}