const mongoose = require('mongoose');

const contactMessageSchema = new mongoose.Schema({
    uid: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['open', 'inprogress', 'closed'],
        default: 'open'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});


const ContactMessage = mongoose.model("contactmessages", contactMessageSchema);

module.exports = { ContactMessage };