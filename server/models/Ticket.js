const mongoose = require('mongoose');
const TicketSchema = new mongoose.Schema({
    customerEmail: String,
    subject: String,
    message: String,
    aiResponse: String,
    status: { type: String, default: 'Pending' }
});
module.exports = mongoose.model('Ticket', TicketSchema);