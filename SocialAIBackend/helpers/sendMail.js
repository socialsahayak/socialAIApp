const nodemailer = require("nodemailer");
const axios = require('axios');



const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  secure: false, // true for port 465, false for other ports
  auth: {
    user: "socialaisahayak222@gmail.com",
    pass: "znvcpnppsddkrxyb",
  },
});



const verifyEmail = async (email) => {
  const apiKey = '28e3d476833b4dbc91f499f1c1c00c42';
  const apiUrl = `https://api.zerobounce.net/v2/validate?api_key=${apiKey}&email=${email}`;

  try {
    const response = await axios.get(apiUrl);
    const data = response.data;

    if (data.status === 'valid') {
      console.log('The email is valid');
    } else {
      console.log('The email is invalid');
    }
  } catch (error) {
    console.error('Error verifying email:', error.message);
  }
};


async function sendMail(to,subject,text,html) {
  try{
  const info = await transporter.sendMail({
    from: "socialaisahayak222@gmail.com", 
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
module.exports={verifyEmail,sendMail}

