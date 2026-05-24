import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { apiFetch } from '../../config/api';
import { 
  Users, 
  CreditCard, 
  Calendar, 
  TrendingUp, 
  ArrowLeft, 
  Download, 
  Search, 
  Filter, 
  ChevronRight,
  MoreVertical,
  CheckCircle2,
  Clock,
  AlertCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  useEffect(() => {
    const fetchBookings = async (silent = false) => {
      try {
        if (!silent) setIsLoading(true);
        const res = await apiFetch(`/bookings?page=${page}&limit=10`);
        setBookings(res.data || []);
        if (res.metadata) {
          setTotalPages(res.metadata.totalPages);
          setTotalRecords(res.metadata.total);
        }
      } catch (error) {
        console.error('Failed to fetch bookings:', error);
      } finally {
        if (!silent) setIsLoading(false);
      }
    };
    
    // Initial fetch
    fetchBookings();
    
    // Auto-refresh every 30 seconds (Real-time sync)
    const intervalId = setInterval(() => fetchBookings(true), 30000);
    return () => clearInterval(intervalId);
  }, [page]);

  // Compute stats from real data
  const totalRevenue = bookings
    .filter(b => b.status === 'confirmed')
    .reduce((sum, b) => {
      const pkgPrice = b.packageId === 'serenity' ? 899 : b.packageId === 'transformation' ? 1899 : 1399;
      return sum + (pkgPrice * (b.totalGuests?.adults || 1) * 83);
    }, 0);
    
  const pendingPayments = bookings
    .filter(b => b.status === 'pending_payment')
    .reduce((sum, b) => {
      const pkgPrice = b.packageId === 'serenity' ? 899 : b.packageId === 'transformation' ? 1899 : 1399;
      return sum + (pkgPrice * (b.totalGuests?.adults || 1) * 83);
    }, 0);

  // Mock Stats Data
  const stats = [
    { label: 'Total Revenue', value: `₹${totalRevenue.toLocaleString('en-IN')}`, icon: TrendingUp, color: 'text-gold-600', bg: 'bg-gold-50' },
    { label: 'Total Bookings', value: bookings.length.toString(), icon: Calendar, color: 'text-forest-600', bg: 'bg-forest-50' },
    { label: 'Active Guests', value: bookings.reduce((sum, b) => sum + (b.totalGuests?.adults || 1), 0).toString(), icon: Users, color: 'text-sage-600', bg: 'bg-sage-50' },
    { label: 'Pending Payments', value: `₹${pendingPayments.toLocaleString('en-IN')}`, icon: CreditCard, color: 'text-earth-600', bg: 'bg-earth-100' },
  ];

  const getStatusStyle = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-forest-100 text-forest-800';
      case 'pending_payment': return 'bg-earth-100 text-earth-800';
      case 'in_progress': return 'bg-gold-100 text-gold-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-earth-50 pt-24 pb-12 px-4 md:px-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <Link to="/" className="inline-flex items-center text-sm font-medium text-forest-600 hover:text-forest-800 transition-colors mb-2">
              <ArrowLeft className="w-4 h-4 mr-1" />
              Exit Dashboard
            </Link>
            <h1 className="text-3xl md:text-4xl font-serif text-forest-900">Admin Control Center</h1>
            <p className="text-forest-600 mt-1">Welcome back, Janani Team. Here's your overview.</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 border border-forest-200 rounded-full text-forest-800 hover:bg-forest-50 transition-all text-sm font-medium">
              <Download className="w-4 h-4" />
              Export Report
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white p-6 rounded-2xl shadow-elegant border border-forest-50"
          >
            <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center mb-4`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <p className="text-sm font-medium text-forest-500 uppercase tracking-widest">{stat.label}</p>
            <h3 className="text-2xl font-serif text-forest-900 mt-1">{stat.value}</h3>
          </motion.div>
        ))}
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-3xl shadow-premium border border-forest-50 overflow-hidden">
          {/* Table Header Controls */}
          <div className="p-6 border-b border-forest-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h2 className="text-xl font-serif text-forest-900">Recent Bookings</h2>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-forest-400" />
                <input 
                  type="text" 
                  placeholder="Search bookings..."
                  className="pl-10 pr-4 py-2 bg-earth-50 border border-forest-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-forest-200 transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button className="p-2 border border-forest-100 rounded-full hover:bg-forest-50 transition-all">
                <Filter className="w-4 h-4 text-forest-600" />
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-earth-50/50">
                  <th className="px-6 py-4 text-xs font-bold text-forest-500 uppercase tracking-wider">Booking ID</th>
                  <th className="px-6 py-4 text-xs font-bold text-forest-500 uppercase tracking-wider">Guest Name</th>
                  <th className="px-6 py-4 text-xs font-bold text-forest-500 uppercase tracking-wider">Retreat / Experience</th>
                  <th className="px-6 py-4 text-xs font-bold text-forest-500 uppercase tracking-wider">Arrival Date</th>
                  <th className="px-6 py-4 text-xs font-bold text-forest-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-forest-500 uppercase tracking-wider">Payment</th>
                  <th className="px-6 py-4 text-xs font-bold text-forest-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-4 text-xs font-bold text-forest-500 uppercase tracking-wider"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-forest-50">
                {isLoading ? (
                  <tr>
                    <td colSpan="8" className="px-6 py-8 text-center text-forest-500">
                      Loading bookings...
                    </td>
                  </tr>
                ) : bookings.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="px-6 py-8 text-center text-forest-500">
                      No bookings found.
                    </td>
                  </tr>
                ) : bookings.filter(b => b.bookingRef.toLowerCase().includes(searchTerm.toLowerCase()) || `${b.firstName} ${b.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())).map((booking) => (
                  <tr key={booking.id} className="hover:bg-earth-50/30 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-mono text-forest-600">{booking.bookingRef}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-sage-100 flex items-center justify-center text-sage-700 font-bold text-xs">
                          {booking.firstName.charAt(0)}
                        </div>
                        <span className="text-sm font-medium text-forest-900">{booking.firstName} {booking.lastName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-forest-600">
                      {booking.packageName || booking.packageId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-forest-600">
                      {booking.checkIn || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusStyle(booking.status)}`}>
                        {booking.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        {booking.status === 'confirmed' ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-amber-500" />
                        )}
                        <span className="text-sm text-forest-700 font-medium">
                          {booking.status === 'confirmed' ? 'Paid' : 'Pending'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-forest-900">
                      ${((booking.packageId === 'serenity' ? 899 : booking.packageId === 'transformation' ? 1899 : 1399) * (booking.totalGuests?.adults || 1)).toLocaleString('en-US')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-forest-400 group-hover:text-forest-600">
                      <button className="p-1 rounded-lg hover:bg-forest-50">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="p-6 border-t border-forest-50 flex items-center justify-between">
            <p className="text-xs text-forest-500 font-medium">
              Showing page {page} of {totalPages} ({totalRecords} total entries)
            </p>
            <div className="flex gap-2">
              <button 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1 border border-forest-100 rounded-md text-xs font-bold text-forest-600 hover:bg-forest-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Prev
              </button>
              
              <button className="px-3 py-1 bg-forest-800 text-white rounded-md text-xs font-bold shadow-md">
                {page}
              </button>
              
              <button 
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="px-3 py-1 border border-forest-100 rounded-md text-xs font-bold text-forest-600 hover:bg-forest-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
