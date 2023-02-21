import mongoose from "mongoose";

const connectDB = async () => {
    try {
        mongoose.set("strictQuery", false);
        const conn = await mongoose.connect(process.env.MONGO_URL, {
            useUnifiedTopology: true,
            dbName: process.env.DB_NAME,
        });

        console.log(`Connected to: DataBase`);
    } catch (error) {
        console.log(`Error: ${error.message}`);
        process.exit();
    }
};

export default connectDB;
