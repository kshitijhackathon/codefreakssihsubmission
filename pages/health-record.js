import { useState, useEffect } from 'react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import { HiOutlineSearch, HiOutlineUpload, HiOutlineDocumentText, HiOutlineUser, HiOutlineCalendar, HiOutlineX } from 'react-icons/hi';

// Client-side database import
let nabhaGramDB;
if (typeof window !== 'undefined') {
  nabhaGramDB = require('../lib/nabhaGramDatabase').default;
}

export default function HealthRecord() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [healthRecords, setHealthRecords] = useState([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadData, setUploadData] = useState({
    recordType: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    file: null
  });
  const router = useRouter();

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

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!selectedPatient || !uploadData.recordType || !uploadData.description) return;

    const newRecord = {
      id: Date.now().toString(),
      type: uploadData.recordType,
      description: uploadData.description,
      date: uploadData.date,
      uploadedAt: new Date().toISOString(),
      fileName: uploadData.file ? uploadData.file.name : 'No file'
    };

    if (typeof window !== 'undefined' && nabhaGramDB) {
      nabhaGramDB.saveHealthRecord(selectedPatient.id, newRecord);
      // Refresh health records
      const completeData = nabhaGramDB.getCompleteHealthData(selectedPatient.id);
      setHealthRecords(completeData.healthRecords || []);
    }

    setUploadData({
      recordType: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
      file: null
    });
    setShowUploadModal(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">Health Records</h1>
            <button 
              onClick={() => router.push('/')}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-semibold"
            >
              Back to Home
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          {/* Search Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Search Your Records</h2>
            <form onSubmit={handleSearch} className="flex gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Enter your NabhaGram ID, Name, Mobile, Aadhaar, or Village"
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
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Search Results</h3>
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
                        <h4 className="font-semibold text-gray-800">{patient.fullName}</h4>
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
            <div className="space-y-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-green-800 mb-2">Patient Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        <p className="text-sm text-gray-600">Village</p>
                        <p className="font-semibold text-gray-800">{selectedPatient.village}</p>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowUploadModal(true)}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold flex items-center gap-2"
                  >
                    <HiOutlineUpload className="w-4 h-4" />
                    Upload Record
                  </button>
                </div>
              </div>

              {/* Health Records */}
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Health Records</h3>
                {healthRecords.length > 0 ? (
                  <div className="space-y-4">
                    {healthRecords.map((record) => (
                      <div key={record.id} className="bg-white border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold text-gray-800">{record.type}</h4>
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
                    <p>No health records found. Upload your first record!</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-800">Upload Health Record</h3>
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <HiOutlineX className="w-6 h-6 text-gray-500" />
                </button>
              </div>
              
              <form onSubmit={handleUploadSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Record Type</label>
                  <select
                    value={uploadData.recordType}
                    onChange={(e) => setUploadData({...uploadData, recordType: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select record type</option>
                    <option value="Prescription">Prescription</option>
                    <option value="Lab Report">Lab Report</option>
                    <option value="X-Ray">X-Ray</option>
                    <option value="Blood Test">Blood Test</option>
                    <option value="ECG">ECG</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={uploadData.description}
                    onChange={(e) => setUploadData({...uploadData, description: e.target.value})}
                    placeholder="Describe the health record..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows="3"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                  <input
                    type="date"
                    value={uploadData.date}
                    onChange={(e) => setUploadData({...uploadData, date: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">File (Optional)</label>
                  <input
                    type="file"
                    onChange={(e) => setUploadData({...uploadData, file: e.target.files[0]})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowUploadModal(false)}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                  >
                    Upload Record
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common']))
    }
  };
}