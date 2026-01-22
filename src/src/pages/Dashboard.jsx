import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  BookOpen, 
  ArrowLeftRight, 
  AlertTriangle,
  TrendingUp,
  BookMarked,
  UserPlus
} from 'lucide-react';
import { memberApi, bookApi, borrowApi } from '../api/api';

export function Dashboard() {
  const [members, setMembers] = useState([]);
  const [books, setBooks] = useState([]);
  const [borrowings, setBorrowings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [membersRes, booksRes, borrowingsRes] = await Promise.all([
        memberApi.getAll(),
        bookApi.getAll(),
        borrowApi.getAll(),
      ]);
      setMembers(membersRes.data);
      setBooks(booksRes.data);
      setBorrowings(borrowingsRes.data);
    } catch (err) {
      setError('Unable to connect to backend. Make sure Spring Boot is running on localhost:8080');
      setMembers([]);
      setBooks([]);
      setBorrowings([]);
    } finally {
      setLoading(false);
    }
  };

  const totalBooks = books.reduce((acc, book) => acc + book.totalCopies, 0);
  const availableBooks = books.reduce((acc, book) => acc + book.availableCopies, 0);
  const activeBorrowings = borrowings.filter(b => b.status === 'BORROWED').length;
  const overdueBorrowings = borrowings.filter(b => b.status === 'OVERDUE').length;

  const stats = [
    { 
      label: 'Total Members', 
      value: members.length, 
      icon: Users, 
      color: 'bg-blue-500',
      link: '/members'
    },
    { 
      label: 'Total Books', 
      value: totalBooks, 
      icon: BookOpen, 
      color: 'bg-emerald-500',
      link: '/books'
    },
    { 
      label: 'Active Borrowings', 
      value: activeBorrowings, 
      icon: ArrowLeftRight, 
      color: 'bg-amber-500',
      link: '/borrowings'
    },
    { 
      label: 'Overdue', 
      value: overdueBorrowings, 
      icon: AlertTriangle, 
      color: 'bg-red-500',
      link: '/borrowings'
    },
  ];

  const recentBorrowings = borrowings.slice(0, 5);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Welcome to the Library Management System</p>
      </div>

      {error && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
            <div>
              <h3 className="font-medium text-amber-800">Backend Connection Issue</h3>
              <p className="text-sm text-amber-700 mt-1">{error}</p>
              <p className="text-sm text-amber-600 mt-2">
                The UI is fully functional - just start your Spring Boot backend to see real data.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.label}
              to={stat.link}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">
                    {loading ? '...' : stat.value}
                  </p>
                </div>
                <div className={`${stat.color} p-3 rounded-xl`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <Link
              to="/members"
              className="flex items-center gap-3 p-4 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
            >
              <UserPlus className="h-5 w-5" />
              <span className="font-medium">Add Member</span>
            </Link>
            <Link
              to="/books"
              className="flex items-center gap-3 p-4 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors"
            >
              <BookMarked className="h-5 w-5" />
              <span className="font-medium">Add Book</span>
            </Link>
            <Link
              to="/borrowings"
              className="flex items-center gap-3 p-4 rounded-xl bg-amber-50 text-amber-700 hover:bg-amber-100 transition-colors"
            >
              <ArrowLeftRight className="h-5 w-5" />
              <span className="font-medium">New Borrowing</span>
            </Link>
            <Link
              to="/borrowings"
              className="flex items-center gap-3 p-4 rounded-xl bg-purple-50 text-purple-700 hover:bg-purple-100 transition-colors"
            >
              <TrendingUp className="h-5 w-5" />
              <span className="font-medium">View Reports</span>
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Borrowings</h2>
          {loading ? (
            <p className="text-gray-500">Loading...</p>
          ) : recentBorrowings.length === 0 ? (
            <p className="text-gray-500">No borrowings yet</p>
          ) : (
            <div className="space-y-3">
              {recentBorrowings.map((borrow) => (
                <div
                  key={borrow.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-gray-50"
                >
                  <div>
                    <p className="font-medium text-gray-900">{borrow.bookTitle || `Book #${borrow.bookId}`}</p>
                    <p className="text-sm text-gray-500">{borrow.memberName || `Member #${borrow.memberId}`}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    borrow.status === 'RETURNED' 
                      ? 'bg-green-100 text-green-700'
                      : borrow.status === 'OVERDUE'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-amber-100 text-amber-700'
                  }`}>
                    {borrow.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Books Availability */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Books Availability</h2>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-emerald-500 transition-all duration-500"
                style={{ 
                  width: totalBooks > 0 ? `${(availableBooks / totalBooks) * 100}%` : '0%' 
                }}
              />
            </div>
          </div>
          <div className="text-sm text-gray-600">
            <span className="font-semibold text-emerald-600">{availableBooks}</span>
            {' / '}
            <span>{totalBooks}</span>
            {' available'}
          </div>
        </div>
      </div>
    </div>
  );
}
