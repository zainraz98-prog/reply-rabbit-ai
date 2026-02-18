const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// --- MIDDLEWARE ---
// Allowing all origins for now to make deployment easier. 
// When you have your Vercel link, you can put it inside cors({ origin: 'your-link' })
app.use(cors());
app.use(express.json());

// --- DATABASE CONNECTION ---
// Using process.env.MONGO_URI for the live database on Render
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/replyrabbit';

mongoose.connect(MONGO_URI)
    .then(() => console.log('✅ MongoDB Connected Successfully'))
    .catch(err => console.log('❌ MongoDB Connection Error:', err));

// --- ROUTES ---
// Root route: Very important for Render to check if the "Kitchen" is open
app.get('/', (req, res) => {
    res.send('🚀 ReplyRabbit API is running smoothly...');
});

app.use('/api/tickets', require('./routes/ticketRoutes'));
app.use('/api/knowledge', require('./routes/knowledgeRoutes'));

// --- SERVER START ---
// PORT 5000 for localhost, but process.env.PORT is REQUIRED for Render
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server is flying on port ${PORT}`);
});