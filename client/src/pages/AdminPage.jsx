import { useState, useEffect } from 'react';
import { authFetch, getToken } from '../auth';

export default function AdminPage() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState(null);
  const token = getToken();

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await authFetch('/api/submissions');
      const data = await res.json();
      setSubmissions(data);
    } catch (err) {
      console.error('Failed to fetch:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this entry?')) return;
    await authFetch(`/api/submissions/${id}`, { method: 'DELETE' });
    fetchData();
  };

  const filtered = submissions.filter((s) => {
    const term = search.toLowerCase();
    if (!term) return true;
    const ownerNames = s.owners.map(o => o.name.toLowerCase()).join(' ');
    const tenantNames = s.tenants ? s.tenants.map(t => t.name.toLowerCase()).join(' ') : '';
    return (
      s.office_number.toLowerCase().includes(term) ||
      ownerNames.includes(term) ||
      tenantNames.includes(term)
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold text-gray-800">All Submissions</h2>
        <div className="flex gap-3">
          <a
            href={`/api/export/csv?token=${encodeURIComponent(token || '')}`}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm font-medium"
          >
            Export CSV
          </a>
          <a
            href={`/api/export/xlsx?token=${encodeURIComponent(token || '')}`}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
          >
            Export XLS
          </a>
          <button
            onClick={fetchData}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition text-sm font-medium"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by office number, owner name, or tenant name..."
          className="w-full max-w-md border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
        />
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          {search ? 'No matching submissions found.' : 'No submissions yet.'}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-purple-900 text-white">
                  <th className="px-4 py-3 text-left">#</th>
                  <th className="px-4 py-3 text-left">Office No.</th>
                  <th className="px-4 py-3 text-left">Owners</th>
                  <th className="px-4 py-3 text-left">Type</th>
                  <th className="px-4 py-3 text-left">Tenants</th>
                  <th className="px-4 py-3 text-left">Parking</th>
                  <th className="px-4 py-3 text-left">Submitted</th>
                  <th className="px-4 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((s, idx) => (
                  <tr
                    key={s.id}
                    className={`border-b hover:bg-gray-50 cursor-pointer ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                    onClick={() => setExpandedId(expandedId === s.id ? null : s.id)}
                  >
                    <td className="px-4 py-3">{s.id}</td>
                    <td className="px-4 py-3 font-medium">{s.office_number}</td>
                    <td className="px-4 py-3">
                      {s.owners.map((o, i) => (
                        <div key={i} className="text-xs">
                          {o.name}{s.owners.length > 1 && ` (Owner ${i + 1})`}
                        </div>
                      ))}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        s.ownership_type === 'Own'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-orange-100 text-orange-800'
                      }`}>
                        {s.ownership_type}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {s.tenants ? s.tenants.map((t, i) => (
                        <div key={i} className="text-xs">
                          {t.name}{s.tenants.length > 1 && ` (Tenant ${i + 1})`}
                        </div>
                      )) : '-'}
                    </td>
                    <td className="px-4 py-3 text-xs">
                      {s.allotted_parking && s.allotted_parking.length > 0
                        ? s.allotted_parking.join(', ')
                        : '-'}
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500">
                      {new Date(s.created_at).toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDelete(s.id); }}
                        className="text-red-600 hover:text-red-800 text-xs font-medium"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Expanded detail view */}
          {expandedId && (() => {
            const s = filtered.find(x => x.id === expandedId);
            if (!s) return null;
            return (
              <div className="border-t bg-gray-50 px-6 py-4">
                <h3 className="font-semibold text-gray-800 mb-3">
                  Full Details - Office {s.office_number}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {s.owners.map((o, i) => (
                    <div key={i} className="bg-white p-4 rounded-lg border">
                      <h4 className="font-medium text-purple-900 mb-2">Owner {i + 1}</h4>
                      <p><span className="text-gray-500">Name:</span> {o.name}</p>
                      <p><span className="text-gray-500">Mobile:</span> {o.mobile}</p>
                      <p><span className="text-gray-500">Aadhaar:</span> {o.aadhaar || '-'}</p>
                      <p><span className="text-gray-500">Vehicle:</span> {o.vehicle || '-'}</p>
                    </div>
                  ))}
                  {s.tenants && s.tenants.map((t, i) => (
                    <div key={i} className="bg-white p-4 rounded-lg border border-orange-200">
                      <h4 className="font-medium text-orange-800 mb-2">Tenant {i + 1}</h4>
                      <p><span className="text-gray-500">Name:</span> {t.name}</p>
                      <p><span className="text-gray-500">Mobile:</span> {t.mobile}</p>
                      <p><span className="text-gray-500">Aadhaar:</span> {t.aadhaar || '-'}</p>
                      <p><span className="text-gray-500">Vehicle:</span> {t.vehicle || '-'}</p>
                    </div>
                  ))}
                  {s.allotted_parking && s.allotted_parking.length > 0 && (
                    <div className="bg-white p-4 rounded-lg border">
                      <h4 className="font-medium text-gray-800 mb-2">Parking Numbers</h4>
                      {s.allotted_parking.map((p, i) => (
                        <p key={i}><span className="text-gray-500">Parking {i + 1}:</span> {p}</p>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })()}
        </div>
      )}

      <div className="mt-4 text-sm text-gray-500">
        Total: {filtered.length} submission{filtered.length !== 1 ? 's' : ''}
      </div>
    </div>
  );
}
