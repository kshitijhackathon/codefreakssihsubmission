import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { HiIdentification as HiOutlineIdentification, HiExclamationCircle as HiOutlineExclamationCircle, HiCheckCircle as HiOutlineCheckCircle, HiShoppingCart as HiOutlineShoppingCart, HiSearch as HiOutlineSearch, HiCurrencyRupee as HiOutlineCurrencyRupee, HiPlus as HiOutlinePlus, HiMinus as HiOutlineMinus } from 'react-icons/hi';

// Import database only on client side
let nabhaGramDB;
if (typeof window !== 'undefined') {
  nabhaGramDB = require('../lib/nabhaGramDatabase').default;
}

// 50 Dummy Medicines
const MEDICINES = [
  { id: 1, name: "Paracetamol 500mg", price: 15, category: "Pain Relief", description: "For fever and pain relief", stock: 100, prescription: false },
  { id: 2, name: "Ibuprofen 400mg", price: 25, category: "Pain Relief", description: "Anti-inflammatory pain reliever", stock: 80, prescription: false },
  { id: 3, name: "Aspirin 75mg", price: 20, category: "Cardiovascular", description: "Blood thinner for heart health", stock: 60, prescription: true },
  { id: 4, name: "Metformin 500mg", price: 35, category: "Diabetes", description: "Type 2 diabetes medication", stock: 90, prescription: true },
  { id: 5, name: "Insulin Glargine", price: 450, category: "Diabetes", description: "Long-acting insulin", stock: 25, prescription: true },
  { id: 6, name: "Amlodipine 5mg", price: 40, category: "Cardiovascular", description: "Blood pressure medication", stock: 70, prescription: true },
  { id: 7, name: "Lisinopril 10mg", price: 30, category: "Cardiovascular", description: "ACE inhibitor for hypertension", stock: 65, prescription: true },
  { id: 8, name: "Omeprazole 20mg", price: 50, category: "Digestive", description: "Proton pump inhibitor", stock: 85, prescription: false },
  { id: 9, name: "Ranitidine 150mg", price: 35, category: "Digestive", description: "H2 blocker for acid reflux", stock: 75, prescription: false },
  { id: 10, name: "Cetirizine 10mg", price: 20, category: "Allergy", description: "Antihistamine for allergies", stock: 95, prescription: false },
  { id: 11, name: "Loratadine 10mg", price: 25, category: "Allergy", description: "Non-drowsy antihistamine", stock: 80, prescription: false },
  { id: 12, name: "Amoxicillin 500mg", price: 60, category: "Antibiotic", description: "Broad-spectrum antibiotic", stock: 50, prescription: true },
  { id: 13, name: "Azithromycin 250mg", price: 80, category: "Antibiotic", description: "Macrolide antibiotic", stock: 40, prescription: true },
  { id: 14, name: "Ciprofloxacin 500mg", price: 70, category: "Antibiotic", description: "Fluoroquinolone antibiotic", stock: 35, prescription: true },
  { id: 15, name: "Simvastatin 20mg", price: 45, category: "Cardiovascular", description: "Cholesterol lowering drug", stock: 60, prescription: true },
  { id: 16, name: "Atorvastatin 20mg", price: 55, category: "Cardiovascular", description: "Statin for cholesterol", stock: 55, prescription: true },
  { id: 17, name: "Levothyroxine 50mcg", price: 40, category: "Endocrine", description: "Thyroid hormone replacement", stock: 70, prescription: true },
  { id: 18, name: "Prednisolone 5mg", price: 30, category: "Steroid", description: "Corticosteroid anti-inflammatory", stock: 45, prescription: true },
  { id: 19, name: "Dexamethasone 0.5mg", price: 25, category: "Steroid", description: "Potent corticosteroid", stock: 40, prescription: true },
  { id: 20, name: "Furosemide 40mg", price: 35, category: "Cardiovascular", description: "Loop diuretic", stock: 65, prescription: true },
  { id: 21, name: "Spironolactone 25mg", price: 30, category: "Cardiovascular", description: "Potassium-sparing diuretic", stock: 50, prescription: true },
  { id: 22, name: "Warfarin 5mg", price: 40, category: "Cardiovascular", description: "Anticoagulant blood thinner", stock: 30, prescription: true },
  { id: 23, name: "Digoxin 0.25mg", price: 35, category: "Cardiovascular", description: "Cardiac glycoside", stock: 25, prescription: true },
  { id: 24, name: "Metoprolol 50mg", price: 45, category: "Cardiovascular", description: "Beta-blocker", stock: 60, prescription: true },
  { id: 25, name: "Losartan 50mg", price: 50, category: "Cardiovascular", description: "ARB for hypertension", stock: 55, prescription: true },
  { id: 26, name: "Hydrochlorothiazide 25mg", price: 25, category: "Cardiovascular", description: "Thiazide diuretic", stock: 70, prescription: true },
  { id: 27, name: "Clopidogrel 75mg", price: 60, category: "Cardiovascular", description: "Antiplatelet agent", stock: 40, prescription: true },
  { id: 28, name: "Pantoprazole 40mg", price: 55, category: "Digestive", description: "Proton pump inhibitor", stock: 75, prescription: false },
  { id: 29, name: "Domperidone 10mg", price: 30, category: "Digestive", description: "Prokinetic agent", stock: 65, prescription: false },
  { id: 30, name: "Loperamide 2mg", price: 20, category: "Digestive", description: "Antidiarrheal medication", stock: 80, prescription: false },
  { id: 31, name: "Montelukast 10mg", price: 40, category: "Respiratory", description: "Leukotriene receptor antagonist", stock: 50, prescription: true },
  { id: 32, name: "Salbutamol Inhaler", price: 120, category: "Respiratory", description: "Bronchodilator inhaler", stock: 35, prescription: true },
  { id: 33, name: "Budesonide Inhaler", price: 150, category: "Respiratory", description: "Corticosteroid inhaler", stock: 30, prescription: true },
  { id: 34, name: "Fluoxetine 20mg", price: 50, category: "Psychiatric", description: "SSRI antidepressant", stock: 45, prescription: true },
  { id: 35, name: "Sertraline 50mg", price: 55, category: "Psychiatric", description: "SSRI antidepressant", stock: 40, prescription: true },
  { id: 36, name: "Alprazolam 0.5mg", price: 35, category: "Psychiatric", description: "Benzodiazepine anxiolytic", stock: 25, prescription: true },
  { id: 37, name: "Diazepam 5mg", price: 30, category: "Psychiatric", description: "Benzodiazepine sedative", stock: 20, prescription: true },
  { id: 38, name: "Tramadol 50mg", price: 40, category: "Pain Relief", description: "Opioid pain reliever", stock: 30, prescription: true },
  { id: 39, name: "Codeine 30mg", price: 35, category: "Pain Relief", description: "Opioid cough suppressant", stock: 25, prescription: true },
  { id: 40, name: "Gabapentin 300mg", price: 60, category: "Neurological", description: "Anticonvulsant", stock: 35, prescription: true },
  { id: 41, name: "Carbamazepine 200mg", price: 45, category: "Neurological", description: "Anticonvulsant", stock: 30, prescription: true },
  { id: 42, name: "Phenytoin 100mg", price: 50, category: "Neurological", description: "Anticonvulsant", stock: 25, prescription: true },
  { id: 43, name: "Memantine 10mg", price: 80, category: "Neurological", description: "NMDA receptor antagonist", stock: 20, prescription: true },
  { id: 44, name: "Donepezil 5mg", price: 70, category: "Neurological", description: "Cholinesterase inhibitor", stock: 25, prescription: true },
  { id: 45, name: "Tamsulosin 0.4mg", price: 55, category: "Urological", description: "Alpha-blocker for BPH", stock: 40, prescription: true },
  { id: 46, name: "Finasteride 5mg", price: 60, category: "Urological", description: "5-alpha reductase inhibitor", stock: 35, prescription: true },
  { id: 47, name: "Sildenafil 50mg", price: 100, category: "Urological", description: "PDE5 inhibitor", stock: 20, prescription: true },
  { id: 48, name: "Calcium Carbonate 500mg", price: 25, category: "Supplements", description: "Calcium supplement", stock: 100, prescription: false },
  { id: 49, name: "Vitamin D3 1000IU", price: 30, category: "Supplements", description: "Vitamin D supplement", stock: 90, prescription: false },
  { id: 50, name: "Multivitamin Tablet", price: 20, category: "Supplements", description: "Daily multivitamin", stock: 120, prescription: false }
];

const CATEGORIES = ["All", "Pain Relief", "Cardiovascular", "Diabetes", "Digestive", "Allergy", "Antibiotic", "Endocrine", "Steroid", "Respiratory", "Psychiatric", "Neurological", "Urological", "Supplements"];

export default function Pharmacy() {
  const router = useRouter();
  const [nabhaGramID, setNabhaGramID] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [validatedPatient, setValidatedPatient] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);

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

  const addToCart = (medicine) => {
    if (!validatedPatient) {
      alert('Please validate your NabhaGram ID first.');
      return;
    }

    const existingItem = cart.find(item => item.id === medicine.id);
    if (existingItem) {
      if (existingItem.quantity < medicine.stock) {
        setCart(cart.map(item => 
          item.id === medicine.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ));
      } else {
        alert('Stock limit reached for this medicine.');
      }
    } else {
      setCart([...cart, { ...medicine, quantity: 1 }]);
    }
  };

  const removeFromCart = (medicineId) => {
    setCart(cart.filter(item => item.id !== medicineId));
  };

  const updateQuantity = (medicineId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(medicineId);
      return;
    }
    
    const medicine = MEDICINES.find(m => m.id === medicineId);
    if (newQuantity > medicine.stock) {
      alert('Quantity cannot exceed available stock.');
      return;
    }

    setCart(cart.map(item => 
      item.id === medicineId 
        ? { ...item, quantity: newQuantity }
        : item
    ));
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const filteredMedicines = MEDICINES.filter(medicine => {
    const matchesSearch = medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         medicine.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || medicine.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert('Your cart is empty.');
      return;
    }

    const orderData = {
      nabhaGramID: validatedPatient.id,
      patientName: validatedPatient.fullName,
      medicines: cart,
      totalAmount: getTotalPrice(),
      orderDate: new Date().toISOString()
    };

    console.log('Pharmacy Order:', orderData);
    alert('Order placed successfully! You will receive a confirmation call.');
    
    // Reset cart
    setCart([]);
    setShowCart(false);
  };

  return (
    <div style={{ fontFamily: 'sans-serif', minHeight: '100vh', background: '#f9fafb' }}>
      {/* Header */}
      <header style={{ background: 'white', padding: '15px 30px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ color: '#059669', fontSize: '24px', margin: 0 }}>NabhaCare Pharmacy</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <button 
            onClick={() => setShowCart(!showCart)}
            style={{ 
              padding: '8px 15px', 
              background: '#059669', 
              color: 'white', 
              border: 'none', 
              borderRadius: '6px', 
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '5px'
            }}
          >
            <HiOutlineShoppingCart style={{ fontSize: '18px' }} />
            Cart ({cart.length})
          </button>
          <button onClick={() => router.push('/')} style={{ padding: '10px 20px', background: '#e5e7eb', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Back to Home</button>
        </div>
      </header>

      <main style={{ padding: '30px', maxWidth: '1200px', margin: '0 auto' }}>
        {/* NabhaGram ID Validation Section */}
        {!validatedPatient ? (
          <div style={{ marginBottom: '30px', padding: '20px', background: '#fef3c7', borderRadius: '8px', border: '1px solid #f59e0b' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
              <HiOutlineIdentification style={{ marginRight: '8px', color: '#d97706', fontSize: '20px' }} />
              <h3 style={{ margin: 0, color: '#92400e', fontSize: '18px' }}>NabhaGram ID Required</h3>
            </div>
            <p style={{ margin: '0 0 15px 0', color: '#92400e', fontSize: '14px' }}>
              Please enter your NabhaGram ID to order medicines. If you don't have one, 
              <a href="/" style={{ color: '#059669', textDecoration: 'underline', marginLeft: '5px' }}>generate it here</a>.
            </p>
            
            <form onSubmit={handleValidateID} style={{ display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
              <div style={{ flex: 1 }}>
                <input 
                  type="text" 
                  value={nabhaGramID} 
                  onChange={(e) => setNabhaGramID(e.target.value.toUpperCase())} 
                  placeholder="e.g., NBHABC2025000001"
                  required 
                  style={{ 
                    width: '100%', 
                    padding: '10px', 
                    borderRadius: '6px', 
                    border: validationError ? '1px solid #dc2626' : '1px solid #d1d5db',
                    fontSize: '14px'
                  }} 
                />
                {validationError && (
                  <div style={{ display: 'flex', alignItems: 'center', marginTop: '5px', color: '#dc2626', fontSize: '12px' }}>
                    <HiOutlineExclamationCircle style={{ marginRight: '4px', fontSize: '14px' }} />
                    {validationError}
                  </div>
                )}
              </div>
              <button 
                type="submit" 
                disabled={isValidating}
                style={{ 
                  padding: '10px 20px', 
                  background: isValidating ? '#9ca3af' : '#059669', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '6px', 
                  cursor: isValidating ? 'not-allowed' : 'pointer', 
                  fontWeight: 'bold',
                  fontSize: '14px'
                }}
              >
                {isValidating ? 'Validating...' : 'Validate ID'}
              </button>
            </form>
          </div>
        ) : (
          <div style={{ marginBottom: '30px', padding: '15px', background: '#d1fae5', borderRadius: '8px', border: '1px solid #10b981' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <HiOutlineCheckCircle style={{ marginRight: '8px', color: '#059669', fontSize: '20px' }} />
              <div>
                <div style={{ fontWeight: 'bold', color: '#065f46', marginBottom: '2px' }}>
                  ✅ Verified: {validatedPatient.fullName}
                </div>
                <div style={{ fontSize: '12px', color: '#047857' }}>
                  NabhaGram ID: {validatedPatient.id}
                </div>
              </div>
              <button 
                onClick={() => {
                  setValidatedPatient(null);
                  setNabhaGramID('');
                  setCart([]);
                }}
                style={{ 
                  marginLeft: 'auto', 
                  padding: '5px 10px', 
                  background: '#f3f4f6', 
                  border: '1px solid #d1d5db', 
                  borderRadius: '4px', 
                  cursor: 'pointer',
                  fontSize: '12px'
                }}
              >
                Change ID
              </button>
            </div>
          </div>
        )}

        {/* Search and Filter */}
        <div style={{ marginBottom: '30px', display: 'flex', gap: '15px', alignItems: 'center' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <HiOutlineSearch style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#6b7280' }} />
            <input
              type="text"
              placeholder="Search medicines..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 10px 10px 35px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px'
              }}
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{
              padding: '10px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '14px',
              minWidth: '150px'
            }}
          >
            {CATEGORIES.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        {/* Medicines Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px', marginBottom: '30px' }}>
          {filteredMedicines.map(medicine => (
            <div key={medicine.id} style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                <h3 style={{ margin: 0, fontSize: '16px', color: '#111827' }}>{medicine.name}</h3>
                <span style={{ 
                  padding: '2px 8px', 
                  borderRadius: '12px', 
                  fontSize: '10px', 
                  fontWeight: 'bold',
                  background: medicine.prescription ? '#fef3c7' : '#d1fae5',
                  color: medicine.prescription ? '#92400e' : '#065f46'
                }}>
                  {medicine.prescription ? 'Rx' : 'OTC'}
                </span>
              </div>
              
              <p style={{ margin: '0 0 10px 0', fontSize: '12px', color: '#6b7280' }}>{medicine.description}</p>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <div>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>Category: {medicine.category}</div>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>Stock: {medicine.stock} units</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', fontSize: '18px', fontWeight: 'bold', color: '#059669' }}>
                  <HiOutlineCurrencyRupee style={{ fontSize: '16px' }} />
                  {medicine.price}
                </div>
              </div>

              <button
                onClick={() => addToCart(medicine)}
                disabled={!validatedPatient || medicine.stock === 0}
                style={{
                  width: '100%',
                  padding: '10px',
                  background: validatedPatient && medicine.stock > 0 ? '#059669' : '#9ca3af',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: validatedPatient && medicine.stock > 0 ? 'pointer' : 'not-allowed',
                  fontWeight: 'bold',
                  fontSize: '14px'
                }}
              >
                {medicine.stock === 0 ? 'Out of Stock' : validatedPatient ? 'Add to Cart' : 'Validate ID First'}
              </button>
            </div>
          ))}
        </div>

        {/* Shopping Cart Sidebar */}
        {showCart && (
          <div style={{
            position: 'fixed',
            top: 0,
            right: 0,
            width: '400px',
            height: '100vh',
            background: 'white',
            boxShadow: '-2px 0 10px rgba(0,0,0,0.1)',
            padding: '20px',
            overflowY: 'auto',
            zIndex: 1000
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ margin: 0, fontSize: '20px' }}>Shopping Cart</h2>
              <button
                onClick={() => setShowCart(false)}
                style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}
              >
                ×
              </button>
            </div>

            {cart.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#6b7280', marginTop: '50px' }}>Your cart is empty</p>
            ) : (
              <>
                {cart.map(item => (
                  <div key={item.id} style={{ 
                    padding: '15px', 
                    border: '1px solid #e5e7eb', 
                    borderRadius: '8px', 
                    marginBottom: '10px' 
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                      <h4 style={{ margin: 0, fontSize: '14px' }}>{item.name}</h4>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer' }}
                      >
                        ×
                      </button>
                    </div>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          style={{ padding: '5px', background: '#f3f4f6', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                        >
                          <HiOutlineMinus style={{ fontSize: '12px' }} />
                        </button>
                        <span style={{ fontSize: '14px', fontWeight: 'bold' }}>{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          style={{ padding: '5px', background: '#f3f4f6', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                        >
                          <HiOutlinePlus style={{ fontSize: '12px' }} />
                        </button>
                      </div>
                      <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#059669' }}>
                        ₹{item.price * item.quantity}
                      </div>
                    </div>
                  </div>
                ))}

                <div style={{ marginTop: '20px', padding: '15px', background: '#f9fafb', borderRadius: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                    <span style={{ fontSize: '16px', fontWeight: 'bold' }}>Total:</span>
                    <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#059669' }}>
                      ₹{getTotalPrice()}
                    </span>
                  </div>
                  <button
                    onClick={handleCheckout}
                    style={{
                      width: '100%',
                      padding: '12px',
                      background: '#059669',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontWeight: 'bold',
                      fontSize: '16px'
                    }}
                  >
                    Place Order
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </main>
    </div>
  );
}