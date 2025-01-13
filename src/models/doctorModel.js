import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema({
  SNo: { type: Number },
  FullName: { type: String },   // updated field name to FullName
  Degree: { type: String},
  Speciality: { type: String },  // updated field name to Speciality
  Nationality: { type: String },                 // added field for Nationality
  Gender: { type: String },
  WorkingPlace: { type: String },
  FNDRegistrationNo: { type: String },          // added field for Registration Number
  RegistrationValidity: { type: String },        // added field for Registration Validity
});

export const Doctor = mongoose.model("Doctor", doctorSchema);
