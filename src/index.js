const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const materialRoutes = require('./routes/materialRoutes');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// CORS configuration
const corsOptions = {
    origin: '*',  // Adjust according to your needs
    credentials: true,
};

app.use(cors(corsOptions)); // Apply CORS options to all routes

// Middleware
app.use(bodyParser.json());

// Routes
app.use('/api/materials', materialRoutes);

// Connect to MongoDB
connectDB();

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
