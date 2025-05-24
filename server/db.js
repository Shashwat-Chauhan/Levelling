import mongoose from "mongoose";

const connectDb = async() => {
    try{
        const conn = await mongoose.connect(process.env.MONGO_URI)                                                                                                  
        console.log("Connected to MongoDB")
    }catch(e){
        console.log("MONGODB CONNECTION ERROR")
        console.log(e)
    }
}

export default connectDb