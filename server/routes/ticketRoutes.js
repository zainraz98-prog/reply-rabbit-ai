const express = require('express');
const router = express.Router();
const Ticket = require('../models/Ticket');
const { generateAIReply } = require('../services/openaiService');

// 1. Get all tickets
router.get('/', async (req, res) => {
    try {
        const tickets = await Ticket.find().sort({ _id: -1 });
        res.json(tickets);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. The Generate AI Route
router.post('/:id/generate', async (req, res) => {
    try {
        const ticket = await Ticket.findById(req.params.id);
        
        if (!ticket) return res.status(404).json({ error: "Ticket not found" });

        // Call our AI logic
        const aiDraft = await generateAIReply(ticket.message);
        
        // Save the draft back to the ticket in the database
        ticket.aiResponse = aiDraft;
        await ticket.save();
        
        res.json(ticket);
    } catch (err) {
        console.error("AI Error:", err);
        res.status(500).json({ error: "AI generation failed" });
    }
});

// 3. DELETE a specific ticket
router.delete('/:id', async (req, res) => {
    try {
        const ticket = await Ticket.findByIdAndDelete(req.params.id);
        
        if (!ticket) {
            return res.status(404).json({ error: "Ticket not found in database" });
        }
        
        res.json({ message: "Ticket successfully removed" });
    } catch (err) {
        console.error("Delete Error:", err);
        res.status(500).json({ error: "Server failed to delete ticket" });
    }
});

// CREATE a new ticket (The "Receiver" for the Contact Form)
router.post('/', async (req, res) => {
    try {
        const { customerEmail, subject, message } = req.body;
        
        const newTicket = new Ticket({
            customerEmail,
            subject,
            message,
            status: 'Pending',
            aiResponse: '' // Initialize with empty AI response
        });

        const savedTicket = await newTicket.save();
        res.status(201).json(savedTicket);
    } catch (err) {
        console.error("Submission Error:", err);
        res.status(400).json({ error: "Failed to create ticket" });
    }
});

// RESOLVE a ticket (Update status to Resolved)
router.patch('/:id/resolve', async (req, res) => {
    try {
        const ticket = await Ticket.findByIdAndUpdate(
            req.params.id,
            { status: 'Resolved' },
            { new: true } // Return the updated document
        );
        res.json(ticket);
    } catch (err) {
        res.status(500).json({ error: "Failed to resolve ticket" });
    }
});

module.exports = router;