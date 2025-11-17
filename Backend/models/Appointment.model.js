const mongoose = require("mongoose")

const AppointmentSchema = new mongoose.Schema({

                appointmentTypes :{type:String, enum:["in-person" , "telemedicine"], required:true , default:"in-person"},
            //  doctorsTypes:{type:String, enum:["General Physician" , "Dermatologist" , "Cardiologist" , "Dentist" , "Orthopedic"], required:true , default:"in-person"},
                doctorName:{type:String ,enum:["Dr. Rakesh","Dr. Sharma" ,"Dr. Riya Sharma" , "Dr. Arjun Khanna" , "Dr. Aman Gupta" , "Dr. Manoj Yadav"] ,  required:true},
                reason:{type:String , required:true},
                BookDate : {type:Date , default: Date.now},
                userId: { type:mongoose.Schema.Types.ObjectId , ref:"User" },
                startTime: { type: Date, required: true },
                endTime: { type: Date, required: true },
                Time: { type: String},
                googleEventId: { type: String },
                status : {type:String ,enum:["scheduled" , "completed" ,"cancelled"] ,  required:true ,default:"scheduled"}

}, { timestamps: true });

const AppointmentModel = mongoose.model("Appointments" , AppointmentSchema)

module.exports = AppointmentModel;