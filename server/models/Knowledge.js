const mongoose = require('mongoose');

const KnowledgeSchema = new mongoose.Schema({
    businessName: { type: String, default: "" },
    shippingPolicy: { type: String, default: "" },
    refundPolicy: { type: String, default: "" },
    additionalContext: { type: String, default: "" }
}, { 
    // This automatically creates 'createdAt' and 'updatedAt' fields
    timestamps: true 
});

module.exports = mongoose.model('Knowledge', KnowledgeSchema);