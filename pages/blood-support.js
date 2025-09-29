import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';

const BLOOD_GROUPS = ['A+','A-','B+','B-','AB+','AB-','O+','O-'];

export default function BloodSupport() {
  const [donors, setDonors] = useState([]);
  const [requests, setRequests] = useState([]);
  const [tab, setTab] = useState('request');
  const [filterGroup, setFilterGroup] = useState('');
  const [searchVillage, setSearchVillage] = useState('');

  const [donorForm, setDonorForm] = useState({
    name: '',
    age: '',
    group: '',
    phone: '',
    village: ''
  });

  const [requestForm, setRequestForm] = useState({
    name: '',
    group: '',
    units: '1',
    urgency: 'Normal',
    phone: '',
    hospital: '',
    village: ''
  });

  useEffect(() => {
    try {
      const d = JSON.parse(localStorage.getItem('bloodDonors') || '[]');
      const r = JSON.parse(localStorage.getItem('bloodRequests') || '[]');
      setDonors(Array.isArray(d) ? d : []);
      setRequests(Array.isArray(r) ? r : []);
    } catch (_) {}
  }, []);

  const saveDonors = (next) => {
    setDonors(next);
    localStorage.setItem('bloodDonors', JSON.stringify(next));
  };

  const saveRequests = (next) => {
    setRequests(next);
    localStorage.setItem('bloodRequests', JSON.stringify(next));
  };

  const filteredDonors = useMemo(() => {
    return donors.filter(d =>
      (!filterGroup || d.group === filterGroup) &&
      (!searchVillage || d.village.toLowerCase().includes(searchVillage.toLowerCase()))
    );
  }, [donors, filterGroup, searchVillage]);

  const filteredRequests = useMemo(() => {
    return requests.filter(r =>
      (!filterGroup || r.group === filterGroup) &&
      (!searchVillage || r.village.toLowerCase().includes(searchVillage.toLowerCase()))
    );
  }, [requests, filterGroup, searchVillage]);

  const handleSubmitDonor = (e) => {
    e.preventDefault();
    if (!donorForm.name || !donorForm.group || !donorForm.phone) return;
    const entry = {
      id: Date.now().toString(),
      ...donorForm,
      age: donorForm.age ? Number(donorForm.age) : '',
      createdAt: new Date().toISOString()
    };
    const next = [entry, ...donors];
    saveDonors(next);
    setDonorForm({ name: '', age: '', group: '', phone: '', village: '' });
    setTab('donors');
  };

  const handleSubmitRequest = (e) => {
    e.preventDefault();
    if (!requestForm.name || !requestForm.group || !requestForm.phone) return;
    const entry = {
      id: Date.now().toString(),
      ...requestForm,
      units: Number(requestForm.units || 1),
      createdAt: new Date().toISOString()
    };
    const next = [entry, ...requests];
    saveRequests(next);
    setRequestForm({ name: '', group: '', units: '1', urgency: 'Normal', phone: '', hospital: '', village: '' });
    setTab('requests');
  };

  const whatsappLink = (phone, text) => {
    const number = phone.replace(/\D/g, '');
    return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-red-50">
      <header className="bg-white/80 backdrop-blur border-b">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl md:text-3xl font-extrabold text-rose-700">Blood Availability & Donation</h1>
          <Link href="/" className="px-4 py-2 rounded-lg border text-gray-700 hover:bg-gray-50">Home</Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Actions */}
            <div className="bg-white rounded-2xl shadow border p-4">
              <div className="flex gap-2 mb-4">
                <button onClick={() => setTab('request')} className={`px-4 py-2 rounded-lg font-semibold ${tab==='request'?'bg-rose-600 text-white':'bg-rose-50 text-rose-700 hover:bg-rose-100'}`}>Request Blood</button>
                <button onClick={() => setTab('donor')} className={`px-4 py-2 rounded-lg font-semibold ${tab==='donor'?'bg-red-600 text-white':'bg-red-50 text-red-700 hover:bg-red-100'}`}>Register as Donor</button>
              </div>

              {tab === 'request' && (
                <form onSubmit={handleSubmitRequest} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input className="input" placeholder="Your Name" value={requestForm.name} onChange={(e)=>setRequestForm({...requestForm,name:e.target.value})} required />
                  <input className="input" placeholder="Phone" value={requestForm.phone} onChange={(e)=>setRequestForm({...requestForm,phone:e.target.value})} required />
                  <select className="input" value={requestForm.group} onChange={(e)=>setRequestForm({...requestForm,group:e.target.value})} required>
                    <option value="">Blood Group</option>
                    {BLOOD_GROUPS.map(g=> <option key={g} value={g}>{g}</option>)}
                  </select>
                  <select className="input" value={requestForm.units} onChange={(e)=>setRequestForm({...requestForm,units:e.target.value})}>
                    {[1,2,3,4].map(n=> <option key={n} value={n}>{n} Unit{n>1?'s':''}</option>)}
                  </select>
                  <input className="input" placeholder="Hospital/Location" value={requestForm.hospital} onChange={(e)=>setRequestForm({...requestForm,hospital:e.target.value})} />
                  <select className="input" value={requestForm.urgency} onChange={(e)=>setRequestForm({...requestForm,urgency:e.target.value})}>
                    {['Normal','Urgent','Critical'].map(u=> <option key={u} value={u}>{u}</option>)}
                  </select>
                  <input className="input md:col-span-2" placeholder="Village/Area" value={requestForm.village} onChange={(e)=>setRequestForm({...requestForm,village:e.target.value})} />
                  <div className="md:col-span-2 flex justify-end">
                    <button type="submit" className="px-5 py-2 rounded-lg bg-rose-600 text-white font-semibold hover:bg-rose-700">Post Request</button>
                  </div>
                </form>
              )}

              {tab === 'donor' && (
                <form onSubmit={handleSubmitDonor} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input className="input" placeholder="Full Name" value={donorForm.name} onChange={(e)=>setDonorForm({...donorForm,name:e.target.value})} required />
                  <input className="input" type="number" placeholder="Age" value={donorForm.age} onChange={(e)=>setDonorForm({...donorForm,age:e.target.value})} />
                  <select className="input" value={donorForm.group} onChange={(e)=>setDonorForm({...donorForm,group:e.target.value})} required>
                    <option value="">Blood Group</option>
                    {BLOOD_GROUPS.map(g=> <option key={g} value={g}>{g}</option>)}
                  </select>
                  <input className="input" placeholder="Phone" value={donorForm.phone} onChange={(e)=>setDonorForm({...donorForm,phone:e.target.value})} required />
                  <input className="input md:col-span-2" placeholder="Village/Area" value={donorForm.village} onChange={(e)=>setDonorForm({...donorForm,village:e.target.value})} />
                  <div className="md:col-span-2 flex justify-end">
                    <button type="submit" className="px-5 py-2 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700">Register Donor</button>
                  </div>
                </form>
              )}
            </div>

            {/* Lists */}
            <div className="bg-white rounded-2xl shadow border p-4">
              <div className="flex flex-wrap gap-3 items-end mb-4">
                <select className="input w-40" value={filterGroup} onChange={(e)=>setFilterGroup(e.target.value)}>
                  <option value="">All Groups</option>
                  {BLOOD_GROUPS.map(g=> <option key={g} value={g}>{g}</option>)}
                </select>
                <input className="input flex-1 min-w-[200px]" placeholder="Filter by village" value={searchVillage} onChange={(e)=>setSearchVillage(e.target.value)} />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">Active Requests</h3>
              <div className="grid md:grid-cols-2 gap-3">
                {filteredRequests.map(r=> (
                  <div key={r.id} className="rounded-xl border p-3 hover:shadow-sm">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-semibold text-rose-700">{r.group} • {r.units} Unit{r.units>1?'s':''}</div>
                        <div className="text-sm text-gray-700">{r.name} • {r.urgency}</div>
                        <div className="text-sm text-gray-500">{r.hospital || '—'} • {r.village || '—'}</div>
                      </div>
                      <div className="flex gap-2">
                        <a className="btn-outline" href={`tel:${r.phone}`}>Call</a>
                        <a className="btn-outline" target="_blank" rel="noreferrer" href={whatsappLink(r.phone, `Blood requirement: ${r.group} (${r.units} unit${r.units>1?'s':''}) at ${r.hospital||'hospital'}. Contact: ${r.name}`)}>WhatsApp</a>
                      </div>
                    </div>
                  </div>
                ))}
                {filteredRequests.length === 0 && <p className="text-sm text-gray-500">No requests yet.</p>}
              </div>
            </div>
          </div>

          {/* Donors Sidebar */}
          <div className="bg-white rounded-2xl shadow border p-4 h-max">
            <h3 className="text-lg font-bold text-gray-800 mb-3">Available Donors</h3>
            <div className="space-y-3">
              {filteredDonors.map(d=> (
                <div key={d.id} className="rounded-xl border p-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-semibold text-red-700">{d.group} • {d.name}</div>
                      <div className="text-sm text-gray-700">{d.village || '—'} {d.age?`• ${d.age} yrs`:''}</div>
                      <div className="text-xs text-gray-500">Added {new Date(d.createdAt).toLocaleDateString()}</div>
                    </div>
                    <div className="flex gap-2">
                      <a className="btn-outline" href={`tel:${d.phone}`}>Call</a>
                      <a className="btn-outline" target="_blank" rel="noreferrer" href={whatsappLink(d.phone, `Hi ${d.name}, need ${d.group} blood. Can you donate?`)}>WhatsApp</a>
                    </div>
                  </div>
                </div>
              ))}
              {filteredDonors.length === 0 && <p className="text-sm text-gray-500">No donors yet.</p>}
            </div>
          </div>
        </div>
      </main>

      <style jsx>{`
        .input { @apply w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent bg-white; }
        .btn-outline { @apply px-3 py-1.5 rounded-lg border text-sm text-gray-700 hover:bg-gray-50; }
      `}</style>
    </div>
  );
}


