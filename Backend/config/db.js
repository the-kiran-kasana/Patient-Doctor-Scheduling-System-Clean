const mongoose = require("mongoose")
require('dotenv').config()

const connectDB = async () => {
   try{
       await mongoose.connect(process.env.MONGODB_URL_CLOUD);
       console.log("nodejs is connected to cloud mongoDB");
   }catch(err){
       console.log("nodejs is not connected to mongoDB");
   }
}

module.exports = {connectDB};