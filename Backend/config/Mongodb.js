import mongoose from "mongoose";

const connectDb = async () => {
  mongoose.connection.on("connected", () => {
    console.log("database connected successfully.");
  });
  await mongoose.connect(`${process.env.DATABASE_URL}/Delhi-Shoes`);
};

export default connectDb;
