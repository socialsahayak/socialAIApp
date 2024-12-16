const mongoose=require("mongoose");
const schema=mongoose.Schema;

const OTPSchema=new schema({
    email:{
        type:String,
        required:true
    },
    otp:{
        type:String,
        required:true
    },
    createdAt:Date,
    expiresAt:Date,

});

const OTP=mongoose.model("OTP",OTPSchema);
module.exports=OTP;