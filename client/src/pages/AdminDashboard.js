import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { FaUserMd, FaPlus, FaEdit, FaTrash, FaHospital, FaPhone, FaMoneyBillWave, FaCalendarAlt, FaTimes, FaWalking, FaBrain, FaVial, FaCheck, FaTimesCircle, FaSpinner } from 'react-icons/fa';

const AdminDashboard = () => {
  // Doctor management state
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    specialty: '',
    symptomsTreated: '',
    hospitalName: '',
    address: '',
    city: '',
    state: '',
    phone: '',
    fees: '',
    availability: ''
  });
  
  // Booking management state
  const [bookings, setBookings] = useState([]);
  const [bookingsLoading, setBookingsLoading] = useState(true);
  const [bookingsError, setBookingsError] = useState('');
  const [activeTab, setActiveTab] = useState('doctors'); // 'doctors', 'physiotherapy', 'mentalHealth', 'bloodCollection'
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);

  const { token } = useAuth();

  useEffect(() => {
    fetchDoctors();
    fetchBookings();
  }, []);
  
  // Watch for tab changes to fetch appropriate data
  useEffect(() => {
    if (activeTab === 'doctors') {
      fetchDoctors();
    } else {
      fetchBookingsByType(activeTab);
    }
  }, [activeTab]);

  const fetchDoctors = async () => {
    try {
      const response = await axios.get('https://where-is-my-doctor.onrender.com/api/doctors');
      setDoctors(response.data);
    } catch (err) {
      setError('Failed to fetch doctors');
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (doctor = null) => {
    setSelectedDoctor(doctor);
    setFormData(
      doctor
        ? { ...doctor, symptomsTreated: doctor.symptomsTreated.join(', ') }
        : {
            name: '',
            specialty: '',
            symptomsTreated: '',
            hospitalName: '',
            address: '',
            city: '',
            state: '',
            phone: '',
            fees: '',
            availability: ''
          }
    );
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedDoctor(null);
    setFormData({
      name: '',
      specialty: '',
      symptomsTreated: '',
      hospitalName: '',
      address: '',
      city: '',
      state: '',
      phone: '',
      fees: '',
      availability: ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const doctorData = {
        ...formData,
        symptomsTreated: formData.symptomsTreated.split(',').map(s => s.trim())
      };

      if (selectedDoctor) {
        await axios.put(
          `https://where-is-my-doctor.onrender.com/api/doctors/${selectedDoctor._id}`,
          doctorData,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
      } else {
        await axios.post(
          'https://where-is-my-doctor.onrender.com/api/doctors',
          doctorData,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
      }

      fetchDoctors();
      closeModal();
    } catch (err) {
      setError('Failed to save doctor');
      console.error('Save error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this doctor?')) return;

    try {
      await axios.delete(`https://where-is-my-doctor.onrender.com/api/doctors/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchDoctors();
    } catch (err) {
      setError('Failed to delete doctor');
      console.error('Delete error:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Booking management functions
  const fetchBookings = async () => {
    try {
      setBookingsLoading(true);
      setBookingsError('');
      const response = await axios.get('https://where-is-my-doctor.onrender.com/api/bookings', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBookings(response.data);
    } catch (err) {
      setBookingsError('Failed to fetch bookings');
      console.error('Fetch bookings error:', err);
    } finally {
      setBookingsLoading(false);
    }
  };
  
  const fetchBookingsByType = async (serviceType) => {
    try {
      setBookingsLoading(true);
      setBookingsError('');
      const response = await axios.get(`https://where-is-my-doctor.onrender.com/api/bookings/service/${serviceType}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBookings(response.data);
    } catch (err) {
      setBookingsError('Failed to fetch bookings');
      console.error('Fetch bookings error:', err);
    } finally {
      setBookingsLoading(false);
    }
  };
  
  const updateBookingStatus = async (id, status) => {
    try {
      await axios.put(`https://where-is-my-doctor.onrender.com/api/bookings/${id}/status`, 
        { status },
        { headers: { Authorization: `Bearer ${token}` }}
      );
      
      // Refresh bookings list
      if (activeTab === 'doctors') {
        fetchBookings();
      } else {
        fetchBookingsByType(activeTab);
      }
    } catch (err) {
      setBookingsError('Failed to update booking status');
      console.error('Update booking status error:', err);
    }
  };
  
  const deleteBooking = async (id) => {
    if (!window.confirm('Are you sure you want to delete this booking?')) return;
    
    try {
      await axios.delete(`https://where-is-my-doctor.onrender.com/api/bookings/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Refresh bookings list
      if (activeTab === 'doctors') {
        fetchBookings();
      } else {
        fetchBookingsByType(activeTab);
      }
    } catch (err) {
      setBookingsError('Failed to delete booking');
      console.error('Delete booking error:', err);
    }
  };
  
  // Helper function to format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg p-6 flex flex-col gap-4 sticky top-0 h-screen">
        <div className="flex items-center gap-3 mb-6">
          <FaUserMd className="text-blue-600 text-3xl" />
          <span className="text-2xl font-bold text-blue-700">Admin</span>
        </div>
        
        {/* Navigation */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">Management</h3>
          <nav className="flex flex-col gap-2">
            <button 
              onClick={() => setActiveTab('doctors')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${activeTab === 'doctors' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              <FaUserMd /> Doctors
            </button>
            <button 
              onClick={() => setActiveTab('physiotherapy')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${activeTab === 'physiotherapy' ? 'bg-green-100 text-green-700' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              <FaWalking /> Physiotherapy
            </button>
            <button 
              onClick={() => setActiveTab('mentalHealth')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${activeTab === 'mentalHealth' ? 'bg-purple-100 text-purple-700' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              <FaBrain /> Mental Health
            </button>
            <button 
              onClick={() => setActiveTab('bloodCollection')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${activeTab === 'bloodCollection' ? 'bg-red-100 text-red-700' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              <FaVial /> Blood Collection
            </button>
          </nav>
        </div>
        
        {activeTab === 'doctors' && (
          <button
            onClick={() => openModal()}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            <FaPlus /> Add Doctor
          </button>
        )}
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        {activeTab === 'doctors' ? (
          <>
            <h1 className="text-3xl font-bold mb-8 text-blue-700 flex items-center gap-2">
              <FaUserMd /> Doctor Management
            </h1>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            {/* Doctor List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {loading ? (
                <div className="col-span-full text-center text-lg">Loading...</div>
              ) : doctors.length === 0 ? (
                <div className="col-span-full text-center text-gray-500">No doctors found.</div>
              ) : (
                doctors.map(doctor => (
                  <div key={doctor._id} className="bg-white rounded-2xl shadow-lg p-6 flex flex-col justify-between border-t-4 border-blue-500 hover:shadow-2xl transition">
                    <div>
                      <h2 className="text-xl font-bold text-blue-700 flex items-center gap-2 mb-1"><FaUserMd /> {doctor.name}</h2>
                      <span className="inline-block bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full mb-2">{doctor.specialty}</span>
                      <p className="text-gray-600 mb-1 flex items-center"><FaHospital className="mr-1" /> {doctor.hospitalName}</p>
                      <p className="text-gray-500 mb-1">{doctor.address}, {doctor.city}, {doctor.state}</p>
                      <p className="text-gray-500 mb-1 flex items-center"><FaPhone className="mr-1" /> {doctor.phone}</p>
                      <p className="text-gray-500 mb-1 flex items-center"><FaMoneyBillWave className="mr-1" /> Fees: <span className="font-semibold ml-1">₹{doctor.fees}</span></p>
                      <p className="text-gray-500 mb-1 flex items-center"><FaCalendarAlt className="mr-1" /> {doctor.availability}</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {doctor.symptomsTreated && doctor.symptomsTreated.map((sym, idx) => (
                          <span key={idx} className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full">{sym}</span>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={() => openModal(doctor)}
                        className="flex-1 flex items-center justify-center gap-1 bg-yellow-100 text-yellow-700 px-3 py-2 rounded-lg font-semibold hover:bg-yellow-200 transition"
                      >
                        <FaEdit /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(doctor._id)}
                        className="flex-1 flex items-center justify-center gap-1 bg-red-100 text-red-700 px-3 py-2 rounded-lg font-semibold hover:bg-red-200 transition"
                      >
                        <FaTrash /> Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        ) : (
          <>
            {/* Booking Management */}
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-3xl font-bold text-gray-800">
                {activeTab === 'physiotherapy' && (
                  <span className="flex items-center gap-2">
                    <FaWalking className="text-green-600" /> Physiotherapy Bookings
                  </span>
                )}
                {activeTab === 'mentalHealth' && (
                  <span className="flex items-center gap-2">
                    <FaBrain className="text-purple-600" /> Mental Health Bookings
                  </span>
                )}
                {activeTab === 'bloodCollection' && (
                  <span className="flex items-center gap-2">
                    <FaVial className="text-red-600" /> Blood Collection Bookings
                  </span>
                )}
              </h1>
            </div>
            
            {bookingsError && <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">{bookingsError}</div>}
            
            {/* Bookings List */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service Type</th>
                    {activeTab === 'bloodCollection' && (
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Collection Location</th>
                    )}
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Message</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {bookingsLoading ? (
                    <tr>
                      <td colSpan="8" className="px-6 py-4 text-center text-gray-500">Loading...</td>
                    </tr>
                  ) : bookings.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="px-6 py-4 text-center text-gray-500">No bookings found</td>
                    </tr>
                  ) : (
                    bookings.map(booking => (
                      <tr key={booking._id}>
                        <td className="px-6 py-4 whitespace-nowrap">{booking.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>{booking.phone}</div>
                          <div className="text-sm text-gray-500">{booking.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>{formatDate(booking.date)}</div>
                          <div className="text-sm text-gray-500">{booking.time}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">{booking.serviceType}</td>
                        {activeTab === 'bloodCollection' && (
                          <td className="px-6 py-4 whitespace-nowrap">{booking.collectionLocation}</td>
                        )}
                        <td className="px-6 py-4">
                          <div className="max-w-xs truncate">{booking.message || '-'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                            ${booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : ''}
                            ${booking.status === 'cancelled' ? 'bg-red-100 text-red-800' : ''}
                            ${booking.status === 'completed' ? 'bg-blue-100 text-blue-800' : ''}
                          `}>
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex space-x-2">
                            {booking.status === 'pending' && (
                              <button
                                onClick={() => updateBookingStatus(booking._id, 'confirmed')}
                                className="text-green-600 hover:text-green-900"
                                title="Confirm Booking"
                              >
                                <FaCheck />
                              </button>
                            )}
                            {(booking.status === 'pending' || booking.status === 'confirmed') && (
                              <button
                                onClick={() => updateBookingStatus(booking._id, 'cancelled')}
                                className="text-red-600 hover:text-red-900"
                                title="Cancel Booking"
                              >
                                <FaTimesCircle />
                              </button>
                            )}
                            {booking.status === 'confirmed' && (
                              <button
                                onClick={() => updateBookingStatus(booking._id, 'completed')}
                                className="text-blue-600 hover:text-blue-900"
                                title="Mark as Completed"
                              >
                                <FaCheck />
                              </button>
                            )}
                            <button
                              onClick={() => deleteBooking(booking._id)}
                              className="text-red-600 hover:text-red-900"
                              title="Delete Booking"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
        
        {/* Modal for Add/Edit Doctor */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg relative animate-fadeIn">
              <button
                className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-2xl"
                onClick={closeModal}
              >
                <FaTimes />
              </button>
              <h2 className="text-2xl font-bold mb-6 text-blue-700 flex items-center gap-2">
                {selectedDoctor ? <FaEdit /> : <FaPlus />} {selectedDoctor ? 'Edit Doctor' : 'Add Doctor'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Specialty</label>
                  <input
                    type="text"
                    name="specialty"
                    value={formData.specialty}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Symptoms Treated (comma-separated)</label>
                  <input
                    type="text"
                    name="symptomsTreated"
                    value={formData.symptomsTreated}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Hospital Name</label>
                  <input
                    type="text"
                    name="hospitalName"
                    value={formData.hospitalName}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Address</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">City</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">State</label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Fees</label>
                  <input
                    type="number"
                    name="fees"
                    value={formData.fees}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                    placeholder="Fees (₹)"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Availability</label>
                  <input
                    type="text"
                    name="availability"
                    value={formData.availability}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="flex gap-4 pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 font-semibold transition"
                  >
                    {loading ? 'Saving...' : selectedDoctor ? 'Update Doctor' : 'Add Doctor'}
                  </button>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 font-semibold transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
