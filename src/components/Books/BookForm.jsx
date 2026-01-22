import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export default function BookForm({ onSubmit, onCancel, editingBook }) {
  const [formData, setFormData] = useState({ title: '', availableCopies: '' });

  useEffect(() => {
    if (editingBook) {
      setFormData({
        title: editingBook.title,
        availableCopies: editingBook.availableCopies,
      });
    } else {
      setFormData({ title: '', availableCopies: '' });
    }
  }, [editingBook]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    if (!formData.title || !formData.availableCopies) {
      alert('Please fill all fields');
      return;
    }
    onSubmit({
      ...formData,
      availableCopies: parseInt(formData.availableCopies),
    });
    setFormData({ title: '', availableCopies: '' });
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-8 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">
          {editingBook ? 'Edit Book' : 'Add New Book'}
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
            Title
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            placeholder="Enter book title"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Available Copies
          </label>
          <input
            type="number"
            name="availableCopies"
            value={formData.availableCopies}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            placeholder="Enter available copies"
          />
        </div>

        <button
          onClick={handleSubmit}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg font-semibold transition-all"
        >
          {editingBook ? 'Update Book' : 'Create Book'}
        </button>
      </div>
    </div>
  );
}