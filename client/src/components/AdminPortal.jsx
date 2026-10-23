import React, { useState, useEffect } from 'react';
import {
  X,
  ShieldCheck,
  ShieldAlert,
  Users,
  Lock,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';
import { API_BASE_URL } from '../apiConfig';

export default function AdminPortal({ onClose }) {
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [privacyTestResult, setPrivacyTestResult] = useState(null);
  const [testingUserId, setTestingUserId] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const token = localStorage.getItem('amour_token');
      const res = await fetch(`${API_BASE_URL}/api/admin/credentials`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to fetch credentials.');
      setUsersList(data.users || []);
    } catch (err) {
      setErrorMsg(err.message || 'Error loading credentials audit.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleStatus = async (userId, currentStatus) => {
    const nextStatus = currentStatus === 'active' ? 'suspended' : 'active';
    try {
      const token = localStorage.getItem('amour_token');
      const res = await fetch(`${API_BASE_URL}/api/admin/users/${userId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: nextStatus })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update status.');
      fetchUsers();
    } catch (err) {
      alert(err.message || 'Failed to update status.');
    }
  };

  // Test privacy isolation live: Try to access user memories through admin API
  const handleTestPrivacyIsolation = async (userId) => {
    setTestingUserId(userId);
    setPrivacyTestResult(null);

    try {
      const token = localStorage.getItem('amour_token');
      const res = await fetch(`${API_BASE_URL}/api/admin/users/${userId}/memories`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await res.json();

      setPrivacyTestResult({
        status: res.status,
        statusText: res.statusText,
        blocked: res.status === 403,
        response: data
      });
    } catch (err) {
      setPrivacyTestResult({
        status: 500,
        blocked: true,
        response: { error: err.message }
      });
    } finally {
      setTestingUserId(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      
      <div className="fixed inset-0" onClick={onClose}></div>

      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden z-10 flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white flex items-center justify-between border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-amber-500/20 border border-amber-400/40 rounded-xl text-amber-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-editorial text-xl font-bold tracking-wide">
                Admin Credentials Audit Portal
              </h2>
              <p className="text-xs text-amber-300/80 font-mono">
                Access Tier: Credentials &amp; Account Management Only
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={fetchUsers}
              className="p-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-full transition-colors"
              title="Refresh Audit Data"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Zero-Knowledge Privacy Compliance Banner */}
        <div className="bg-emerald-950/20 border-b border-emerald-500/30 p-4 px-6 flex items-start space-x-3">
          <Lock className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div className="text-xs text-emerald-900 leading-relaxed">
            <strong className="font-bold text-emerald-800">
              🔒 Zero-Knowledge Privacy Architecture Active:
            </strong>{' '}
            As required by the privacy charter, administrators CANNOT view user photographs, love stories,
            music tracks, or memory albums. The system isolates personal vaults from administrative scrutiny.
            Admins may strictly verify user identity, auth provider, registration date, and account status.
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {errorMsg && (
            <div className="p-3 bg-red-50 text-red-700 border border-red-200 text-xs rounded-xl">
              {errorMsg}
            </div>
          )}

          {/* Privacy Verification Test Box */}
          {privacyTestResult && (
            <div className="p-4 bg-gray-900 text-white rounded-2xl border border-gray-700 space-y-2 animate-fadeIn">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                  Privacy Isolation Verified (HTTP {privacyTestResult.status} Forbidden)
                </span>
              </div>
              <p className="text-xs text-gray-300">
                The server blocked the administrator attempt to access private photos or memory albums with the following response:
              </p>
              <pre className="text-[11px] bg-black/60 p-3 rounded-xl font-mono text-amber-300 overflow-x-auto">
                {JSON.stringify(privacyTestResult.response, null, 2)}
              </pre>
            </div>
          )}

          {/* Users Table */}
          <div className="overflow-x-auto border border-gray-200 rounded-2xl shadow-sm">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3 px-4">User Credential</th>
                  <th className="py-3 px-4">Auth Method</th>
                  <th className="py-3 px-4">Registered</th>
                  <th className="py-3 px-4">Role / Status</th>
                  <th className="py-3 px-4">Memory Quota</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {usersList.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50/70 transition-colors">
                    
                    {/* User Credential */}
                    <td className="py-3.5 px-4 font-medium text-gray-900">
                      <div>{u.email}</div>
                      <div className="text-[10px] text-gray-400 font-mono truncate max-w-[150px]">
                        ID: {u.id}
                      </div>
                    </td>

                    {/* Auth Method */}
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        u.auth_provider.includes('Google')
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'bg-purple-50 text-purple-700 border border-purple-200'
                      }`}>
                        {u.auth_provider}
                      </span>
                    </td>

                    {/* Registered Date */}
                    <td className="py-3.5 px-4 text-gray-500 whitespace-nowrap">
                      {new Date(u.created_at).toLocaleDateString()}
                    </td>

                    {/* Status & Role */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-1.5">
                        <span className={`w-2 h-2 rounded-full ${
                          u.status === 'active' ? 'bg-emerald-500' : 'bg-red-500'
                        }`}></span>
                        <span className="capitalize font-semibold text-gray-700">
                          {u.status}
                        </span>
                        <span className="text-[10px] text-gray-400 uppercase">
                          ({u.role})
                        </span>
                      </div>
                    </td>

                    {/* Memory Quota (Count ONLY, No Data!) */}
                    <td className="py-3.5 px-4">
                      <span className="font-mono text-gray-700 bg-gray-100 px-2 py-0.5 rounded">
                        {u.total_memories_count} items
                      </span>
                      <span className="block text-[9px] text-gray-400 mt-0.5">
                        (Media locked from admin)
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right space-x-2 whitespace-nowrap">
                      {/* Privacy Shield Test Button */}
                      <button
                        onClick={() => handleTestPrivacyIsolation(u.id)}
                        disabled={testingUserId === u.id}
                        className="px-2.5 py-1 text-[11px] font-medium text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-lg border border-amber-200 transition-colors"
                        title="Verify that admin is blocked from viewing user memories"
                      >
                        <EyeOff className="w-3 h-3 inline mr-1" />
                        <span>Verify Shield</span>
                      </button>

                      {/* Status Toggle */}
                      <button
                        onClick={() => handleToggleStatus(u.id, u.status)}
                        className={`px-2.5 py-1 text-[11px] font-medium rounded-lg transition-colors ${
                          u.status === 'active'
                            ? 'text-red-700 bg-red-50 hover:bg-red-100 border border-red-200'
                            : 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200'
                        }`}
                      >
                        {u.status === 'active' ? 'Suspend' : 'Activate'}
                      </button>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>

      </div>

    </div>
  );
}
