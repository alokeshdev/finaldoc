const express = require('express');
const router = express.Router();
const Doctor = require('../models/Doctor');
const auth = require('../middleware/auth');
const { isAdmin } = require('../middleware/auth');

// Get all doctors
router.get('/', async (req, res) => {
    try {
        const doctors = await Doctor.find();
        res.json(doctors);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Search doctors by symptoms and location
router.get('/search', async (req, res) => {
    try {
        const { symptoms, location, specialty, doctorName } = req.query;
        let orQuery = [];

        if (symptoms) {
            const symptomsArr = symptoms.split(',').map(s => s.trim()).filter(Boolean);
            if (symptomsArr.length > 0) {
                orQuery.push({ symptomsTreated: { $in: symptomsArr.map(s => new RegExp(s, 'i')) } });
            }
        }

        if (specialty) {
            orQuery.push({ specialty: new RegExp(specialty.trim(), 'i') });
        }

        if (location) {
            const loc = location.trim();
            orQuery.push({ city: new RegExp(loc, 'i') });
            orQuery.push({ state: new RegExp(loc, 'i') });
            orQuery.push({ address: new RegExp(loc, 'i') });
            orQuery.push({ hospitalName: new RegExp(loc, 'i') });
        }

        if (doctorName) {
            orQuery.push({ name: new RegExp(doctorName.trim(), 'i') });
        }

        // If no search parameters, return all doctors
        const query = orQuery.length > 0 ? { $or: orQuery } : {};

        // Debug log
        console.log('Search query:', query);

        const doctors = await Doctor.find(query);

        // Debug log
        console.log('Doctors found:', doctors.length);

        res.json(doctors);
    } catch (error) {
        console.error('Search error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get all featured doctors
router.get('/featured', async (req, res) => {
    try {
        const doctors = await Doctor.find({ featured: true });
        res.json(doctors);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Add new doctor (protected, admin only)
router.post('/', auth, isAdmin, async (req, res) => {
    console.log('POST /api/doctors called');
    console.log('User:', req.user);
    try {
        const doctor = new Doctor(req.body);
        await doctor.save();
        res.status(201).json(doctor);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update doctor (protected, admin only)
router.put('/:id', auth, isAdmin, async (req, res) => {
    try {
        const doctor = await Doctor.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        
        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }
        
        res.json(doctor);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete doctor (protected, admin only)
router.delete('/:id', auth, isAdmin, async (req, res) => {
    try {
        const doctor = await Doctor.findByIdAndDelete(req.params.id);
        
        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }
        
        res.json({ message: 'Doctor deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Suggest doctors by name, location, or specialty (for autocomplete)
router.get('/suggest', async (req, res) => {
    try {
        const { q } = req.query;
        if (!q || !q.trim()) {
            return res.json([]);
        }
        const regex = new RegExp(q.trim(), 'i');
        const doctors = await Doctor.find({
            $or: [
                { name: regex },
                { city: regex },
                { state: regex },
                { address: regex },
                { hospitalName: regex },
                { specialty: regex }
            ]
        }).limit(10).select('name specialty city state hospitalName');
        res.json(doctors);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router; 