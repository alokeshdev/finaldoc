const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const auth = require('../middleware/auth');
const { isAdmin } = require('../middleware/auth');

// Create a new booking
router.post('/', async (req, res) => {
    try {
        const { name, phone, email, date, time, service, serviceType, message, collectionLocation } = req.body;
        
        // Create new booking
        const booking = new Booking({
            name,
            phone,
            email,
            date,
            time,
            service,
            serviceType,
            message,
            collectionLocation
        });
        
        await booking.save();
        res.status(201).json({ message: 'Booking created successfully', booking });
    } catch (error) {
        console.error('Booking creation error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get all bookings (admin only)
router.get('/', auth, isAdmin, async (req, res) => {
    try {
        const bookings = await Booking.find().sort({ createdAt: -1 });
        res.json(bookings);
    } catch (error) {
        console.error('Fetch bookings error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get bookings by service type (admin only)
router.get('/service/:serviceType', auth, isAdmin, async (req, res) => {
    try {
        const { serviceType } = req.params;
        
        // Validate service type
        if (!['physiotherapy', 'mentalHealth', 'bloodCollection'].includes(serviceType)) {
            return res.status(400).json({ message: 'Invalid service type' });
        }
        
        const bookings = await Booking.find({ serviceType }).sort({ createdAt: -1 });
        res.json(bookings);
    } catch (error) {
        console.error('Fetch bookings by service error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update booking status (admin only)
router.put('/:id/status', auth, isAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        
        // Validate status
        if (!['pending', 'confirmed', 'completed', 'cancelled'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }
        
        const booking = await Booking.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );
        
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }
        
        res.json(booking);
    } catch (error) {
        console.error('Update booking status error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get booking by ID (admin only)
router.get('/:id', auth, isAdmin, async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }
        
        res.json(booking);
    } catch (error) {
        console.error('Fetch booking error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete booking (admin only)
router.delete('/:id', auth, isAdmin, async (req, res) => {
    try {
        const booking = await Booking.findByIdAndDelete(req.params.id);
        
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }
        
        res.json({ message: 'Booking deleted successfully' });
    } catch (error) {
        console.error('Delete booking error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;