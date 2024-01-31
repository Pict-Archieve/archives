import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
  try {

   console.log(`${process.env.MONGODB_URL} and ${process.env.DB_NAME}`);
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URL}/${DB_NAME}`
    );
    console.log(
      `\n MongoDB Connected !! DB HOST : ${connectionInstance.connection.host}`
    );
  } catch (error) {
  //  console.log(`Connection :- ${MONGODB_URL} and ${DB_NAME}`);
    console.log("MongoDB Connection Failed in DB", error);
    process.exit(1);
  }
};

export default connectDB;
