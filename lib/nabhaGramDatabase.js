// NabhaGram Database Service
// This simulates a database for storing NabhaGram IDs and health records

class NabhaGramDatabase {
  constructor() {
    // Initialize with empty data
    this.nabhaGramIDs = JSON.parse(localStorage.getItem('nabhaGramIDs') || '[]');
    this.healthRecords = JSON.parse(localStorage.getItem('healthRecords') || '[]');
    this.prescriptions = JSON.parse(localStorage.getItem('prescriptions') || '[]');
  }

  // Save data to localStorage
  saveToStorage() {
    localStorage.setItem('nabhaGramIDs', JSON.stringify(this.nabhaGramIDs));
    localStorage.setItem('healthRecords', JSON.stringify(this.healthRecords));
    localStorage.setItem('prescriptions', JSON.stringify(this.prescriptions));
  }

  // Generate unique serial number for ID
  generateSerialNumber() {
    const existingSerials = this.nabhaGramIDs.map(id => parseInt(id.serialNumber));
    const maxSerial = existingSerials.length > 0 ? Math.max(...existingSerials) : 0;
    return (maxSerial + 1).toString().padStart(6, '0');
  }

  // Save NabhaGram ID to database
  saveNabhaGramID(userData) {
    const villageCode = userData.village.substring(0, 3).toUpperCase();
    const serialNumber = this.generateSerialNumber();
    const nabhaGramID = `NBH${villageCode}2025${serialNumber}`;

    const idRecord = {
      id: nabhaGramID,
      serialNumber,
      villageCode,
      firstName: userData.firstName,
      fullName: userData.fullName,
      mobile: userData.mobile,
      aadhaar: userData.aadhaar,
      village: userData.village,
      createdAt: new Date().toISOString(),
      status: 'active'
    };

    this.nabhaGramIDs.push(idRecord);
    this.saveToStorage();
    
    return idRecord;
  }

  // Check if Aadhaar already exists
  checkAadhaarExists(aadhaar) {
    return this.nabhaGramIDs.some(record => record.aadhaar === aadhaar);
  }

  // Search NabhaGram ID (partial matching)
  searchNabhaGramID(searchTerm) {
    if (!searchTerm) return [];
    
    const term = searchTerm.toUpperCase();
    return this.nabhaGramIDs.filter(record => 
      record.id.includes(term) || 
      record.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.mobile.includes(searchTerm) ||
      record.aadhaar.includes(searchTerm) ||
      record.village.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  // Get NabhaGram ID by exact ID
  getNabhaGramIDById(id) {
    return this.nabhaGramIDs.find(record => record.id === id);
  }

  // Save health record
  saveHealthRecord(nabhaGramID, recordData) {
    const healthRecord = {
      id: Date.now().toString(),
      nabhaGramID,
      type: recordData.type, // 'prescription', 'lab_report', 'scan_report', etc.
      title: recordData.title,
      description: recordData.description,
      fileUrl: recordData.fileUrl,
      uploadedAt: new Date().toISOString(),
      doctorName: recordData.doctorName || '',
      hospitalName: recordData.hospitalName || ''
    };

    this.healthRecords.push(healthRecord);
    this.saveToStorage();
    
    return healthRecord;
  }

  // Get health records by NabhaGram ID
  getHealthRecordsByID(nabhaGramID) {
    return this.healthRecords.filter(record => record.nabhaGramID === nabhaGramID)
      .sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));
  }

  // Save prescription
  savePrescription(nabhaGramID, prescriptionData) {
    const prescription = {
      id: Date.now().toString(),
      nabhaGramID,
      doctorName: prescriptionData.doctorName,
      hospitalName: prescriptionData.hospitalName,
      diagnosis: prescriptionData.diagnosis,
      medicines: prescriptionData.medicines,
      instructions: prescriptionData.instructions,
      followUpDate: prescriptionData.followUpDate,
      createdAt: new Date().toISOString()
    };

    this.prescriptions.push(prescription);
    this.saveToStorage();
    
    return prescription;
  }

  // Get prescriptions by NabhaGram ID
  getPrescriptionsByID(nabhaGramID) {
    return this.prescriptions.filter(prescription => prescription.nabhaGramID === nabhaGramID)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  // Get all data for a NabhaGram ID
  getCompleteHealthData(nabhaGramID) {
    const idRecord = this.getNabhaGramIDById(nabhaGramID);
    const healthRecords = this.getHealthRecordsByID(nabhaGramID);
    const prescriptions = this.getPrescriptionsByID(nabhaGramID);

    return {
      idRecord,
      healthRecords,
      prescriptions,
      totalRecords: healthRecords.length + prescriptions.length
    };
  }

  // Update patient information
  updatePatientInfo(nabhaGramID, updateData) {
    const index = this.nabhaGramIDs.findIndex(record => record.id === nabhaGramID);
    if (index !== -1) {
      this.nabhaGramIDs[index] = {
        ...this.nabhaGramIDs[index],
        ...updateData,
        updatedAt: new Date().toISOString()
      };
      this.saveToStorage();
      return this.nabhaGramIDs[index];
    }
    return null;
  }

  // Get statistics
  getStatistics() {
    return {
      totalIDs: this.nabhaGramIDs.length,
      totalHealthRecords: this.healthRecords.length,
      totalPrescriptions: this.prescriptions.length,
      activeIDs: this.nabhaGramIDs.filter(id => id.status === 'active').length
    };
  }
}

// Create singleton instance
const nabhaGramDB = new NabhaGramDatabase();

export default nabhaGramDB;
