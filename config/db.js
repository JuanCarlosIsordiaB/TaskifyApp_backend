import mongoose from "mongoose";


const conectDB = async() => {
    try {
        const connection = await mongoose.connect(process.env.MONGO_URI);

        const url = `${connection.connection.host}:${connection.connection.port}`;
        console.log(`MongoDB connected in: ${url}`)
    } catch (error) {
        console.log(error.message);
        process.exit(1);
    }
}

export default conectDB;