import mongoose from "mongoose"


const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
})


const tasksSchema = new mongoose.Schema({
    userId: {
        type : mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    totalTimeWorked: {
        type: Number,
        default: 0,
        min: 0,
    }
}, {timestamps: true})

const User = mongoose.model("User" , userSchema)
const Task = mongoose.model("Task" , tasksSchema)

export { User , Task }