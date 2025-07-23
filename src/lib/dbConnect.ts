import mongoose from "mongoose";
import { any } from "zod";

type ConnectionObject = {
    isConnected?: number
}

const connection: ConnectionObject={}

async function dbConnect(): Promise<void>{
    if (connection.isConnected) {
        console.log("already connected to Database");
        return
        
    }

    try {
        const db = await mongoose.connect(process.env.MONGODB_URI || '',{})

        connection.isConnected = db.connections[0].readyState

        console.log("DB CONNECTED SUCCESSFULLY");
        

    } catch (error) {
        console.log('database connection failed',error);
        
        process.exit(1)
    }
}

export default dbConnect;