const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect("mongodb+srv://chanakya:chandragupta@chanakya-server.bijipum.mongodb.net/?retryWrites=true&w=majority&appName=chanakya-server/jeeludb");
        console.log('MongoDB connected');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

module.exports = connectDB;