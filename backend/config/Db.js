import mongoose from "mongoose"

const Connect_Db= async (req,res)=>{

  try {

    const MongoInstance = await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected successfully !!");
    console.log('mongoDb host is ',MongoInstance.connection.host);
    

  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  }
}

export default Connect_Db;