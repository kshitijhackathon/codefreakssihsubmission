import { useState, useEffect } from 'react';
import { HiX as HiOutlineX, HiUser as HiOutlineUser, HiIdentification as HiOutlineIdentification, HiPrinter as HiOutlinePrinter, HiCheckCircle as HiOutlineCheckCircle } from 'react-icons/hi';
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

// Village code mapping (first 3 letters in uppercase)
const getVillageCode = (villageName) => {
  return villageName.substring(0, 3).toUpperCase();
};

// Generate unique ID
const generateNabhaGramID = (villageName, year = 2025) => {
  const villageCode = getVillageCode(villageName);
  const serialNumber = Math.floor(Math.random() * 999999).toString().padStart(6, '0');
  return `NBH${villageCode}${year}${serialNumber}`;
};

// Check if Aadhaar already exists using database
const checkAadhaarExists = async (aadhaar) => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Check database for existing Aadhaar
  return nabhaGramDB.checkAadhaarExists(aadhaar);
};

export default function NabhaGramIDModal({ isOpen, onClose }) {
  const [step, setStep] = useState(1); // 1: Form, 2: Generated ID, 3: Print
  const [formData, setFormData] = useState({
    firstName: '',
    fullName: '',
    mobile: '',
    aadhaar: '',
    village: ''
  });
  const [errors, setErrors] = useState({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedID, setGeneratedID] = useState('');
  const [villageSearch, setVillageSearch] = useState('');
  const [showVillageDropdown, setShowVillageDropdown] = useState(false);

  const filteredVillages = VILLAGES.filter(village =>
    village.toLowerCase().includes(villageSearch.toLowerCase())
  );

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.mobile.trim()) newErrors.mobile = 'Mobile number is required';
    else if (!/^\d{10}$/.test(formData.mobile)) newErrors.mobile = 'Mobile number must be 10 digits';
    
    if (!formData.aadhaar.trim()) newErrors.aadhaar = 'Aadhaar number is required';
    else if (!/^\d{12}$/.test(formData.aadhaar)) newErrors.aadhaar = 'Aadhaar number must be 12 digits';
    
    if (!formData.village) newErrors.village = 'Village selection is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsGenerating(true);
    
    try {
      // Check if Aadhaar already exists
      const aadhaarExists = await checkAadhaarExists(formData.aadhaar);
      
      if (aadhaarExists) {
        setErrors({ aadhaar: 'Aadhaar number already exists. Each Aadhaar can only have one NabhaGram ID.' });
        setIsGenerating(false);
        return;
      }
      
      // Generate ID and save to database
      const idRecord = nabhaGramDB.saveNabhaGramID(formData);
      setGeneratedID(idRecord.id);
      setStep(2);
    } catch (error) {
      console.error('Error generating ID:', error);
      setErrors({ general: 'Error generating ID. Please try again.' });
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePrint = () => {
    setStep(3);
    setTimeout(() => {
      window.print();
    }, 100);
  };

  const resetForm = () => {
    setFormData({
      firstName: '',
      fullName: '',
      mobile: '',
      aadhaar: '',
      village: ''
    });
    setErrors({});
    setStep(1);
    setGeneratedID('');
    setVillageSearch('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <HiOutlineIdentification className="w-8 h-8 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-800">Generate NabhaGram ID</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <HiOutlineX className="w-6 h-6 text-gray-500" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {step === 1 && (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.firstName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter first name"
                  />
                  {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.fullName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter full name"
                  />
                  {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Mobile Number *
                  </label>
                  <input
                    type="tel"
                    value={formData.mobile}
                    onChange={(e) => handleInputChange('mobile', e.target.value.replace(/\D/g, ''))}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.mobile ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter 10-digit mobile number"
                    maxLength="10"
                  />
                  {errors.mobile && <p className="text-red-500 text-sm mt-1">{errors.mobile}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Aadhaar Number *
                  </label>
                  <input
                    type="text"
                    value={formData.aadhaar}
                    onChange={(e) => handleInputChange('aadhaar', e.target.value.replace(/\D/g, ''))}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.aadhaar ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter 12-digit Aadhaar number"
                    maxLength="12"
                  />
                  {errors.aadhaar && <p className="text-red-500 text-sm mt-1">{errors.aadhaar}</p>}
                </div>
              </div>

              {/* Village Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Village *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={villageSearch}
                    onChange={(e) => {
                      setVillageSearch(e.target.value);
                      setShowVillageDropdown(true);
                      if (e.target.value === '') {
                        handleInputChange('village', '');
                      }
                    }}
                    onFocus={() => setShowVillageDropdown(true)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.village ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Search and select your village..."
                  />
                  
                  {showVillageDropdown && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {filteredVillages.map((village, index) => (
                        <div
                          key={index}
                          className="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                          onClick={() => {
                            handleInputChange('village', village);
                            setVillageSearch(village);
                            setShowVillageDropdown(false);
                          }}
                        >
                          <div className="flex justify-between items-center">
                            <span className="text-gray-800">{village}</span>
                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                              {getVillageCode(village)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {errors.village && <p className="text-red-500 text-sm mt-1">{errors.village}</p>}
              </div>

              {errors.general && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-600">{errors.general}</p>
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
                  disabled={isGenerating}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isGenerating ? 'Generating ID...' : 'Generate NabhaGram ID'}
                </button>
              </div>
            </form>
          )}

          {step === 2 && (
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <HiOutlineCheckCircle className="w-16 h-16 text-green-500" />
              </div>
              
              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">NabhaGram ID Generated Successfully!</h3>
                <p className="text-gray-600">Your unique NabhaGram ID has been created</p>
              </div>

              <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-blue-800 mb-2">Generated ID</h4>
                <div className="text-3xl font-mono font-bold text-blue-600 mb-4">
                  {generatedID}
                </div>
                <div className="text-sm text-blue-700">
                  <p><strong>Name:</strong> {formData.fullName}</p>
                  <p><strong>Village:</strong> {formData.village} ({getVillageCode(formData.village)})</p>
                  <p><strong>Mobile:</strong> {formData.mobile}</p>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={resetForm}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Generate Another ID
                </button>
                <button
                  onClick={handlePrint}
                  className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold flex items-center justify-center gap-2"
                >
                  <HiOutlinePrinter className="w-5 h-5" />
                  Print ID Card
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="print-only">
              <div className="bg-white border-2 border-gray-300 rounded-lg p-8 max-w-md mx-auto">
                <div className="text-center">
                  <div className="bg-blue-600 text-white py-4 px-6 rounded-t-lg -mx-8 -mt-8 mb-6">
                    <h2 className="text-xl font-bold">NABHAGRAM ID CARD</h2>
                    <p className="text-sm opacity-90">Nabha Healthcare Access Platform</p>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                      <span className="font-semibold text-gray-700">ID Number:</span>
                      <span className="font-mono text-lg font-bold text-blue-600">{generatedID}</span>
                    </div>
                    
                    <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                      <span className="font-semibold text-gray-700">Name:</span>
                      <span className="text-gray-800">{formData.fullName}</span>
                    </div>
                    
                    <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                      <span className="font-semibold text-gray-700">Village:</span>
                      <span className="text-gray-800">{formData.village}</span>
                    </div>
                    
                    <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                      <span className="font-semibold text-gray-700">Mobile:</span>
                      <span className="text-gray-800">{formData.mobile}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-gray-700">Aadhaar:</span>
                      <span className="text-gray-800">{formData.aadhaar}</span>
                    </div>
                  </div>
                  
                  <div className="mt-6 text-xs text-gray-500">
                    <p>This ID card is valid for accessing healthcare services</p>
                    <p>in the Nabha region covering 173 villages.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
