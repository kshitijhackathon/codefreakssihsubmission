import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { HiOutlineSearch, HiOutlinePencil, HiOutlineX, HiOutlineUser, HiOutlineDocumentText, HiOutlineCalendar } from 'react-icons/hi';

// Client-side database import
let nabhaGramDB;
if (typeof window !== 'undefined') {
  nabhaGramDB = require('../lib/nabhaGramDatabase').default;
}

const ManageDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [name, setName] = useState('');
  const [specialty, setSpecialty] = useState('');

  const fetchDoctors = async () => {
    const res = await fetch('/api/doctors');
    setDoctors(await res.json());
  };

  useEffect(() => { fetchDoctors(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    await fetch('/api/doctors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, specialty }),
    });
    setName('');
    setSpecialty('');
    fetchDoctors();
  };

  const handleRemove = async (id) => {
    await fetch('/api/doctors', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    fetchDoctors();
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
      <div>
        <h3>Add Doctor</h3>
        <form onSubmit={handleAdd}>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" required style={{ width: '100%', padding: '8px', marginBottom: '10px' }} />
          <input value={specialty} onChange={(e) => setSpecialty(e.target.value)} placeholder="Specialty" required style={{ width: '100%', padding: '8px', marginBottom: '10px' }} />
          <button type="submit" style={{ width: '100%', padding: '10px', background: '#dc2626', color: 'white', border: 'none', borderRadius: '6px' }}>Add Doctor</button>
        </form>
      </div>
      <div>
        <h3>Current Doctors</h3>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {doctors.map(doc => (
            <li key={doc.id} style={{ background: '#f9fafb', padding: '10px', borderRadius: '6px', marginBottom: '10px', display: 'flex', justifyContent: 'space-between' }}>
              <span>{doc.name} - {doc.specialty}</span>
              <button onClick={() => handleRemove(doc.id)} style={{ background: '#fee2e2', color: '#b91c1c', border: 'none', padding: '5px 10px', borderRadius: '4px' }}>Remove</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const ManageHospitals = () => {
  const [hospitals, setHospitals] = useState([]);
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [editingHospitals, setEditingHospitals] = useState({});

  const fetchHospitals = async () => {
    const res = await fetch('/api/hospitals');
    const data = await res.json();
    setHospitals(data);
    const initialEditingState = data.reduce((acc, h) => {
      acc[h.id] = { bedsAvailable: h.bedsAvailable || 0, facilities: h.facilities || '' };
      return acc;
    }, {});
    setEditingHospitals(initialEditingState);
  };

  useEffect(() => { fetchHospitals(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    await fetch('/api/hospitals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, address }),
    });
    setName('');
    setAddress('');
    fetchHospitals();
  };

  const handleRemove = async (id) => {
    await fetch('/api/hospitals', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    fetchHospitals();
  };

  const handleHospitalChange = (id, field, value) => {
    setEditingHospitals(prev => ({
      ...prev,
      [id]: { ...prev[id], [field]: value }
    }));
  };

  const handleUpdateHospital = async (id) => {
    const hospitalData = editingHospitals[id];
    const bedsAvailable = parseInt(hospitalData.bedsAvailable, 10);
    if (isNaN(bedsAvailable)) {
      alert('Please enter a valid number for beds.');
      return;
    }
    await fetch('/api/hospitals', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, bedsAvailable, facilities: hospitalData.facilities }),
    });
    alert('Hospital details updated successfully!');
    fetchHospitals();
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '40px' }}>
      <div>
        <h3>Add Hospital</h3>
        <form onSubmit={handleAdd}>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Hospital Name" required style={{ width: '100%', padding: '8px', marginBottom: '10px' }} />
          <input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Address" required style={{ width: '100%', padding: '8px', marginBottom: '10px' }} />
          <button type="submit" style={{ width: '100%', padding: '10px', background: '#dc2626', color: 'white', border: 'none', borderRadius: '6px' }}>Add Hospital</button>
        </form>
      </div>
      <div>
        <h3>Current Hospitals</h3>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {hospitals.map(h => (
            <li key={h.id} style={{ background: '#f9fafb', padding: '15px', borderRadius: '8px', marginBottom: '15px' }}>
              <p style={{ margin: '0 0 10px 0', fontWeight: 'bold' }}>{h.name} - {h.address}</p>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <input
                  type="number"
                  value={editingHospitals[h.id]?.bedsAvailable || ''}
                  onChange={(e) => handleHospitalChange(h.id, 'bedsAvailable', e.target.value)}
                  style={{ width: '80px', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                  placeholder="Beds"
                />
                <input
                  type="text"
                  value={editingHospitals[h.id]?.facilities || ''}
                  onChange={(e) => handleHospitalChange(h.id, 'facilities', e.target.value)}
                  style={{ flex: 1, padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                  placeholder="Facilities (e.g., ICU, Emergency)"
                />
                <button onClick={() => handleUpdateHospital(h.id)} style={{ background: '#dbeafe', color: '#1e40af', border: 'none', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer' }}>Save</button>
                <button onClick={() => handleRemove(h.id)} style={{ background: '#fee2e2', color: '#b91c1c', border: 'none', padding: '8px 12px', borderRadius: '4px' }}>Remove</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const ManageAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [editingApt, setEditingApt] = useState(null);

  const fetchData = async () => {
    const [aptRes, docRes] = await Promise.all([fetch('/api/appointments'), fetch('/api/doctors')]);
    setAppointments(await aptRes.json());
    setDoctors(await docRes.json());
  };

  useEffect(() => { fetchData(); }, []);

  const handleCancel = async (id) => {
    if (confirm('Are you sure you want to cancel this appointment?')) {
      await fetch('/api/appointments', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      fetchData();
    }
  };

  const handleEdit = (appointment) => {
    setEditingApt({ ...appointment });
  };

  const handleSave = async () => {
    if (!editingApt) return;
    await fetch('/api/appointments', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editingApt),
    });
    setEditingApt(null);
    fetchData();
  };

  const handleFieldChange = (e) => {
    setEditingApt({ ...editingApt, [e.target.name]: e.target.value });
  };

  return (
    <div>
      <h3>All Appointments</h3>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {appointments.map(apt => (
          <li key={apt.id} style={{ background: '#f9fafb', padding: '15px', borderRadius: '8px', marginBottom: '15px' }}>
            {editingApt && editingApt.id === apt.id ? (
              <div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '10px' }}>
                  <input type="date" name="date" value={editingApt.date} onChange={handleFieldChange} style={{ padding: '8px' }} />
                  <input type="time" name="time" value={editingApt.time} onChange={handleFieldChange} style={{ padding: '8px' }} />
                  <select name="doctor" value={editingApt.doctor} onChange={handleFieldChange} style={{ padding: '8px' }}>
                    {doctors.map(doc => <option key={doc.id} value={doc.name}>{doc.name}</option>)}
                  </select>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <button onClick={() => setEditingApt(null)} style={{ marginRight: '10px', padding: '8px 12px', border: '1px solid #ccc', borderRadius: '4px' }}>Cancel</button>
                  <button onClick={handleSave} style={{ padding: '8px 12px', background: '#22c55e', color: 'white', border: 'none', borderRadius: '4px' }}>Save Changes</button>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ margin: 0 }}><strong>Patient:</strong> {apt.patientName} (Token: {apt.token})</p>
                  <p style={{ margin: '5px 0 0' }}><strong>With:</strong> {apt.doctor} on {apt.date} at {apt.time}</p>
                </div>
                <div>
                  <button onClick={() => handleEdit(apt)} style={{ marginRight: '10px', background: '#e0e7ff', color: '#4338ca', border: 'none', padding: '5px 10px', borderRadius: '4px' }}>Edit / Reschedule</button>
                  <button onClick={() => handleCancel(apt.id)} style={{ background: '#fee2e2', color: '#b91c1c', border: 'none', padding: '5px 10px', borderRadius: '4px' }}>Cancel</button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

const CheckPatientDetails = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [healthRecords, setHealthRecords] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState({});

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    if (typeof window !== 'undefined' && nabhaGramDB) {
      const results = nabhaGramDB.searchNabhaGramID(searchQuery);
      setSearchResults(results);
    }
  };

  const handleSelectPatient = (patient) => {
    setSelectedPatient(patient);
    if (typeof window !== 'undefined' && nabhaGramDB) {
      const completeData = nabhaGramDB.getCompleteHealthData(patient.id);
      setHealthRecords(completeData.healthRecords || []);
    }
  };

  const handleEditClick = () => {
    if (selectedPatient) {
      setEditData({
        firstName: selectedPatient.firstName,
        fullName: selectedPatient.fullName,
        mobile: selectedPatient.mobile,
        aadhaar: selectedPatient.aadhaar,
        village: selectedPatient.village
      });
      setShowEditModal(true);
    }
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!selectedPatient) return;

    if (typeof window !== 'undefined' && nabhaGramDB) {
      const updatedPatient = nabhaGramDB.updatePatientInfo(selectedPatient.id, editData);
      if (updatedPatient) {
        setSelectedPatient(updatedPatient);
        alert('Patient information updated successfully!');
        setShowEditModal(false);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Search Patient Details</h3>
        <form onSubmit={handleSearch} className="flex gap-4">
          <div className="flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Enter NabhaGram ID, Name, Mobile, Aadhaar, or Village"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center gap-2"
          >
            <HiOutlineSearch className="w-5 h-5" />
            Search
          </button>
        </form>
      </div>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div>
          <h4 className="text-lg font-semibold text-gray-800 mb-4">Search Results</h4>
          <div className="space-y-3">
            {searchResults.map((patient) => (
              <div
                key={patient.id}
                onClick={() => handleSelectPatient(patient)}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedPatient?.id === patient.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h5 className="font-semibold text-gray-800">{patient.fullName}</h5>
                    <p className="text-sm text-gray-600">ID: {patient.id}</p>
                    <p className="text-sm text-gray-600">Mobile: {patient.mobile}</p>
                    <p className="text-sm text-gray-600">Village: {patient.village}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Created: {new Date(patient.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Selected Patient Details */}
      {selectedPatient && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex justify-between items-start mb-6">
            <h4 className="text-xl font-bold text-gray-800">Patient Information</h4>
            <button
              onClick={handleEditClick}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center gap-2"
            >
              <HiOutlinePencil className="w-4 h-4" />
              Edit Details
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <p className="text-sm text-gray-600">First Name</p>
              <p className="font-semibold text-gray-800">{selectedPatient.firstName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Full Name</p>
              <p className="font-semibold text-gray-800">{selectedPatient.fullName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">NabhaGram ID</p>
              <p className="font-semibold text-gray-800">{selectedPatient.id}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Mobile Number</p>
              <p className="font-semibold text-gray-800">{selectedPatient.mobile}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Aadhaar Number</p>
              <p className="font-semibold text-gray-800">{selectedPatient.aadhaar}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Village</p>
              <p className="font-semibold text-gray-800">{selectedPatient.village}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Created Date</p>
              <p className="font-semibold text-gray-800">{new Date(selectedPatient.createdAt).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Last Updated</p>
              <p className="font-semibold text-gray-800">{new Date(selectedPatient.updatedAt || selectedPatient.createdAt).toLocaleDateString()}</p>
            </div>
          </div>

          {/* Health Records */}
          <div>
            <h5 className="text-lg font-semibold text-gray-800 mb-4">Health Records</h5>
            {healthRecords.length > 0 ? (
              <div className="space-y-4">
                {healthRecords.map((record) => (
                  <div key={record.id} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h6 className="font-semibold text-gray-800">{record.type}</h6>
                      <span className="text-sm text-gray-500">
                        {new Date(record.date).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-2">{record.description}</p>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <HiOutlineDocumentText className="w-4 h-4" />
                      <span>Uploaded: {new Date(record.uploadedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <HiOutlineDocumentText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No health records found for this patient.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-800">Edit Patient Information</h3>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <HiOutlineX className="w-6 h-6 text-gray-500" />
                </button>
              </div>
              
              <form onSubmit={handleEditSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                  <input
                    type="text"
                    value={editData.firstName || ''}
                    onChange={(e) => setEditData({...editData, firstName: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    value={editData.fullName || ''}
                    onChange={(e) => setEditData({...editData, fullName: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Mobile Number</label>
                  <input
                    type="tel"
                    value={editData.mobile || ''}
                    onChange={(e) => setEditData({...editData, mobile: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Aadhaar Number</label>
                  <input
                    type="text"
                    value={editData.aadhaar || ''}
                    onChange={(e) => setEditData({...editData, aadhaar: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Village</label>
                  <input
                    type="text"
                    value={editData.village || ''}
                    onChange={(e) => setEditData({...editData, village: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      <HiOutlineUser className="w-5 h-5 text-yellow-600 mt-0.5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-yellow-800 mb-1">Important Note</h4>
                      <p className="text-sm text-yellow-700">
                        This will permanently update the patient&apos;s information in the database. 
                        Please verify all details before submitting.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                  >
                    Update Patient Information
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default function SuperAdmin() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('doctors');
  const tabStyle = { padding: '10px 20px', cursor: 'pointer', borderBottom: '2px solid transparent' };
  const activeTabStyle = { ...tabStyle, borderBottom: '2px solid #dc2626', fontWeight: 'bold' };

  return (
    <div>
      <header style={{ background: 'white', padding: '15px 30px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ color: '#dc2626', fontSize: '24px', margin: 0 }}>Super Admin Dashboard</h1>
        <button onClick={() => router.push('/')} style={{ padding: '10px 20px', background: '#e5e7eb', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Back to Home</button>
      </header>
      <main style={{ padding: '40px', maxWidth: '1000px', margin: '40px auto' }}>
        <div style={{ borderBottom: '1px solid #e5e7eb', marginBottom: '30px' }}>
          <nav style={{ display: 'flex' }}>
            <div onClick={() => setActiveTab('doctors')} style={activeTab === 'doctors' ? activeTabStyle : tabStyle}>Manage Doctors</div>
            <div onClick={() => setActiveTab('hospitals')} style={activeTab === 'hospitals' ? activeTabStyle : tabStyle}>Manage Hospitals</div>
            <div onClick={() => setActiveTab('appointments')} style={activeTab === 'appointments' ? activeTabStyle : tabStyle}>Manage Appointments</div>
            <div onClick={() => setActiveTab('patients')} style={activeTab === 'patients' ? activeTabStyle : tabStyle}>Check Patient Details</div>
          </nav>
        </div>
        <div>
          {activeTab === 'doctors' && <ManageDoctors />}
          {activeTab === 'hospitals' && <ManageHospitals />}
          {activeTab === 'appointments' && <ManageAppointments />}
          {activeTab === 'patients' && <CheckPatientDetails />}
        </div>
      </main>
    </div>
  );
}