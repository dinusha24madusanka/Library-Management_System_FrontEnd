import { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  RotateCcw,
  ArrowLeftRight,
  Calendar,
  Clock,
  Loader2,
  BookOpen,
  User,
  AlertTriangle
} from 'lucide-react';
import { borrowApi, memberApi, bookApi } from '../api/api';
import { Modal } from '../components/Modal';
import toast from 'react-hot-toast';

export function Borrowings() {
  const [borrowings, setBorrowings] = useState([]);
  const [members, setMembers] = useState([]);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ memberId: 0, bookId: 0 });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [borrowingsRes, membersRes, booksRes] = await Promise.all([
        borrowApi.getAll(),
        memberApi.getAll(),
        bookApi.getAll(),
      ]);
      setBorrowings(borrowingsRes.data);
      setMembers(membersRes.data);
      setBooks(booksRes.data);
    } catch (error) {
      toast.error('Failed to fetch data. Check backend connection.');
      setBorrowings([]);
      setMembers([]);
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = () => {
    setFormData({ memberId: 0, bookId: 0 });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData({ memberId: 0, bookId: 0 });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.memberId || !formData.bookId) {
      toast.error('Please select both member and book');
      return;
    }
    setSubmitting(true);
    try {
      await borrowApi.create(formData);
      toast.success('Book borrowed successfully');
      handleCloseModal();
      fetchData();
    } catch (error) {
      toast.error('Failed to create borrowing. Book might not be available.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReturn = async (id) => {
    if (!confirm('Mark this book as returned?')) return;
    try {
      await borrowApi.returnBook(id);
      toast.success('Book returned successfully');
      fetchData();
    } catch (error) {
      toast.error('Failed to return book');
    }
  };

  const getMemberName = (memberId) => {
    const member = members.find(m => m.id === memberId);
    return member ? `${member.firstName} ${member.lastName}` : `Member #${memberId}`;
  };

  const getBookTitle = (bookId) => {
    const book = books.find(b => b.id === bookId);
    return book ? book.title : `Book #${bookId}`;
  };

  const availableBooks = books.filter(book => book.availableCopies > 0);

  const filteredBorrowings = borrowings.filter(borrow => {
    const matchesSearch = 
      getMemberName(borrow.memberId).toLowerCase().includes(searchTerm.toLowerCase()) ||
      getBookTitle(borrow.bookId).toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = 
      filterStatus === 'all' || 
      borrow.status === filterStatus;

    return matchesSearch && matchesFilter;
  });

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const isOverdue = (dueDate, status) => {
    if (status === 'RETURNED') return false;
    return new Date(dueDate) < new Date();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Borrowings</h1>
          <p className="text-gray-500 mt-1">Track book borrowing and returns</p>
        </div>
        <button
          onClick={handleOpenModal}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus className="h-5 w-5" />
          New Borrowing
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by member or book..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="all">All Status</option>
          <option value="BORROWED">Borrowed</option>
          <option value="RETURNED">Returned</option>
          <option value="OVERDUE">Overdue</option>
        </select>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
          <div className="flex items-center gap-3">
            <div className="bg-amber-100 p-2 rounded-lg">
              <Clock className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-amber-600">Active Borrowings</p>
              <p className="text-2xl font-bold text-amber-700">
                {borrowings.filter(b => b.status === 'BORROWED').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-red-50 rounded-xl p-4 border border-red-100">
          <div className="flex items-center gap-3">
            <div className="bg-red-100 p-2 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-red-600">Overdue</p>
              <p className="text-2xl font-bold text-red-700">
                {borrowings.filter(b => b.status === 'OVERDUE' || (b.status === 'BORROWED' && isOverdue(b.dueDate, b.status))).length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-green-50 rounded-xl p-4 border border-green-100">
          <div className="flex items-center gap-3">
            <div className="bg-green-100 p-2 rounded-lg">
              <RotateCcw className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-green-600">Returned</p>
              <p className="text-2xl font-bold text-green-700">
                {borrowings.filter(b => b.status === 'RETURNED').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Borrowings Table */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
        </div>
      ) : filteredBorrowings.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
          <ArrowLeftRight className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No borrowings found</p>
          <button
            onClick={handleOpenModal}
            className="mt-4 text-indigo-600 hover:underline"
          >
            Create first borrowing
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Member</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Book</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Borrow Date</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Due Date</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Return Date</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Status</th>
                  <th className="text-right px-6 py-4 text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredBorrowings.map((borrow) => (
                  <tr key={borrow.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                          <User className="h-4 w-4 text-indigo-600" />
                        </div>
                        <span className="font-medium text-gray-900">
                          {borrow.memberName || getMemberName(borrow.memberId)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-purple-100 flex items-center justify-center">
                          <BookOpen className="h-4 w-4 text-purple-600" />
                        </div>
                        <span className="text-gray-700">
                          {borrow.bookTitle || getBookTitle(borrow.bookId)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        {formatDate(borrow.borrowDate)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`${
                        isOverdue(borrow.dueDate, borrow.status) 
                          ? 'text-red-600 font-medium' 
                          : 'text-gray-600'
                      }`}>
                        {formatDate(borrow.dueDate)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {formatDate(borrow.returnDate)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        borrow.status === 'RETURNED'
                          ? 'bg-green-100 text-green-700'
                          : borrow.status === 'OVERDUE' || isOverdue(borrow.dueDate, borrow.status)
                          ? 'bg-red-100 text-red-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}>
                        {borrow.status === 'BORROWED' && isOverdue(borrow.dueDate, borrow.status) 
                          ? 'OVERDUE' 
                          : borrow.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end">
                        {borrow.status !== 'RETURNED' && (
                          <button
                            onClick={() => borrow.id && handleReturn(borrow.id)}
                            className="flex items-center gap-2 px-3 py-1.5 text-sm bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
                          >
                            <RotateCcw className="h-4 w-4" />
                            Return
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* New Borrowing Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="New Borrowing"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Member
            </label>
            <select
              value={formData.memberId}
              onChange={(e) => setFormData({ ...formData, memberId: parseInt(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            >
              <option value={0}>Choose a member...</option>
              {members.filter(m => m.active !== false).map((member) => (
                <option key={member.id} value={member.id}>
                  {member.firstName} {member.lastName} ({member.email})
                </option>
              ))}
            </select>
            {members.length === 0 && (
              <p className="text-sm text-amber-600 mt-1">No members available. Add members first.</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Book
            </label>
            <select
              value={formData.bookId}
              onChange={(e) => setFormData({ ...formData, bookId: parseInt(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            >
              <option value={0}>Choose a book...</option>
              {availableBooks.map((book) => (
                <option key={book.id} value={book.id}>
                  {book.title} by {book.author} ({book.availableCopies} available)
                </option>
              ))}
            </select>
            {availableBooks.length === 0 && (
              <p className="text-sm text-amber-600 mt-1">No books available for borrowing.</p>
            )}
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600">
              <strong>Note:</strong> The due date will be automatically set to 14 days from today by the backend.
            </p>
          </div>
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleCloseModal}
              className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || !formData.memberId || !formData.bookId}
              className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
              Create Borrowing
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
