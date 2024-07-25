import mongoose from "mongoose";

type ConnectionObject = {
    inConnected?: number
}

const connection: ConnectionObject = {}

async function dbConnect(): Promise<void> {
    if (connection.inConnected) {
        console.log("Already connected to database");
        return
    }

    try {
        const db = await mongoose.connect(process.env.MANGODB_URI || '', {})

        connection.inConnected = db.connections[0].readyState
        
        console.log("DB Connected Successfully");
        
    
    } catch (error) {
        console.log("Database connection failed",error);
        
        process.exit(1)
    }

}

export default dbConnect;