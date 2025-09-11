import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log(`Connected to database: ${mongoose.connection.name}`);
  } catch (error) {
    console.error(`Error Connecting to Databse: ${error.message} `);
    process.exit(1);
  }
  process.on("SIGINT", async () => {
    await mongoose.connection.close();
    console.log("🛑 Database connection closed due to app termination");
    process.exit(0);
  });
};

export default connectDB;
