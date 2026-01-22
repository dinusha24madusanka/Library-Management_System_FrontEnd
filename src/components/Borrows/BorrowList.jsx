import React, { useState, useEffect } from 'react';
import { Trash2, Edit2, Plus } from 'lucide-react';
import BorrowForm from './BorrowForm';
import { borrowAPI } from './BorrowAPI';

export default function BorrowList() {
  const [borrows, setBorrows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingBorrow, setEditingBorrow] = useState(null);

  useEffect(() => {
    fetchBorrows();
  }, []);

  const fetchBorrows = async () => {
    setLoading(true);
    try {
      const data = await borrowAPI.getAll();
      setBorrows(data);
    } catch (error) {
      alert('Error fetching borrows: ' + error.message);
    }
    setLoading(false);
  };

  const handleCreate = async (formData) => {
    try {
      await borrowAPI.create(formData);
      alert('Borrow record created successfully!');
      setShowForm(false);
      fetchBorrows();
    } catch (error) {
      alert('Error creating borrow: ' + error.message);
    }
  };

  const handleUpdate = async (formData) => {
    try {
      await borrowAPI.update(editingBorrow.borrowId, formData);
      alert('Borrow record updated successfully!');
      setEditingBorrow(null);
      setShowForm(false);
      fetchBorrows();
    } catch (error) {
      alert('Error updating borrow: ' + error.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this borrow record?')) {
      try {
        await borrowAPI.delete(id);
        alert('Borrow record deleted successfully!');
        fetchBorrows();
      } catch (error) {
        alert('Error deleting borrow: ' + error.message);
      }
    }
  };

  const handleEdit = (borrow) => {
    setEditingBorrow(borrow);
    setShowForm(true);
  };

  return (
    <div>
      {!showForm && (
        <div className="mb-8 flex justify-center">
          <button
            onClick={() => setShowForm(true)}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 shadow-lg transition-all"
          >
            <Plus size={20} /> Add Borrow Record
          </button>
        </div>
      )}

      {showForm && (
        <BorrowForm
          onSubmit={editingBorrow ? handleUpdate : handleCreate}
          onCancel={() => {
            setShowForm(false);
            setEditingBorrow(null);
          }}
          editingBorrow={edit