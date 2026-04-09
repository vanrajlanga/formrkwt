import { useState } from 'react';
import OwnerFields from '../components/OwnerFields';
import TenantFields from '../components/TenantFields';

const emptyOwner = { name: '', mobile: '', aadhaar: '', vehicle: '' };
const emptyTenant = { name: '', mobile: '', aadhaar: '', vehicle: '' };

function PlusButton({ onClick, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-2 text-purple-700 hover:text-purple-900 font-medium text-sm transition"
    >
      <span className="w-8 h-8 rounded-full bg-purple-100 hover:bg-purple-200 flex items-center justify-center text-xl leading-none transition">
        +
      </span>
      {label}
    </button>
  );
}

function MinusButton({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-7 h-7 rounded-full bg-red-100 hover:bg-red-200 flex items-center justify-center text-red-600 text-lg leading-none transition"
      title="Remove"
    >
      &minus;
    </button>
  );
}

export default function FormPage() {
  const [officeNumber, setOfficeNumber] = useState('');
  const [owners, setOwners] = useState([{ ...emptyOwner }]);
  const [ownershipType, setOwnershipType] = useState('Own');
  const [tenants, setTenants] = useState([{ ...emptyTenant }]);
  const [parkingNumbers, setParkingNumbers] = useState(['']);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // Owner add/remove
  const addOwner = () => setOwners([...owners, { ...emptyOwner }]);
  const removeOwner = (index) => {
    if (owners.length <= 1) return;
    setOwners(owners.filter((_, i) => i !== index));
  };
  const handleOwnerChange = (index, updatedOwner) => {
    const newOwners = [...owners];
    newOwners[index] = updatedOwner;
    setOwners(newOwners);
  };

  // Tenant add/remove
  const addTenant = () => setTenants([...tenants, { ...emptyTenant }]);
  const removeTenant = (index) => {
    if (tenants.length <= 1) return;
    setTenants(tenants.filter((_, i) => i !== index));
  };
  const handleTenantChange = (index, updatedTenant) => {
    const newTenants = [...tenants];
    newTenants[index] = updatedTenant;
    setTenants(newTenants);
  };

  // Parking add/remove
  const addParking = () => setParkingNumbers([...parkingNumbers, '']);
  const removeParking = (index) => {
    if (parkingNumbers.length <= 1) return;
    setParkingNumbers(parkingNumbers.filter((_, i) => i !== index));
  };
  const handleParkingChange = (index, value) => {
    const newParking = [...parkingNumbers];
    newParking[index] = value;
    setParkingNumbers(newParking);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSuccess(false);

    try {
      const body = {
        office_number: officeNumber,
        ownership_type: ownershipType,
        owners,
        tenants: ownershipType === 'Rented' ? tenants : null,
        allotted_parking: parkingNumbers.filter(p => p.trim()),
      };

      const res = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error('Failed to submit');

      setSuccess(true);
      setOfficeNumber('');
      setOwners([{ ...emptyOwner }]);
      setOwnershipType('Own');
      setTenants([{ ...emptyTenant }]);
      setParkingNumbers(['']);
    } catch (err) {
      alert('Error submitting form: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-purple-900 text-white px-8 py-6">
          <h2 className="text-2xl font-bold">RK WORLD TOWER CRM</h2>
          <p className="text-purple-200 mt-1">
            We need below details to add Owners / Tenants in our Web Application
          </p>
        </div>

        {success && (
          <div className="mx-8 mt-6 bg-green-50 border border-green-300 text-green-800 px-4 py-3 rounded-lg">
            Form submitted successfully!
          </div>
        )}

        <form onSubmit={handleSubmit} className="px-8 py-6 space-y-6">
          {/* Office Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Office Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={officeNumber}
              onChange={(e) => setOfficeNumber(e.target.value)}
              placeholder="Enter office number"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
            />
          </div>

          {/* Dynamic Owner Fields with + / - */}
          <div className="space-y-4">
            {owners.map((owner, i) => (
              <div key={i} className="relative">
                {owners.length > 1 && (
                  <div className="absolute top-3 right-3 z-10">
                    <MinusButton onClick={() => removeOwner(i)} />
                  </div>
                )}
                <OwnerFields index={i} owner={owner} onChange={handleOwnerChange} />
              </div>
            ))}
            <PlusButton onClick={addOwner} label="Add Another Owner" />
          </div>

          {/* Owned or Rented */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Owned or Rented <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="ownership"
                  value="Own"
                  checked={ownershipType === 'Own'}
                  onChange={(e) => setOwnershipType(e.target.value)}
                  className="w-4 h-4 text-purple-600 focus:ring-purple-500"
                />
                <span className="text-gray-700">Own</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="ownership"
                  value="Rented"
                  checked={ownershipType === 'Rented'}
                  onChange={(e) => setOwnershipType(e.target.value)}
                  className="w-4 h-4 text-purple-600 focus:ring-purple-500"
                />
                <span className="text-gray-700">Rented</span>
              </label>
            </div>
          </div>

          {/* Conditional Tenant Fields with + / - */}
          {ownershipType === 'Rented' && (
            <div className="space-y-4">
              {tenants.map((tenant, i) => (
                <div key={i} className="relative">
                  {tenants.length > 1 && (
                    <div className="absolute top-3 right-3 z-10">
                      <MinusButton onClick={() => removeTenant(i)} />
                    </div>
                  )}
                  <TenantFields index={i} tenant={tenant} onChange={handleTenantChange} />
                </div>
              ))}
              <PlusButton onClick={addTenant} label="Add Another Tenant" />
            </div>
          )}

          {/* Allotted Parking Numbers with + / - */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              Allotted Parking Number
            </label>
            {parkingNumbers.map((p, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  type="text"
                  value={p}
                  onChange={(e) => handleParkingChange(i, e.target.value)}
                  placeholder={`Parking number ${i + 1}`}
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                />
                {parkingNumbers.length > 1 && (
                  <MinusButton onClick={() => removeParking(i)} />
                )}
              </div>
            ))}
            <PlusButton onClick={addParking} label="Add Another Parking Number" />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-purple-900 text-white py-3 rounded-lg font-semibold text-lg hover:bg-purple-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? 'Submitting...' : 'Submit'}
          </button>
        </form>
      </div>
    </div>
  );
}
