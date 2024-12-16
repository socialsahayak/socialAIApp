const mongoose=require("mongoose");
const schema=mongoose.Schema;



const messageSchema = new schema({
    sender: {
      type: String,
      enum: ['user', 'bot'],
      required: true,
      description: "Indicates whether the message was sent by the user or the bot"
    },
    message: {
      type: String,
      required: true,
      description: "The content of the message"
    }
  });



const historySchema=new schema({
    id:{
        type:String,
        required:true
    },
    chat_date: {
        type: String,
        required: true,
        default: () => new Date().toISOString().split('T')[0], // "YYYY-MM-DD"
        description: "The date of the chat in YYYY-MM-DD format"
      },
      messages: {
        type: [messageSchema],
        required: true,
        description: "List of messages exchanged during the chat session"
      }
})

module.exports=mongoose.model("chatHistory",historySchema);