import { log } from "console";
import mongoose from "mongoose";

export async function connect() {
  try {
    await mongoose.connect(process.env.MONGO_URI!);
    const connection = mongoose.connection;
    connection.on("connected", () => {
      console.log("mongodb connected");
    });
    connection.on("error", (error) => {
      console.log("mongodb not connected:" + error);
      process.exit();
    });
  } catch (error) {
    console.log("Something went wrong while connecting to DB");
    console.log(error);
  }
}
