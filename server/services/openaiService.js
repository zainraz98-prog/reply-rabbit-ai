const Knowledge = require('../models/Knowledge');

const generateAIReply = async (customerMessage) => {
    const trainingData = await Knowledge.findOne();
    
    const bizName = trainingData?.businessName || "our support team";
    const refund = trainingData?.refundPolicy || "our policy";

    // A smart professional template
    return `Hello! This is an automated draft from ${bizName}. Regarding your message: "${customerMessage.substring(0, 30)}...", please note that ${refund}. We will be in touch shortly!`;
};

module.exports = { generateAIReply };