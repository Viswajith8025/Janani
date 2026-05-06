import React, { useState } from 'react';
import { motion } from 'framer-motion';
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

  // Mock Stats Data
  const stats = [
    { label: 'Total Revenue', value: '₹12,45,000', icon: TrendingUp, color: 'text-gold-600', bg: 'bg-gold-50' },
    { label: 'Total Bookings', value: '148', icon: Calendar, color: 'text-forest-600', bg: 'bg-forest-50' },
    { label: 'Active Guests', value: '24', icon: Users, color: 'text-sage-600', bg: 'bg-sage-50' },
    { label: 'Pending Payments', value: '₹84,200', icon: CreditCard, color: 'text-earth-600', bg: 'bg-earth-100' },
  ];

  // Mock Booking Data
  const bookings = [
    { id: 'BK-1082', guest: 'Aditi Sharma', retreat: 'Mud Houses Stay', date: '2024-05-12', status: 'Confirmed', amount: '₹18,500', payment: 'Paid' },
    { id: 'BK-1083', guest: 'Rahul Verma', retreat: 'Ayurvedic Therapy', date: '2024-05-14', status: 'Pending', amount: '₹12,200', payment: 'Partial' },
    { id: 'BK-1084', guest: 'Elena Gilbert', retreat: 'Yoga & Meditation', date: '2024-05-15', status: 'Confirmed', amount: '₹25,000', payment: 'Paid' },
    { id: 'BK-1085', guest: 'Vikram Singh', retreat: 'Kalari Intensive', date: '2024-05-18', status: 'In Progress', amount: '₹45,000', payment: 'Paid' },
    { id: 'BK-1086', guest: 'Priya Iyer', retreat: 'Detox & Mud Bath', date: '2024-05-20', status: 'Pending', amount: '₹8,500', payment: 'Unpaid' },
    { id: 'BK-1087', guest: 'David Miller', retreat: 'Spiritual Retreat', date: '2024-05-22', status: 'Confirmed', amount: '₹32,000', payment: 'Paid' },
  ];

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Confirmed': return 'bg-forest-100 text-forest-800';
      case 'Pending': return 'bg-earth-100 text-earth-800';
      case 'In Progress': return 'bg-gold-100 text-gold-800';
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
                {bookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-earth-50/30 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-mono text-forest-600">{booking.id}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-sage-100 flex items-center justify-center text-sage-700 font-bold text-xs">
                          {booking.guest.charAt(0)}
                        </div>
                        <span className="text-sm font-medium text-forest-900">{booking.guest}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-forest-600">
                      {booking.retreat}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-forest-600">
                      {booking.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusStyle(booking.status)}`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        {booking.payment === 'Paid' ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        ) : booking.payment === 'Partial' ? (
                          <Clock className="w-4 h-4 text-amber-500" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-rose-500" />
                        )}
                        <span className="text-sm text-forest-700 font-medium">{booking.payment}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-forest-900">
                      {booking.amount}
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

          {/* Pagination Mockup */}
          <div className="p-6 border-t border-forest-50 flex items-center justify-between">
            <p className="text-xs text-forest-500 font-medium">Showing 1 to 6 of 148 entries</p>
            <div className="flex gap-2">
              <button disabled className="px-3 py-1 border border-forest-100 rounded-md text-xs font-bold text-forest-300">Prev</button>
              <button className="px-3 py-1 bg-forest-800 text-white rounded-md text-xs font-bold shadow-md">1</button>
              <button className="px-3 py-1 border border-forest-100 rounded-md text-xs font-bold text-forest-600 hover:bg-forest-50">2</button>
              <button className="px-3 py-1 border border-forest-100 rounded-md text-xs font-bold text-forest-600 hover:bg-forest-50">3</button>
              <button className="px-3 py-1 border border-forest-100 rounded-md text-xs font-bold text-forest-600 hover:bg-forest-50">Next</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
