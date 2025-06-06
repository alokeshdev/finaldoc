const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    specialty: {
        type: String,
        required: true,
        trim: true
    },
    symptomsTreated: [{
        type: String,
        trim: true
    }],
    hospitalName: {
        type: String,
        required: true,
        trim: true
    },
    address: {
        type: String,
        required: true,
        trim: true
    },
    city: {
        type: String,
        required: true,
        trim: true
    },
    state: {
        type: String,
        required: true,
        trim: true
    },
    phone: {
        type: String,
        required: true,
        trim: true
    },
    fees: {
        type: Number,
        required: true
    },
    followUpFee: {
        type: Number,
        default: function() {
            return this.fees;
        }
    },
    availability: {
        type: String,
        required: true,
        trim: true
    },
    featured: {
        type: Boolean,
        default: false
    },
    qualifications: {
        mbbs: {
            type: String,
            trim: true
        },
        md: {
            type: String,
            trim: true
        },
        dm: {
            type: String,
            trim: true
        }
    },
    experience: {
        type: Number,
        default: 0
    },
    schedule: {
        sunday: String,
        monday: String,
        tuesday: String,
        wednesday: String,
        thursday: String,
        friday: String,
        saturday: String
    },
    coordinates: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: {
            type: [Number],
            default: [0, 0]
        }
    }
}, {
    timestamps: true
});

// Create index for geospatial queries
doctorSchema.index({ coordinates: '2dsphere' });

module.exports = mongoose.model('Doctor', doctorSchema); 