import React, { useState, useEffect } from 'react';
import { Trash2, Edit2, Plus } from 'lucide-react';
import BookForm from './BookForm';
import { bookAPI } from './BookAPI';

export default function BookList() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingBook, setEditingBook] = useState(null);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const data = await bookAPI.getAll();
      setBooks(data);
    } catch (error) {
      alert('Error fetching books: ' + error.message);
    }
    setLoading(false);
  };

  const handleCreate = async (formData) => {
    try {
      await bookAPI.create(formData);
      alert('Book created successfully!');
      setShowForm(false);
      fetchBooks();
    } catch (error) {
      alert('Error creating book: ' + error.message);
    }
  };

  const handleUpdate = async (formData) => {
    try {
      await bookAPI.update(editingBook.bookId, formData);
      alert('Book updated successfully!');
      setEditingBook(null);
      setShowForm(false);
      fetchBooks();
    } catch (error) {
      alert('Error updating book: ' + error.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        await bookAPI.delete(id);
        alert('Book deleted successfully!');
        fetchBooks();
      } catch (error) {
        alert('Error deleting book: ' + error.message);
      }
    }
  };

  const handleEdit = (book) => {
    setEditingBook(book);
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
            <Plus size={20} /> Add Book
          </button>
        </div>
      )}

      {showForm && (
        <BookForm
          onSubmit={editingBook ? handleUpdate : handleCreate}
          onCancel={() => {
            setShowForm(false);
            setEditingBook(null);
          }}
          editingBook={editingBook}
        />
      )}

      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-indigo-600 text-white">
              <tr>
                <th className="px-6 py-3 text-left">ID</th>
                <th className="px-6 py-3 text-left">Title</th>
                <th className="px-6 py-3 text-left">Available Copies</th>
                <th className="px-6 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {books.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                    No books found
                  </td>
                </tr>
              ) : (
                books.map((book) => (
                  <tr key={book.bookId} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4">{book.bookId}</td>
                    <td className="px-6 py-4">{book.title}</td>
                    <td className="px-6 py-4">{book.availableCopies}</td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleEdit(book)}
                        className="text-blue-500 hover:text-blue-700 mr-4"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(book.bookId)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}