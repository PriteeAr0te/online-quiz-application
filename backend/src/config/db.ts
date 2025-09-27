import mongoose = require("mongoose")

const connectDB = async () => {
    try {
        if(!process.env.MONGO_URL) {
            throw new Error("Please provide MONGO_URL in the environment variables")
        }
        const conn = await mongoose.connect(process.env.MONGO_URL!)
        console.log(`MongoDB Connected: ${conn.connection.host}`)
    } catch (error) {
        console.log("MongoDB connection error", error)
        process.exit(1)
    }
}

export default connectDB;
