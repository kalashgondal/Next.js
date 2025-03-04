import mongoose from "mongoose"

const connectDB = async () => {
    if (mongoose.connections[0].readyState) {
        return true;
    }

    try {
        await mongoose.connect(process.env.MANGODB_URI);
        console.log('Mongodb Connected');
        return true;
    } catch (error) {
        console.log(error);
    }
}

export default connectDB;