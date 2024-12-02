const mongoose=require("mongoose");
const userDetailschema=new mongoose.Schema({
    id:String,
    name:String,
    email:{type:String,unique:true},
    password:String,
},{
    collection:'userInfo'
});
mongoose.model('userInfo',userDetailschema);
