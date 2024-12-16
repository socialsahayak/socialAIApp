const generateOTP=async()=>{
    try{
        return (otp=`${1000+Math.floor(Math.random()*9000)}`)
    }catch(error){
        throw error;
    }
};

module.exports=generateOTP;