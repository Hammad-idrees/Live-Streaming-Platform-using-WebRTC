import React, { useEffect, useState } from 'react';
import { fetchAllCategories, addCategory, updateCategory, deleteCategory } from '../../utils/api/admin';
import { Loader2, Plus, Edit, Trash2, Search } from 'lucide-react';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null); // { type: 'add'|'edit', category }
  const [confirmDelete, setConfirmDelete] = useState(null); // categoryId
  const [form, setForm] = useState({ name: '' });
  const [formLoading, setFormLoading] = useState(false);

  const loadCategories = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetchAllCategories();
      setCategories(res.data || []);
    } catch (err) {
      setError('Failed to load categories');
    }
    setLoading(false);
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleOpenModal = (type, category = null) => {
    setModal({ type, category });
    setForm({ name: category?.name || '' });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      if (modal.type === 'add') {
        await addCategory({ name: form.name });
      } else {
        await updateCategory(modal.category._id, { name: form.name });
      }
      await loadCategories();
      setModal(null);
    } catch {
      // handle error
    }
    setFormLoading(false);
  };

  const handleDelete = async (id) => {
    setFormLoading(true);
    try {
      await deleteCategory(id);
      await loadCategories();
      setConfirmDelete(null);
    } catch {
      // handle error
    }
    setFormLoading(false);
  };

  const filtered = categories.filter(c => c.name?.toLowerCase().includes(search.toLowerCase()));

  if (loading) return <div className="flex items-center gap-2 text-white"><Loader2 className="animate-spin" /> Loading...</div>;
  if (error) return <div className="text-red-400">{error}</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Categories</h1>
      <div className="flex items-center mb-4 gap-2">
        <div className="relative w-full max-w-xs">
          <input
            className="w-full bg-dark-800 border border-dark-700 rounded-lg px-10 py-2 text-white placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="Search categories..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-400" size={18} />
        </div>
        <button
          className="ml-auto flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-semibold transition-all"
          onClick={() => handleOpenModal('add')}
        >
          <Plus size={18} /> Add Category
        </button>
      </div>
      <div className="overflow-x-auto rounded-lg shadow-lg">
        <table className="min-w-full bg-dark-900">
          <thead>
            <tr className="bg-dark-800 text-white">
              <th className="px-4 py-3 text-left font-semibold">Name</th>
              <th className="px-4 py-3 text-left font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(category => (
              <tr key={category._id} className="border-b border-dark-800 hover:bg-dark-800/60 transition-colors">
                <td className="px-4 py-3">{category.name}</td>
                <td className="px-4 py-3 flex gap-2">
                  <button
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded flex items-center gap-1 transition-all focus:ring-2 focus:ring-blue-500"
                    title="Edit"
                    onClick={() => handleOpenModal('edit', category)}
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded flex items-center gap-1 transition-all focus:ring-2 focus:ring-red-500"
                    title="Delete"
                    onClick={() => setConfirmDelete(category._id)}
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Add/Edit Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="bg-dark-900 rounded-xl p-8 shadow-lg w-full max-w-sm border border-dark-700 relative">
            <h2 className="text-xl font-bold text-white mb-4">{modal.type === 'add' ? 'Add Category' : 'Edit Category'}</h2>
            <form onSubmit={handleFormSubmit}>
              <input
                className="w-full mb-4 bg-dark-800 border border-dark-700 rounded-lg px-4 py-2 text-white placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Category name"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                required
                autoFocus
              />
              <div className="flex gap-4 justify-end">
                <button
                  className="px-4 py-2 rounded-lg bg-dark-700 text-white hover:bg-dark-600 transition-all"
                  type="button"
                  onClick={() => setModal(null)}
                  disabled={formLoading}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700 font-semibold transition-all disabled:opacity-60"
                  type="submit"
                  disabled={formLoading}
                >
                  {formLoading ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Delete Confirmation Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="bg-dark-900 rounded-xl p-8 shadow-lg w-full max-w-sm border border-dark-700 relative">
            <h2 className="text-xl font-bold text-white mb-4">Confirm Delete</h2>
            <p className="text-dark-300 mb-6">
              Are you sure you want to delete this category?
            </p>
            <div className="flex gap-4 justify-end">
              <button
                className="px-4 py-2 rounded-lg bg-dark-700 text-white hover:bg-dark-600 transition-all"
                onClick={() => setConfirmDelete(null)}
                disabled={formLoading}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 font-semibold transition-all disabled:opacity-60"
                onClick={() => handleDelete(confirmDelete)}
                disabled={formLoading}
              >
                {formLoading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCategories; 