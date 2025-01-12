import mongoose from "mongoose";
// import { DB_Name } from "../constants.js";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URL}`
    );
    
    console.log(
        `MongoDB connected !! Host:${connectionInstance.connection.host}`
      );
  } catch (error) {
    console.log("MongoDB connection ERROR!!", error);
    process.exit(1);
  }
};

export {connectDB}