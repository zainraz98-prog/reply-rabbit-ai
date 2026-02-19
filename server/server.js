const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// --- MIDDLEWARE ---
// Use your specific Vercel link here to prevent "CORS Errors"
app.use(cors({
    origin: "https://reply-rabbit.vercel.app", 
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));

app.use(express.json());

// --- DATABASE CONNECTION ---
// Railway/Render will provide this via Environment Variables
const MONGO_URI = process.env.MONGO_URI; 

mongoose.connect(MONGO_URI)
    .then(() => console.log('✅ MongoDB Connected Successfully'))
    .catch(err => console.log('❌ MongoDB Connection Error:', err));

// --- ROUTES ---
app.get('/', (req, res) => {
    res.send('🚀 ReplyRabbit API is running smoothly...');
});

// Make sure these files exist in your /server/routes folder!
app.use('/api/tickets', require('./routes/ticketRoutes'));
app.use('/api/knowledge', require('./routes/knowledgeRoutes'));

// --- SERVER START ---
// Railway/Render automatically assigns a PORT; this line is CRITICAL
const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server is flying on port ${PORT}`);
});