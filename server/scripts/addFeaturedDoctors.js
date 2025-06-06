const mongoose = require('mongoose');
const Doctor = require('../models/Doctor');

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/doctor-info', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.log('MongoDB Connection Error:', err));

const featuredDoctors = [
    {
        name: "Dr. Sarah Johnson",
        specialty: "Cardiology",
        symptomsTreated: ["Chest Pain", "High Blood Pressure", "Heart Palpitations", "Shortness of Breath"],
        hospitalName: "City Heart Hospital",
        address: "123 Medical Plaza",
        city: "Kolkata",
        state: "West Bengal",
        phone: "+91 9876543210",
        fees: 1500,
        followUpFee: 1000,
        availability: "Mon-Fri: 9AM-5PM",
        featured: true,
        qualifications: {
            mbbs: "Medical College, Kolkata (2010)",
            md: "AIIMS Delhi (2015)",
            dm: "Cardiology, AIIMS Delhi (2018)"
        },
        experience: 13,
        schedule: {
            sunday: "Not Available",
            monday: "9:00 AM - 5:00 PM",
            tuesday: "9:00 AM - 5:00 PM",
            wednesday: "9:00 AM - 5:00 PM",
            thursday: "9:00 AM - 5:00 PM",
            friday: "9:00 AM - 5:00 PM",
            saturday: "9:00 AM - 1:00 PM"
        }
    },
    {
        name: "Dr. Rajesh Kumar",
        specialty: "Neurology",
        symptomsTreated: ["Headaches", "Seizures", "Memory Problems", "Balance Issues"],
        hospitalName: "Neuro Care Center",
        address: "456 Health Street",
        city: "Kolkata",
        state: "West Bengal",
        phone: "+91 9876543211",
        fees: 2000,
        followUpFee: 1500,
        availability: "Mon-Sat: 10AM-6PM",
        featured: true,
        qualifications: {
            mbbs: "Medical College, Mumbai (2008)",
            md: "Neurology, AIIMS Delhi (2013)",
            dm: "Neurology, AIIMS Delhi (2016)"
        },
        experience: 15,
        schedule: {
            sunday: "Not Available",
            monday: "10:00 AM - 6:00 PM",
            tuesday: "10:00 AM - 6:00 PM",
            wednesday: "10:00 AM - 6:00 PM",
            thursday: "10:00 AM - 6:00 PM",
            friday: "10:00 AM - 6:00 PM",
            saturday: "10:00 AM - 2:00 PM"
        }
    },
    {
        name: "Dr. Priya Sharma",
        specialty: "Pediatrics",
        symptomsTreated: ["Childhood Illnesses", "Growth Issues", "Vaccinations", "Developmental Concerns"],
        hospitalName: "Children's Medical Center",
        address: "789 Care Avenue",
        city: "Kolkata",
        state: "West Bengal",
        phone: "+91 9876543212",
        fees: 1200,
        followUpFee: 800,
        availability: "Mon-Fri: 8AM-4PM",
        featured: true,
        qualifications: {
            mbbs: "Medical College, Kolkata (2012)",
            md: "Pediatrics, AIIMS Delhi (2017)",
            dm: "Pediatric Neurology, AIIMS Delhi (2020)"
        },
        experience: 11,
        schedule: {
            sunday: "Not Available",
            monday: "8:00 AM - 4:00 PM",
            tuesday: "8:00 AM - 4:00 PM",
            wednesday: "8:00 AM - 4:00 PM",
            thursday: "8:00 AM - 4:00 PM",
            friday: "8:00 AM - 4:00 PM",
            saturday: "Not Available"
        }
    }
];

const addFeaturedDoctors = async () => {
    try {
        // First, remove featured flag from all existing doctors
        await Doctor.updateMany({}, { featured: false });
        
        // Add new featured doctors
        for (const doctor of featuredDoctors) {
            const existingDoctor = await Doctor.findOne({ name: doctor.name });
            if (existingDoctor) {
                await Doctor.findByIdAndUpdate(existingDoctor._id, { ...doctor, featured: true });
                console.log(`Updated ${doctor.name} as featured`);
            } else {
                const newDoctor = new Doctor(doctor);
                await newDoctor.save();
                console.log(`Added ${doctor.name} as featured`);
            }
        }
        
        console.log('Featured doctors added successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error adding featured doctors:', error);
        process.exit(1);
    }
};

addFeaturedDoctors(); 