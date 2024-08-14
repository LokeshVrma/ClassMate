const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/auth');
const usersRoutes = require('./routes/users');
const studyPlansRoutes = require('./routes/studyPlans');
require('dotenv').config();

const app = express();

const PORT = process.env.PORT || 5000;

// Database Connection
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/study-plans', studyPlansRoutes);

app.get('/', (req, res) => {
    res.send("worked");
})

app.listen(PORT, () => {
    console.log(`Server Started at ${PORT}`);
})