import { Link, useLocation } from 'react-router-dom';
import { 
  BookOpen, 
  Users, 
  ArrowLeftRight, 
  LayoutDashboard,
  Library
} from 'lucide-react';

export function Layout({ children }) {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/members', label: 'Members', icon: Users },
    { path: '/books', label: 'Books', icon: BookOpen },
    { path: '/borrowings', label: 'Borrowings', icon: ArrowLeftRight },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-gradient-to-b from-indigo-900 to-indigo-800 text-white shadow-xl">
        <div className="p-6">
          <div className="flex items-center gap-3">
            <Library className="h-8 w-8 text-indigo-300" />
            <div>
              <h1 className="text-xl font-bold">Library</h1>
              <p className="text-xs text-indigo-300">Management System</p>
            </div>
          </div>
        </div>
        
        <nav className="mt-6 px-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 rounded-lg px-4 py-3 mb-2 transition-all ${
                  isActive
                    ? 'bg-white/20 text-white'
                    : 'text-indigo-200 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>
        
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="rounded-lg bg-white/10 p-4">
            <p className="text-xs text-indigo-200">Backend API:</p>
            <p className="text-sm font-mono text-white mt-1">localhost:8080</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 min-h-screen">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
