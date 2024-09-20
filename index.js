const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load env vars
dotenv.config({ path: './config/.env' });

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(express.json()); // Body parser
app.use(cors()); // Enable CORS

// Import Routes
const habitats = require('./routes/habitats.routes');
const animals = require('./routes/animals.routes');
const auth = require('./routes/auth.routes');

// Use Routes
app.use('/api/habitats', habitats);
app.use('/api/animals', animals);
app.use('/api/auth', auth);
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
  });


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
