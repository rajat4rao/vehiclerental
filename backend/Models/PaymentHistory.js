const mongoose = require('mongoose');

const paymentHistorySchema = new mongoose.Schema({
    uid: { type: String, required: true },
    car_no: { type: String, required: true }, 
    amount: { type: Number, required: true },
    currency: { type: String, required: true },
    payment_date: { type: Date, default: Date.now },
    payment_intent_id: { type: String },
});

const PaymentHistory = mongoose.model('PaymentHistory', paymentHistorySchema);

module.exports = {PaymentHistory};