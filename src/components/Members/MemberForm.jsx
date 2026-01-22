import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export default function MemberForm({ onSubmit, onCancel, editingMember }) {
  const [formData, setFormData] = useState({ name: '', email: '' });

  useEffect(() => {
    if (editingMember) {
      setFormData({
        name: editingMember.name,
        email: editingMember.email,
      });
    } else {
      setFormData({ name: '', email: '' });
    }
  }, [editingMember]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.email) {
      alert('Please fill all fields');
      return;
    }
    onSubmit(formData);
    setFormData({ name: '', email: '' });
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-8 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">
          {editingMember ? 'Edit Member' : 'Add New Member'}
        </h2>
        <button
          onClick={onCancel}
          className="text-gray-500 hover:text-gray-700 transition-all"
        >
          <X size={24} />
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            placeholder="Enter member name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            placeholder="Enter email"
          />
        </div>

        <button
          onClick={handleSubmit}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg font-semibold transition-all"
        >
          {editingMember ? 'Update Member' : 'Create Member'}
        </button>
      </div>
    </div>
  );
}