import React, { useEffect, useState } from 'react';
import { fetchSettings, updateSettings } from '../../utils/api/admin';
import { Loader2, Save } from 'lucide-react';

const mockSettings = {
  streamQuality: '1080p',
  moderation: true,
  maxUploadSize: 50,
};

const AdminSettings = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSettings()
      .then(res => setSettings(res.data))
      .catch(() => setSettings(mockSettings))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setSettings(s => ({ ...s, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);
    try {
      await updateSettings(settings);
      setSuccess(true);
    } catch {
      setError('Failed to save settings');
    }
    setSaving(false);
  };

  if (loading) return <div className="flex items-center gap-2 text-white"><Loader2 className="animate-spin" /> Loading settings...</div>;
  if (error) return <div className="text-red-400">{error}</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Platform Settings</h1>
      <form onSubmit={handleSubmit} className="bg-dark-900 rounded-xl p-8 shadow-lg border border-dark-700 max-w-xl">
        <div className="mb-6">
          <label className="block text-dark-300 mb-2 font-semibold">Stream Quality</label>
          <select
            name="streamQuality"
            value={settings.streamQuality}
            onChange={handleChange}
            className="w-full bg-dark-800 border border-dark-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="720p">720p</option>
            <option value="1080p">1080p</option>
            <option value="4K">4K</option>
          </select>
        </div>
        <div className="mb-6 flex items-center gap-3">
          <input
            type="checkbox"
            name="moderation"
            checked={settings.moderation}
            onChange={handleChange}
            id="moderation"
            className="accent-primary-600 w-5 h-5"
          />
          <label htmlFor="moderation" className="text-dark-300 font-semibold">Enable Moderation</label>
        </div>
        <div className="mb-6">
          <label className="block text-dark-300 mb-2 font-semibold">Max Upload Size (MB)</label>
          <input
            type="number"
            name="maxUploadSize"
            value={settings.maxUploadSize}
            onChange={handleChange}
            min={1}
            max={500}
            className="w-full bg-dark-800 border border-dark-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <button
          type="submit"
          className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg font-semibold transition-all disabled:opacity-60"
          disabled={saving}
        >
          <Save size={18} /> {saving ? 'Saving...' : 'Save Settings'}
        </button>
        {success && <div className="mt-4 text-green-400 font-semibold">Settings saved successfully!</div>}
      </form>
    </div>
  );
};

export default AdminSettings; 