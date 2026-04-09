export default function TenantFields({ index, tenant, onChange }) {
  const num = index + 1;

  const handleChange = (field, value) => {
    onChange(index, { ...tenant, [field]: value });
  };

  return (
    <div className="bg-orange-50 border border-orange-200 rounded-xl p-5 space-y-4">
      <h3 className="text-lg font-semibold text-orange-800">Tenant {num} Details</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tenant {num} Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={tenant.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="Enter tenant full name"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tenant {num} Mobile Number <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            required
            value={tenant.mobile}
            onChange={(e) => handleChange('mobile', e.target.value)}
            placeholder="Enter tenant mobile number"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tenant {num} Aadhaar Number
          </label>
          <input
            type="text"
            value={tenant.aadhaar}
            onChange={(e) => handleChange('aadhaar', e.target.value)}
            placeholder="Enter tenant Aadhaar number"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tenant {num} Vehicle Number (4 wheel)
          </label>
          <input
            type="text"
            value={tenant.vehicle}
            onChange={(e) => handleChange('vehicle', e.target.value)}
            placeholder="Enter tenant vehicle number"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
          />
        </div>
      </div>
    </div>
  );
}
