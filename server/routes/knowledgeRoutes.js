const express = require('express');
const router = express.Router();
const Knowledge = require('../models/Knowledge');

// Fetch current AI settings
router.get('/', async (req, res) => {
    try {
        const info = await Knowledge.findOne() || {};
        res.json(info);
    } catch (err) { res.status(500).json(err); }
});

// SAVE or UPDATE AI settings
router.post('/update', async (req, res) => {
    try {
        // This command updates the document if it exists, or creates it if it doesn't
        const updated = await Knowledge.findOneAndUpdate(
            {}, 
            req.body, 
            { upsert: true, new: true }
        );
        res.json(updated);
    } catch (err) { 
        res.status(500).json({ error: "Database save failed" }); 
    }
});

module.exports = router;