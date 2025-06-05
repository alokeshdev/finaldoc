const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    phone: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    date: {
        type: Date,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    service: {
        type: String,
        required: true,
        trim: true
    },
    serviceType: {
        type: String,
        enum: ['physiotherapy', 'mentalHealth', 'bloodCollection'],
        required: true
    },
    message: {
        type: String,
        trim: true
    },
    collectionLocation: {
        type: String,
        enum: ['home', 'lab'],
        // Only required for blood collection service
        required: function() {
            return this.serviceType === 'bloodCollection';
        }
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'completed', 'cancelled'],
        default: 'pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Booking', bookingSchema);