const mongoose = require("mongoose")

const AppointmentSchema = new mongoose.Schema({

        //AppointmentTypes :{type:String, enum:["in-person" , "telemedicine"], required:true , default:"in-person"},
                doctorName:{type:String ,enum:["Dr. gansyam" , "rd-meena","Dr. Rakesh","Dr. Sharma"] ,  required:true},
                reason:{type:String , required:true},
                BookDate : {type:Date , default: Date.now},
                userId: { type:mongoose.Schema.Types.ObjectId , ref:"User" },
                startTime: { type: Date, required: true },
                endTime: { type: Date, required: true },
                googleEventId: { type: String },
                status : {type:String ,enum:["scheduled" , "completed" ,"cancelled"] ,  required:true ,default:"scheduled"}

}, { timestamps: true });

const AppointmentModel = mongoose.model("Appointments" , AppointmentSchema)

module.exports = AppointmentModel;