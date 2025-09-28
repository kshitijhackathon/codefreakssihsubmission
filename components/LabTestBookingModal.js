import { useState } from 'react';
import Link from 'next/link';
import { HiX as HiOutlineX, HiBeaker as HiOutlineBeaker, HiLocationMarker as HiOutlineLocationMarker, HiCurrencyRupee as HiOutlineCurrencyRupee, HiIdentification as HiOutlineIdentification, HiExclamationCircle as HiOutlineExclamationCircle, HiCheckCircle as HiOutlineCheckCircle } from 'react-icons/hi';

// Import database only on client side
let nabhaGramDB;
if (typeof window !== 'undefined') {
  nabhaGramDB = require('../lib/nabhaGramDatabase').default;
}

const VILLAGES = [
  "Abhepur", "Achal", "Ageta", "Ageti", "Agol", "Ajnoda Kalan", "Ajnoda Khurd", "Akalgarh", "Alampur", "Alipur",
  "Alohran", "Alowal", "Babarpur", "Banera Kalan", "Banera Khurd", "Barra", "Bauran Kalan", "Bauran Khurd", "Bazdri", "Bazidpur",
  "Behbalpur", "Bhari Panechan", "Bhilowal", "Bhojo Majri", "Bhore", "Biharwal", "Binaheri", "Bir Agol", "Bir Baura", "Bir Bhadson",
  "Bir Dosanjh", "Birdhanon", "Bishangarh", "Bishanpura", "Bugga Khurd", "Chaswal", "Chathe", "Chaudhri Majra", "Chehal", "Chhaju Bhatt",
  "Chhanna Nathuwali", "Dakonda", "Dandrala Dhindsa", "Dandrala Kharor", "Dewangarh", "Dhanaura", "Dhanauri (A)", "Dhanauri (G)", "Dhangera", "Dharoki",
  "Dhingi", "Dhundewal", "Dittupur", "Doda", "Duldi", "Durgapur", "Faizgarh", "Faridpur", "Fatehpur", "Gadaya",
  "Galwatti", "Ghamrauda", "Ghaniwal", "Ghanurki", "Ghunder", "Gobindgarh Chhanna", "Gobindpura", "Gujjarheri", "Gunike", "Gurditpura",
  "Hakimpura Urf Ramgarh", "Halla", "Halotali", "Hari Nagar", "Harigarh", "Hassanpur", "Hiana Kalan", "Hiana Khurd", "Ichhewal", "Jasso Majra",
  "Jatiwal", "Jhambali Khas", "Jhambali Sahni", "Jindalpur", "Kaidupur", "Kakrala", "Kaleh Majra", "Kalihana", "Kallar Majri", "Kalsana",
  "Kameli", "Kansuha Kalan", "Kansuha Khurd", "Kaul", "Khanora", "Kheri Jattan", "Khizarpur", "Khokh", "Khurd", "Kishangarh",
  "Kot Kalan", "Kot Khurd", "Kotli", "Kularan", "Ladha Heri", "Laloda", "Laut", "Lohar Majra", "Lopa", "Lubana Karmu",
  "Lubana Taku", "Malewal", "Malkon", "Mandaur", "Mangewal", "Mansurpur Urf Chhitanwala", "Matroran", "Mehas", "Mohal Gwara", "Mungo",
  "Nabha Rural", "Nanoki", "Nanowal", "Naraingarh", "Narmana", "Nauhra", "Paharpur", "Pahlian Kalan", "Pahlian Khurd", "Paidan",
  "Pedni Khurd", "Raimal Majri", "Raisal", "Rajgarh", "Rajpura", "Ram Singh Nau", "Ramgarh", "Ramgarh", "Ramgarh Chhanna", "Rampur Sahiewal",
  "Ranjitgarh", "Ranno", "Rohta", "Rohti Basta Singh", "Rohti Chhanna", "Rohti Khas", "Rohti Mauran", "Sadhoheri", "Sadnoli", "Sahauli",
  "Sakohan", "Sakrali", "Saluwala", "Sangatpura", "Sauja", "Shahpur", "Shamaspur", "Shamla", "Sheikhpura", "Shivgarh",
  "Simbro", "Sri Nagar", "Sudhewal", "Sukhewal", "Surajpur", "Tarkheri Kalan", "Tarkheri Khurd", "Thuhi", "Todarwal", "Tohra",
  "Tungan", "Udha", "Upplan"
].sort();

const LAB_TESTS = [
  { id: 1, name: "Complete Blood Count (CBC)", price: 300, description: "Full blood analysis including hemoglobin, WBC, RBC, platelets" },
  { id: 2, name: "Blood Sugar (Fasting)", price: 150, description: "Fasting blood glucose level test" },
  { id: 3, name: "Blood Sugar (Random)", price: 120, description: "Random blood glucose level test" },
  { id: 4, name: "Lipid Profile", price: 400, description: "Cholesterol, HDL, LDL, triglycerides analysis" },
  { id: 5, name: "Liver Function Test (LFT)", price: 500, description: "ALT, AST, bilirubin, protein levels" },
  { id: 6, name: "Kidney Function Test (KFT)", price: 450, description: "Creatinine, urea, uric acid levels" },
  { id: 7, name: "Thyroid Function Test (TFT)", price: 600, description: "TSH, T3, T4 hormone levels" },
  { id: 8, name: "Urine Routine Examination", price: 100, description: "Physical, chemical and microscopic analysis" },
  { id: 9, name: "Stool Examination", price: 80, description: "Parasite and bacterial analysis" },
  { id: 10, name: "Vitamin D Test", price: 800, description: "25-hydroxyvitamin D level measurement" },
  { id: 11, name: "Vitamin B12 Test", price: 700, description: "Vitamin B12 deficiency screening" },
  { id: 12, name: "HbA1c Test", price: 500, description: "3-month average blood sugar level" },
  { id: 13, name: "ECG (Electrocardiogram)", price: 200, description: "Heart rhythm and electrical activity" },
  { id: 14, name: "Chest X-Ray", price: 300, description: "Lung and heart imaging" },
  { id: 15, name: "Ultrasound Abdomen", price: 600, description: "Abdominal organ imaging" }
];

const DELIVERY_CHARGE = 20;

export default function LabTestBookingModal({ isOpen, onClose }) {
  const [selectedVillage, setSelectedVillage] = useState('');
  const [selectedTests, setSelectedTests] = useState([]);
  const [patientName, setPatientName] = useState('');
  const [patientAge, setPatientAge] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [address, setAddress] = useState('');
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [nabhaGramID, setNabhaGramID] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [validatedPatient, setValidatedPatient] = useState(null);

  const handleValidateID = async (e) => {
    e.preventDefault();
    if (!nabhaGramID.trim()) {
      setValidationError('Please enter your NabhaGram ID');
      return;
    }

    setIsValidating(true);
    setValidationError('');

    try {
      if (typeof window !== 'undefined' && nabhaGramDB) {
        const patientData = nabhaGramDB.getNabhaGramIDById(nabhaGramID);
        
        if (patientData) {
          setValidatedPatient(patientData);
          setPatientName(patientData.fullName);
          setPatientPhone(patientData.mobile);
          setSelectedVillage(patientData.village);
        } else {
          setValidationError('Invalid NabhaGram ID. Please check your ID or generate a new one.');
          setValidatedPatient(null);
        }
      } else {
        setValidationError('Service temporarily unavailable. Please try again later.');
      }
    } catch (error) {
      console.error('Validation error:', error);
      setValidationError('Error validating ID. Please try again.');
    } finally {
      setIsValidating(false);
    }
  };

  const handleTestToggle = (test) => {
    setSelectedTests(prev => 
      prev.find(t => t.id === test.id) 
        ? prev.filter(t => t.id !== test.id)
        : [...prev, test]
    );
  };

  const calculateTotal = () => {
    const testsTotal = selectedTests.reduce((sum, test) => sum + test.price, 0);
    return testsTotal + DELIVERY_CHARGE;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validatedPatient) {
      alert('Please validate your NabhaGram ID first.');
      return;
    }
    
    if (selectedTests.length === 0) {
      alert('Please select at least one test.');
      return;
    }
    
    if (!bookingDate || !bookingTime) {
      alert('Please select booking date and time.');
      return;
    }
    
    // Here you would typically send the data to your API
    console.log('Lab Test Booking:', {
      nabhaGramID: validatedPatient.id,
      patient: { 
        name: validatedPatient.fullName, 
        phone: validatedPatient.mobile,
        village: validatedPatient.village
      },
      tests: selectedTests,
      address,
      bookingDate,
      bookingTime,
      total: calculateTotal()
    });
    
    alert('Lab test booking submitted successfully! You will receive a confirmation call shortly.');
    onClose();
    
    // Reset form
    setSelectedTests([]);
    setPatientName('');
    setPatientPhone('');
    setSelectedVillage('');
    setBookingDate('');
    setBookingTime('');
    setNabhaGramID('');
    setValidatedPatient(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <HiOutlineBeaker className="w-8 h-8 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-800">Lab Test Booking</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <HiOutlineX className="w-6 h-6 text-gray-500" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* NabhaGram ID Validation Section */}
          {!validatedPatient ? (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center mb-3">
                <HiOutlineIdentification className="w-5 h-5 text-yellow-600 mr-2" />
                <h3 className="text-lg font-semibold text-yellow-800">NabhaGram ID Required</h3>
              </div>
              <p className="text-sm text-yellow-700 mb-3">
                Please enter your NabhaGram ID to book lab tests. If you don&apos;t have one, 
                <Link href="/" className="text-green-600 underline ml-1">generate it here</Link>.
              </p>
              
              <form onSubmit={handleValidateID} className="flex gap-3 items-end">
                <div className="flex-1">
                  <input 
                    type="text" 
                    value={nabhaGramID} 
                    onChange={(e) => setNabhaGramID(e.target.value.toUpperCase())} 
                    placeholder="e.g., NBHABC2025000001"
                    required 
                    className={`w-full px-3 py-2 border rounded-lg text-sm ${
                      validationError ? 'border-red-500' : 'border-gray-300'
                    } focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                  />
                  {validationError && (
                    <div className="flex items-center mt-1 text-red-600 text-xs">
                      <HiOutlineExclamationCircle className="w-3 h-3 mr-1" />
                      {validationError}
                    </div>
                  )}
                </div>
                <button 
                  type="submit" 
                  disabled={isValidating}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold text-white ${
                    isValidating ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
                  }`}
                >
                  {isValidating ? 'Validating...' : 'Validate ID'}
                </button>
              </form>
            </div>
          ) : (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center">
                <HiOutlineCheckCircle className="w-5 h-5 text-green-600 mr-2" />
                <div className="flex-1">
                  <div className="font-semibold text-green-800">
                    ✅ Verified: {validatedPatient.fullName}
                  </div>
                  <div className="text-sm text-green-600">
                    NabhaGram ID: {validatedPatient.id}
                  </div>
                </div>
                <button 
                  onClick={() => {
                    setValidatedPatient(null);
                    setNabhaGramID('');
                    setPatientName('');
                    setPatientPhone('');
                    setSelectedVillage('');
                  }}
                  className="px-3 py-1 bg-gray-100 border border-gray-300 rounded text-sm hover:bg-gray-200"
                >
                  Change ID
                </button>
              </div>
            </div>
          )}

          {/* Village Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <HiOutlineLocationMarker className="w-5 h-5 inline mr-2" />
              Select Village *
            </label>
            <select
              value={selectedVillage}
              onChange={(e) => setSelectedVillage(e.target.value)}
              className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                validatedPatient ? 'bg-gray-100 text-gray-500' : 'bg-white'
              }`}
              required
              disabled={validatedPatient}
            >
              <option value="">Choose your village...</option>
              {VILLAGES.map((village, index) => (
                <option key={index} value={village}>{village}</option>
              ))}
            </select>
            {validatedPatient && (
              <p className="text-xs text-gray-500 mt-1">
                Village auto-filled from verified NabhaGram ID
              </p>
            )}
          </div>

          {/* Patient Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Patient Name *
              </label>
              <input
                type="text"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  validatedPatient ? 'bg-gray-100 text-gray-500' : 'bg-white'
                }`}
                placeholder="Enter patient name"
                required
                disabled={validatedPatient}
              />
              {validatedPatient && (
                <p className="text-xs text-gray-500 mt-1">
                  Name auto-filled from verified NabhaGram ID
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Age
              </label>
              <input
                type="number"
                value={patientAge}
                onChange={(e) => setPatientAge(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter age"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                value={patientPhone}
                onChange={(e) => setPatientPhone(e.target.value)}
                className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  validatedPatient ? 'bg-gray-100 text-gray-500' : 'bg-white'
                }`}
                placeholder="Enter phone number"
                required
                disabled={validatedPatient}
              />
              {validatedPatient && (
                <p className="text-xs text-gray-500 mt-1">
                  Phone auto-filled from verified NabhaGram ID
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Address
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter complete address"
              />
            </div>
          </div>

          {/* Booking Schedule */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Preferred Date
              </label>
              <input
                type="date"
                value={bookingDate}
                onChange={(e) => setBookingDate(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Preferred Time
              </label>
              <select
                value={bookingTime}
                onChange={(e) => setBookingTime(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select time slot</option>
                <option value="09:00-10:00">09:00 AM - 10:00 AM</option>
                <option value="10:00-11:00">10:00 AM - 11:00 AM</option>
                <option value="11:00-12:00">11:00 AM - 12:00 PM</option>
                <option value="12:00-13:00">12:00 PM - 01:00 PM</option>
                <option value="14:00-15:00">02:00 PM - 03:00 PM</option>
                <option value="15:00-16:00">03:00 PM - 04:00 PM</option>
                <option value="16:00-17:00">04:00 PM - 05:00 PM</option>
              </select>
            </div>
          </div>

          {/* Lab Tests Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Select Lab Tests *
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-y-auto border border-gray-200 rounded-lg p-4">
              {LAB_TESTS.map((test) => (
                <div
                  key={test.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-all ${
                    selectedTests.find(t => t.id === test.id)
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleTestToggle(test)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800">{test.name}</h4>
                      <p className="text-sm text-gray-600 mt-1">{test.description}</p>
                    </div>
                    <div className="ml-3 text-right">
                      <div className="flex items-center text-green-600 font-semibold">
                        <HiOutlineCurrencyRupee className="w-4 h-4" />
                        {test.price}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Summary */}
          {selectedTests.length > 0 && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-3">Booking Summary</h3>
              <div className="space-y-2">
                {selectedTests.map((test) => (
                  <div key={test.id} className="flex justify-between text-sm">
                    <span>{test.name}</span>
                    <span className="flex items-center text-green-600">
                      <HiOutlineCurrencyRupee className="w-3 h-3" />
                      {test.price}
                    </span>
                  </div>
                ))}
                <div className="flex justify-between text-sm border-t border-gray-300 pt-2">
                  <span>Delivery Charge</span>
                  <span className="flex items-center text-green-600">
                    <HiOutlineCurrencyRupee className="w-3 h-3" />
                    {DELIVERY_CHARGE}
                  </span>
                </div>
                <div className="flex justify-between font-semibold text-lg border-t border-gray-300 pt-2">
                  <span>Total Amount</span>
                  <span className="flex items-center text-green-600">
                    <HiOutlineCurrencyRupee className="w-4 h-4" />
                    {calculateTotal()}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!validatedPatient}
              className={`flex-1 px-6 py-3 rounded-lg transition-colors font-semibold ${
                validatedPatient 
                  ? 'bg-blue-600 text-white hover:bg-blue-700' 
                  : 'bg-gray-400 text-gray-200 cursor-not-allowed'
              }`}
            >
              {validatedPatient ? 'Book Lab Tests' : 'Please Validate NabhaGram ID First'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
