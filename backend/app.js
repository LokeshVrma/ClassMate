const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/auth');
const usersRoutes = require('./routes/users');
const studyPlansRoutes = require('./routes/studyPlans');
const assignmentRoutes = require('./routes/assignments');
const notesRoutes = require('./routes/notes');
const forumsRoutes = require('./routes/forums');
require('dotenv').config();

const app = express();

const PORT = process.env.PORT || 5000;

// Database Connection
connectDB();

// Middleware
app.use(cors({
    origin: process.env.CLIENT_ORIGIN || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/study-plans', studyPlansRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/notes', notesRoutes);
app.use('/api/forums', forumsRoutes);

app.get('/', (req, res) => {
    res.status(200).send("API is working");
})

app.get('/api/ping', (req, res) => {
    res.status(200).json({ message: 'Connected to backend' });
})

// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.listen(PORT, () => {
    console.log(`Server Started at ${PORT}`);
})

// Handle Uncaught Exceptions and Rejections
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    process.exit(1);
});

process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection:', err);
});

connectDB().catch(err => {
    console.error("Database connection error:", err);
    process.exit(1); // Exit process if the database connection fails
});
