import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { memberAPI } from '../Members/MemberAPI';
import { bookAPI } from '../Books/BookAPI';

export default function BorrowForm({ onSubmit, onCancel, editingBorrow }) {
  const [formData, setFormData] = useState({
    memberId: '',
    bookId: '',
    borrowDate: '',
    returnDate: '',
  });
  const [members, setMembers] = useState([]);
  const [books, setBooks] = useState([]);

  useEffect(() => {
    fetchMembers();
    fetchBooks();
  }, []);

  useEffect(() => {
    if (editingBorrow) {
      setFormData({
        memberId: editingBorrow.memberId,
        bookId: editingBorrow.bookId,
        borrowDate: editingBorrow.borrowDate,
        returnDate: editingBorrow.returnDate || '',
      });
    }
  }, [editingBorrow]);

  const fetchMembers = async () => {
    try {
      const data = await memberAPI.getAll();
      setMembers(data);
    } catch (error) {
      console.error('Error fetching members:', error);
    }
  };

  const fetchBooks = async () => {
    try {
      const data = await bookAPI.getAll();
      setBooks(data);
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    if (!formData.memberId || !formData.bookId || !formData.borrowDate) {
      alert('Please fill all required fields');
      return;
    }
    onSubmit({
      ...formData,
      memberId: parseInt(formData.memberId),
      bookId: parseInt(formData.bookId),
      returnDate: formData.returnDate || null,
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-8 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">
          {editingBorrow ? 'Edit Borrow Record' : 'Add New Borrow Record'}
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
            Member *
          </label>
          <select
            name="memberId"
            value={formData.memberId}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Select a member</option>
            {members.map((m) => (
              <option key={m.memberId} value={m.memberId}>
                {m.name} (ID: {m.memberId})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Book *
          </label>
          <select
            name="bookId"
            value={formData.bookId}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Select a book</option>
            {books.map((b) => (
              <option key={b.bookId} value={b.bookId}>
                {b.title} (ID: {b.bookId})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Borrow Date *
          </label>
          <input
            type="date"
            name="borrowDate"
            value={formData.borrowDate}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Return Date (Optional)
          </label>
          <input
            type="date"
            name="returnDate"
            value={formData.returnDate}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <button
          onClick={handleSubmit}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg font-semibold transition-all"
        >
          {editingBorrow ? 'Update Borrow Record' : 'Create Borrow Record'}
        </button>
      </div>
    </div>
  );
}