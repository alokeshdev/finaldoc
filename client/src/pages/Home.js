import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaSearch, FaMapMarkerAlt, FaStethoscope, FaMoneyBillWave, FaUser, FaHeartbeat, FaWalking, FaBaby, FaBrain, FaEye, FaTooth, FaHandHoldingMedical, FaProcedures, FaHospital, FaFlask, FaVial, FaNotesMedical, FaCalendarAlt, FaPhoneAlt, FaPlus, FaHeart, FaPills, FaSyringe, FaXRay, FaWheelchair, FaUserMd } from 'react-icons/fa';

const Home = () => {
  const [searchParams, setSearchParams] = useState({
    symptoms: '',
    location: '',
    specialty: '',
    doctorName: ''
  });
  const [doctors, setDoctors] = useState([]);
  const [featuredDoctors, setFeaturedDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [bookingForm, setBookingForm] = useState({
    name: '',
    phone: '',
    email: '',
    date: '',
    time: '',
    service: '',
    message: '',
    serviceType: '',
    collectionLocation: 'home',
  });

  const [physioBookingForm, setPhysioBookingForm] = useState({
    name: '',
    phone: '',
    email: '',
    date: '',
    time: '',
    service: 'Physiotherapy',
    message: '',
    serviceType: 'physiotherapy',
    collectionLocation: 'home',
  });

  const [mentalBookingForm, setMentalBookingForm] = useState({
    name: '',
    phone: '',
    email: '',
    date: '',
    time: '',
    service: 'Mental Health',
    message: '',
    serviceType: 'mentalHealth',
    collectionLocation: 'home',
  });

  const [bloodBookingForm, setBloodBookingForm] = useState({
    name: '',
    phone: '',
    email: '',
    date: '',
    time: '',
    service: '',
    message: '',
    serviceType: 'Blood Collection',
    collectionLocation: 'home',
  });

  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingError, setBookingError] = useState(null);
  const [selectedSpecialty, setSelectedSpecialty] = useState('');

  const specialties = [
    { id: 'cardiology', name: 'Cardiology', searchTerm: 'Cardiology', icon: <FaHeartbeat />, color: 'red' },
    { id: 'neurology', name: 'Neurology', searchTerm: 'Neurology', icon: <FaBrain />, color: 'purple' },
    { id: 'orthopedics', name: 'Orthopedics', searchTerm: 'Orthopedic', icon: <FaWalking />, color: 'green' },
    { id: 'pediatrics', name: 'Pediatrics', searchTerm: 'Pediatrics', icon: <FaBaby />, color: 'pink' },
    { id: 'ophthalmology', name: 'Ophthalmology', searchTerm: 'Ophthalmology', icon: <FaEye />, color: 'blue' },
    { id: 'dermatology', name: 'Dermatology', searchTerm: 'Dermatology', icon: <FaHandHoldingMedical />, color: 'orange' },
    { id: 'dentistry', name: 'Dentistry', searchTerm: 'Dentist', icon: <FaTooth />, color: 'cyan' },
    { id: 'surgery', name: 'Surgery', searchTerm: 'Surgery', icon: <FaProcedures />, color: 'indigo' },
  ];

  const handleSearchInputChange = (e) => {
    const { name, value } = e.target;
    setSearchParams((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDoctorSearch = async (e) => {
    if (e) {
      e.preventDefault();
    }
    setLoading(true);
    setError('');
    try {
      console.log('Searching with params:', searchParams); // Debug log
      const response = await axios.get('https://where-is-my-doctor.onrender.com/api/doctors/search', {
        params: searchParams,
      });
      console.log('Search response:', response.data); // Debug log
      setDoctors(response.data);
    } catch (err) {
      console.error('Search error:', err); // Debug log
      setError('Failed to fetch doctors');
    } finally {
      setLoading(false);
    }
  };

  const handleBookingInputChange = (e) => {
    const { name, value } = e.target;
    setBookingForm((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handlePhysioBookingInputChange = (e) => {
    const { name, value } = e.target;
    setPhysioBookingForm((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleMentalBookingInputChange = (e) => {
    const { name, value } = e.target;
    setMentalBookingForm((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleBloodBookingInputChange = (e) => {
    const { name, value } = e.target;
    setBloodBookingForm((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();

    let currentBookingForm = {};
    let currentServiceType = '';

    // Determine which form is being submitted based on the event target or a hidden input
    if (e.target.id === 'physio-form') {
      currentBookingForm = physioBookingForm;
      currentServiceType = 'physiotherapy';
    } else if (e.target.id === 'mental-form') {
      currentBookingForm = mentalBookingForm;
      currentServiceType = 'mentalHealth';
    } else if (e.target.id === 'blood-form') {
      currentBookingForm = bloodBookingForm;
      currentServiceType = 'bloodCollection';
    } else {
      setBookingError('Unknown form submission.');
      return;
    }

    // Ensure collectionLocation is set
    if (!currentBookingForm.collectionLocation) {
      currentBookingForm.collectionLocation = 'home';
    }

    const bookingData = {
      ...currentBookingForm,
      serviceType: currentServiceType,
    };

    try {
      await axios.post('https://where-is-my-doctor.onrender.com/api/bookings', bookingData);
      setBookingSuccess(true);
      setBookingError(null);
      
      // Reset the appropriate form
      if (e.target.id === 'physio-form') {
        setPhysioBookingForm({
          name: '',
          phone: '',
          email: '',
          date: '',
          time: '',
          service: 'Physiotherapy',
          message: '',
          serviceType: 'physiotherapy',
          collectionLocation: 'home',
        });
      } else if (e.target.id === 'mental-form') {
        setMentalBookingForm({
          name: '',
          phone: '',
          email: '',
          date: '',
          time: '',
          service: 'Mental Health',
          message: '',
          serviceType: 'mentalHealth',
          collectionLocation: 'home',
        });
      } else if (e.target.id === 'blood-form') {
        setBloodBookingForm({
          name: '',
          phone: '',
          email: '',
          date: '',
          time: '',
          service: '',
          message: '',
          serviceType: 'Blood Collection',
          collectionLocation: 'home',
        });
      }
    } catch (err) {
      setBookingError(err.response?.data?.message || 'Failed to submit booking.');
      setBookingSuccess(false);
    }
  };

  const handleSpecialtyClick = (specialty) => {
    const selectedSpecialtyData = specialties.find(s => s.name === specialty);
    if (selectedSpecialtyData) {
      setSelectedSpecialty(specialty);
      setSearchParams(prev => ({
        ...prev,
        specialty: selectedSpecialtyData.searchTerm
      }));
      handleDoctorSearch({ preventDefault: () => {} });
    }
  };

  return (
    <div className="relative min-h-screen">
      {/* Medical Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-blue-50 z-0">
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>

      {/* Medical Icons Background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-[0.02]">
          <div className="absolute top-[10%] left-[5%] text-6xl text-blue-400"><FaHeartbeat /></div>
          <div className="absolute top-[20%] right-[10%] text-6xl text-blue-400"><FaStethoscope /></div>
          <div className="absolute top-[40%] left-[15%] text-6xl text-blue-400"><FaPills /></div>
          <div className="absolute top-[60%] right-[20%] text-6xl text-blue-400"><FaSyringe /></div>
          <div className="absolute top-[80%] left-[25%] text-6xl text-blue-400"><FaXRay /></div>
          <div className="absolute top-[30%] right-[30%] text-6xl text-blue-400"><FaWheelchair /></div>
          <div className="absolute top-[70%] left-[35%] text-6xl text-blue-400"><FaUserMd /></div>
          <div className="absolute top-[50%] right-[40%] text-6xl text-blue-400"><FaHeart /></div>
        </div>
      </div>

      {/* Medical Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80")',
          opacity: '0.03'
        }}
      />

      {/* Content Container */}
      <div className="relative z-10">
        {/* Hero Section with Search */}
        <div className="bg-gradient-to-r from-blue-50 via-blue-100 to-blue-50 text-gray-800 py-12 md:py-20 px-4 relative overflow-hidden">
          {/* Animated Medical Icons - Hide on mobile */}
          <div className="absolute inset-0 overflow-hidden hidden md:block">
            <div className="absolute top-0 left-0 w-full h-full">
              <div className="absolute top-[5%] left-[5%] animate-float-slow text-4xl text-blue-200"><FaHeartbeat /></div>
              <div className="absolute top-[15%] right-[10%] animate-float text-4xl text-blue-200"><FaStethoscope /></div>
              <div className="absolute top-[35%] left-[15%] animate-float-slow text-4xl text-blue-200"><FaPills /></div>
              <div className="absolute top-[55%] right-[20%] animate-float text-4xl text-blue-200"><FaSyringe /></div>
              <div className="absolute top-[75%] left-[25%] animate-float-slow text-4xl text-blue-200"><FaXRay /></div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto relative">
            <div className="text-center mb-8 md:mb-12">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4 bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">Find Your Perfect Doctor</h1>
              <p className="text-lg md:text-xl text-gray-600">Expert healthcare professionals at your service</p>
            </div>

            {/* Specialty Cards */}
            <div className="mb-8 md:mb-12">
              <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 md:mb-6 text-center">Browse by Specialty</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
                {specialties.map((specialty) => (
                  <button
                    key={specialty.id}
                    onClick={() => handleSpecialtyClick(specialty.name)}
                    className={`p-3 md:p-4 rounded-xl bg-white/80 backdrop-blur-sm border border-${specialty.color}-100 hover:border-${specialty.color}-300 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg group ${
                      selectedSpecialty === specialty.name ? `ring-2 ring-${specialty.color}-400` : ''
                    }`}
                  >
                    <div className={`text-2xl md:text-3xl text-${specialty.color}-500 mb-1 md:mb-2 group-hover:scale-110 transition-transform duration-300`}>
                      {specialty.icon}
                    </div>
                    <h3 className={`text-sm md:text-base text-${specialty.color}-700 font-semibold`}>{specialty.name}</h3>
                  </button>
                ))}
              </div>
            </div>

            {/* Enhanced Search Card */}
            <div className="max-w-4xl mx-auto">
              <form onSubmit={handleDoctorSearch} className="bg-white/80 backdrop-blur-sm p-4 md:p-8 rounded-2xl shadow-xl border border-blue-100 transform hover:scale-[1.01] transition-all duration-300">
                <h2 className="text-xl md:text-2xl font-bold text-blue-600 mb-4 md:mb-6 flex items-center gap-2">
                  <FaSearch className="text-blue-500" /> Find Your Doctor
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-4 md:mb-6">
                  <div className="relative group">
                    <label className="block text-sm font-medium text-gray-600 mb-1">Symptoms</label>
                    <span className="absolute left-3 top-9 text-gray-400 group-hover:text-blue-400 transition-colors"><FaSearch /></span>
                    <input
                      type="text"
                      name="symptoms"
                      value={searchParams.symptoms}
                      onChange={handleSearchInputChange}
                      className="w-full py-2 md:py-3 pl-10 pr-4 rounded-lg border border-gray-200 focus:border-blue-400 focus:ring-blue-400 shadow-sm outline-none transition-all duration-300 bg-white/50 backdrop-blur-sm text-sm md:text-base"
                      placeholder="e.g. bone pain, fever"
                    />
                  </div>
                  <div className="relative group">
                    <label className="block text-sm font-medium text-gray-600 mb-1">Location</label>
                    <span className="absolute left-3 top-9 text-gray-400 group-hover:text-blue-400 transition-colors"><FaMapMarkerAlt /></span>
                    <input
                      type="text"
                      name="location"
                      value={searchParams.location}
                      onChange={handleSearchInputChange}
                      className="w-full py-2 md:py-3 pl-10 pr-4 rounded-lg border border-gray-200 focus:border-blue-400 focus:ring-blue-400 shadow-sm outline-none transition-all duration-300 bg-white/50 backdrop-blur-sm text-sm md:text-base"
                      placeholder="e.g. Simurali, Kolkata"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-4 md:mb-6">
                  <div className="relative group">
                    <label className="block text-sm font-medium text-gray-600 mb-1">Specialty</label>
                    <span className="absolute left-3 top-9 text-gray-400 group-hover:text-blue-400 transition-colors"><FaStethoscope /></span>
                    <input
                      type="text"
                      name="specialty"
                      value={searchParams.specialty}
                      onChange={handleSearchInputChange}
                      className="w-full py-2 md:py-3 pl-10 pr-4 rounded-lg border border-gray-200 focus:border-blue-400 focus:ring-blue-400 shadow-sm outline-none transition-all duration-300 bg-white/50 backdrop-blur-sm text-sm md:text-base"
                      placeholder="e.g. Cardiologist, Dentist"
                    />
                  </div>
                  <div className="relative group">
                    <label className="block text-sm font-medium text-gray-600 mb-1">Doctor Name</label>
                    <span className="absolute left-3 top-9 text-gray-400 group-hover:text-blue-400 transition-colors"><FaUser /></span>
                    <input
                      type="text"
                      name="doctorName"
                      value={searchParams.doctorName}
                      onChange={handleSearchInputChange}
                      className="w-full py-2 md:py-3 pl-10 pr-4 rounded-lg border border-gray-200 focus:border-blue-400 focus:ring-blue-400 shadow-sm outline-none transition-all duration-300 bg-white/50 backdrop-blur-sm text-sm md:text-base"
                      placeholder="e.g. Dr. Sharma"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-400 to-blue-300 text-white py-2 md:py-3 px-4 rounded-lg text-base md:text-lg font-semibold hover:from-blue-500 hover:to-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  <FaSearch className="text-lg md:text-xl" />
                  <span>Search Doctors</span>
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Rest of the content */}
        <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
          {/* Doctor List */}
          {loading ? (
            <div className="text-center text-base md:text-lg">Loading...</div>
          ) : error ? (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm md:text-base">{error}</div>
          ) : doctors.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 mb-8 md:mb-12">
              {doctors.map((doctor) => (
                <div key={doctor._id} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-4 md:p-6 flex flex-col justify-between border border-blue-100 hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]">
                  <div>
                    <h2 className="text-lg md:text-xl font-bold text-blue-600 flex items-center gap-2 mb-1">
                      <FaUser /> {doctor.name}
                    </h2>
                    <span className="inline-block bg-blue-50 text-blue-600 text-xs px-2 py-1 rounded-full mb-2">
                      {doctor.specialty}
                    </span>
                    <p className="text-sm md:text-base text-gray-600 mb-1 flex items-center">
                      <FaHospital className="mr-1" /> {doctor.hospitalName}
                    </p>
                    <p className="text-sm md:text-base text-gray-500 mb-1">{doctor.address}, {doctor.city}, {doctor.state}</p>
                    <p className="text-sm md:text-base text-gray-500 mb-1 flex items-center">
                      <FaPhoneAlt className="mr-1" /> {doctor.phone}
                    </p>
                    <p className="text-sm md:text-base text-gray-500 mb-1 flex items-center">
                      <FaMoneyBillWave className="mr-1" /> Fees: <span className="font-semibold ml-1">₹{doctor.fees}</span>
                    </p>
                    <p className="text-sm md:text-base text-gray-500 mb-1 flex items-center">
                      <FaCalendarAlt className="mr-1" /> {doctor.availability}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {doctor.symptomsTreated && doctor.symptomsTreated.map((sym, idx) => (
                        <span key={idx} className="bg-blue-50 text-blue-600 text-xs px-2 py-1 rounded-full">
                          {sym}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-600 py-6 md:py-8 text-sm md:text-base">
              {selectedSpecialty ? `No doctors found for ${selectedSpecialty}` : 'No doctors found. Try adjusting your search criteria.'}
            </div>
          )}

          {/* Physiotherapy Services */}
          <div className="mb-12">
            <div className="flex items-center mb-6">
              <div className="w-10 h-1 bg-green-600 rounded-full mr-4"></div>
              <h2 className="text-3xl font-bold text-green-800">Physiotherapy Services</h2>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-xl border-t-4 border-green-500">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <div className="text-green-500 text-5xl mb-4">
                    <FaStethoscope />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">Professional Physiotherapy</h3>
                  <p className="text-gray-600 mb-4">Our licensed physiotherapists provide personalized care to help you recover from injuries and improve your physical well-being.</p>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-center"><span className="bg-green-100 p-1 rounded-full mr-2">✓</span> Injury Rehabilitation</li>
                    <li className="flex items-center"><span className="bg-green-100 p-1 rounded-full mr-2">✓</span> Sports Therapy</li>
                    <li className="flex items-center"><span className="bg-green-100 p-1 rounded-full mr-2">✓</span> Post-Surgery Recovery</li>
                    <li className="flex items-center"><span className="bg-green-100 p-1 rounded-full mr-2">✓</span> Chronic Pain Management</li>
                  </ul>
                  <div className="flex items-center text-gray-600 mb-4">
                    <FaPhoneAlt className="mr-2 text-green-500" />
                    <span>Call us: <span className="font-semibold">+91 9876543210</span></span>
                  </div>
                </div>
                <div>
                  <form onSubmit={handleBookingSubmit} id="physio-form" className="bg-gray-50 p-6 rounded-xl">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Book Your Physiotherapy Session</h3>
                    
                    {bookingSuccess && (
                      <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                        Booking request submitted successfully! We'll contact you shortly.
                      </div>
                    )}
                    
                    {bookingError && (
                      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {bookingError}
                      </div>
                    )}
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                        <input
                          type="text"
                          name="name"
                          value={physioBookingForm.name}
                          onChange={handlePhysioBookingInputChange}
                          className="w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                        <input
                          type="tel"
                          name="phone"
                          value={physioBookingForm.phone}
                          onChange={handlePhysioBookingInputChange}
                          className="w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                      <input
                        type="email"
                        name="email"
                        value={physioBookingForm.email}
                        onChange={handlePhysioBookingInputChange}
                        className="w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                        required
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Date</label>
                        <input
                          type="date"
                          name="date"
                          value={physioBookingForm.date}
                          onChange={handlePhysioBookingInputChange}
                          className="w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Time</label>
                        <input
                          type="time"
                          name="time"
                          value={physioBookingForm.time}
                          onChange={handlePhysioBookingInputChange}
                          className="w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Additional Information</label>
                      <textarea
                        name="message"
                        value={physioBookingForm.message}
                        onChange={handlePhysioBookingInputChange}
                        rows="3"
                        className="w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                        placeholder="Please describe your condition or any specific requirements"
                      ></textarea>
                    </div>
                    
                    <button
                      type="submit"
                      className="w-full bg-gradient-to-r from-green-600 to-green-500 text-white py-3 px-4 rounded-lg text-lg font-semibold hover:from-green-700 hover:to-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-300 transform hover:scale-[1.01] shadow-lg hover:shadow-xl"
                    >
                      <span className="flex items-center justify-center"><FaCalendarAlt className="mr-2" /> Book Appointment</span>
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>

          {/* Mental Health Services */}
          <div className="mb-12">
            <div className="flex items-center mb-6">
              <div className="w-10 h-1 bg-purple-600 rounded-full mr-4"></div>
              <h2 className="text-3xl font-bold text-purple-800">Mental Health Services</h2>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-xl border-t-4 border-purple-500">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <div className="text-purple-500 text-5xl mb-4">
                    <FaBrain />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">Professional Mental Health Therapy</h3>
                  <p className="text-gray-600 mb-4">Our licensed therapists provide confidential and supportive mental health services to help you navigate life's challenges and improve your well-being.</p>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-center"><span className="bg-purple-100 p-1 rounded-full mr-2">✓</span> Anxiety & Depression Treatment</li>
                    <li className="flex items-center"><span className="bg-purple-100 p-1 rounded-full mr-2">✓</span> Stress Management</li>
                    <li className="flex items-center"><span className="bg-purple-100 p-1 rounded-full mr-2">✓</span> Relationship Counseling</li>
                    <li className="flex items-center"><span className="bg-purple-100 p-1 rounded-full mr-2">✓</span> Trauma Recovery</li>
                  </ul>
                  <div className="flex items-center text-gray-600 mb-4">
                    <FaPhoneAlt className="mr-2 text-purple-500" />
                    <span>Call us: <span className="font-semibold">+91 9876543211</span></span>
                  </div>
                </div>
                <div>
                  <form onSubmit={handleBookingSubmit} id="mental-form" className="bg-gray-50 p-6 rounded-xl">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Schedule Your Therapy Session</h3>
                    
                    {bookingSuccess && (
                      <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                        Booking request submitted successfully! We'll contact you shortly.
                      </div>
                    )}
                    
                    {bookingError && (
                      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {bookingError}
                      </div>
                    )}
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                        <input
                          type="text"
                          name="name"
                          value={mentalBookingForm.name}
                          onChange={handleMentalBookingInputChange}
                          className="w-full rounded-lg border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                        <input
                          type="tel"
                          name="phone"
                          value={mentalBookingForm.phone}
                          onChange={handleMentalBookingInputChange}
                          className="w-full rounded-lg border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                      <input
                        type="email"
                        name="email"
                        value={mentalBookingForm.email}
                        onChange={handleMentalBookingInputChange}
                        className="w-full rounded-lg border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                        required
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Date</label>
                        <input
                          type="date"
                          name="date"
                          value={mentalBookingForm.date}
                          onChange={handleMentalBookingInputChange}
                          className="w-full rounded-lg border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Time</label>
                        <input
                          type="time"
                          name="time"
                          value={mentalBookingForm.time}
                          onChange={handleMentalBookingInputChange}
                          className="w-full rounded-lg border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Type of Therapy</label>
                      <select
                        name="service"
                        value={mentalBookingForm.service}
                        onChange={handleMentalBookingInputChange}
                        className="w-full rounded-lg border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                        required
                      >
                        <option value="">Select a therapy type</option>
                        <option value="anxiety">Anxiety Treatment</option>
                        <option value="depression">Depression Treatment</option>
                        <option value="stress">Stress Management</option>
                        <option value="relationship">Relationship Counseling</option>
                        <option value="trauma">Trauma Recovery</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Additional Information</label>
                      <textarea
                        name="message"
                        value={mentalBookingForm.message}
                        onChange={handleMentalBookingInputChange}
                        rows="3"
                        className="w-full rounded-lg border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                        placeholder="Please describe your concerns or any specific requirements"
                      ></textarea>
                    </div>
                    
                    <button
                      type="submit"
                      className="w-full bg-gradient-to-r from-purple-600 to-purple-500 text-white py-3 px-4 rounded-lg text-lg font-semibold hover:from-purple-700 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-300 transform hover:scale-[1.01] shadow-lg hover:shadow-xl"
                    >
                      <span className="flex items-center justify-center"><FaCalendarAlt className="mr-2" /> Schedule Session</span>
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>

          {/* Blood Collection Section */}
          <div className="mb-12">
            <div className="flex items-center mb-6">
              <div className="w-10 h-1 bg-red-600 rounded-full mr-4"></div>
              <h2 className="text-3xl font-bold text-red-800">Blood Collection & Testing</h2>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-xl border-t-4 border-red-500">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <div className="text-red-500 text-5xl mb-4">
                    <FaVial />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">Professional Blood Testing Services</h3>
                  <p className="text-gray-600 mb-4">Our certified phlebotomists provide safe and efficient blood collection services for a wide range of diagnostic tests. We offer both home collection and lab visits.</p>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-center"><span className="bg-red-100 p-1 rounded-full mr-2">✓</span> Complete Blood Count (CBC)</li>
                    <li className="flex items-center"><span className="bg-red-100 p-1 rounded-full mr-2">✓</span> Diabetes Screening</li>
                    <li className="flex items-center"><span className="bg-red-100 p-1 rounded-full mr-2">✓</span> Lipid Profile</li>
                    <li className="flex items-center"><span className="bg-red-100 p-1 rounded-full mr-2">✓</span> Thyroid Function Tests</li>
                    <li className="flex items-center"><span className="bg-red-100 p-1 rounded-full mr-2">✓</span> Liver Function Tests</li>
                  </ul>
                  <div className="flex items-center text-gray-600 mb-4">
                    <FaPhoneAlt className="mr-2 text-red-500" />
                    <span>Call us: <span className="font-semibold">+91 9876543212</span></span>
                  </div>
                </div>
                <div>
                  <form onSubmit={handleBookingSubmit} id="blood-form" className="bg-gray-50 p-6 rounded-xl">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Schedule Blood Collection</h3>
                    
                    {bookingSuccess && (
                      <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                        Booking request submitted successfully! We'll contact you shortly.
                      </div>
                    )}
                    
                    {bookingError && (
                      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {bookingError}
                      </div>
                    )}
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                        <input
                          type="text"
                          name="name"
                          value={bloodBookingForm.name}
                          onChange={handleBloodBookingInputChange}
                          className="w-full rounded-lg border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                        <input
                          type="tel"
                          name="phone"
                          value={bloodBookingForm.phone}
                          onChange={handleBloodBookingInputChange}
                          className="w-full rounded-lg border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                      <input
                        type="email"
                        name="email"
                        value={bloodBookingForm.email}
                        onChange={handleBloodBookingInputChange}
                        className="w-full rounded-lg border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                        required
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Date</label>
                        <input
                          type="date"
                          name="date"
                          value={bloodBookingForm.date}
                          onChange={handleBloodBookingInputChange}
                          className="w-full rounded-lg border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Time</label>
                        <input
                          type="time"
                          name="time"
                          value={bloodBookingForm.time}
                          onChange={handleBloodBookingInputChange}
                          className="w-full rounded-lg border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Test Type</label>
                      <select
                        name="service"
                        value={bloodBookingForm.service}
                        onChange={handleBloodBookingInputChange}
                        className="w-full rounded-lg border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                        required
                      >
                        <option value="">Select a test type</option>
                        <option value="cbc">Complete Blood Count (CBC)</option>
                        <option value="diabetes">Diabetes Screening</option>
                        <option value="lipid">Lipid Profile</option>
                        <option value="thyroid">Thyroid Function Tests</option>
                        <option value="liver">Liver Function Tests</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Collection Location</label>
                      <div className="flex items-center space-x-4">
                        <label className="inline-flex items-center">
                          <input type="radio" name="collectionLocation" value="home" checked={bloodBookingForm.collectionLocation === 'home'} onChange={handleBloodBookingInputChange} className="text-red-600 focus:ring-red-500" />
                          <span className="ml-2">Home Collection</span>
                        </label>
                        <label className="inline-flex items-center">
                          <input type="radio" name="collectionLocation" value="lab" checked={bloodBookingForm.collectionLocation === 'lab'} onChange={handleBloodBookingInputChange} className="text-red-600 focus:ring-red-500" />
                          <span className="ml-2">Visit Lab</span>
                        </label>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Additional Information</label>
                      <textarea
                        name="message"
                        value={bloodBookingForm.message}
                        onChange={handleBloodBookingInputChange}
                        rows="3"
                        className="w-full rounded-lg border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                        placeholder="Please provide your address for home collection or any specific requirements"
                      ></textarea>
                    </div>
                    
                    <button
                      type="submit"
                      className="w-full bg-gradient-to-r from-red-600 to-red-500 text-white py-3 px-4 rounded-lg text-lg font-semibold hover:from-red-700 hover:to-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-300 transform hover:scale-[1.01] shadow-lg hover:shadow-xl"
                    >
                      <span className="flex items-center justify-center"><FaCalendarAlt className="mr-2" /> Schedule Collection</span>
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Add these styles to your CSS or Tailwind config
const styles = `
@keyframes float {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
  100% { transform: translateY(0px); }
}

@keyframes float-slow {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

.animate-float-slow {
  animation: float-slow 8s ease-in-out infinite;
}
`;

export default Home;
