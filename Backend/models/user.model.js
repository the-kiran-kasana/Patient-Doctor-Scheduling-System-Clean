const mongoose = require("mongoose")



const NotificationPreferencesSchema = new mongoose.Schema({
  enabled: { type: Boolean, default: true },
  method: { type: String, enum: ["email","sms"], default: "email" },
  minutesBefore: { type: Number, default: 60 } // 60 minutes before appointment
});



const userSchema = new mongoose.Schema({

        username: {type:String,required:true},
        email: {type:String,required:true,unique:true},
        password: {type:String,required:true},
        role:{type:String, enum:["doctor" ,"patient" ,"admin"], required:true , default:"user"},
        notificationPreferences: { type: NotificationPreferencesSchema, default: () => ({}) , require : true},
        googleTokens: {
            access_token: { type: String },
            refresh_token: { type: String },
            scope: { type: String },
            token_type: { type: String },
            expiry_date: { type: Number }
          }

//        profileId:{type:Number}
} , { timestamps: true });

const userModel = mongoose.model("User" , userSchema)

module.exports = userModel;