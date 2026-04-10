export default function OwnerFields({ index, owner, onChange }) {
  const num = index + 1;

  const handleChange = (field, value) => {
    onChange(index, { ...owner, [field]: value });
  };

  return (
    <div className="bg-purple-50 border border-purple-200 rounded-xl p-5 space-y-4">
      <h3 className="text-lg font-semibold text-purple-900">Owner {num} Details</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Owner {num} Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={owner.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="Enter full name"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Owner {num} Mobile Number <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            required
            value={owner.mobile}
            onChange={(e) => handleChange('mobile', e.target.value)}
            placeholder="Enter mobile number"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Owner {num} Vehicle Number (4 wheel)
          </label>
          <input
            type="text"
            value={owner.vehicle}
            onChange={(e) => handleChange('vehicle', e.target.value)}
            placeholder="Enter vehicle number"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
          />
        </div>
      </div>
    </div>
  );
}
