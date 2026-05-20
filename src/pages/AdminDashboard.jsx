import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  LogOut, Search, Trash2, Eye, X, Calendar, Users, CreditCard,
  ChevronLeft, ChevronRight, Loader2, Leaf, RefreshCw, Clock,
  Mail, Phone, Package, MapPin, AlertCircle,
} from 'lucide-react';
import { apiFetch } from '../config/api';

/* ── helpers ─────────────────────────────────────────────────── */
const token = () => localStorage.getItem('janani_admin_token');
const authFetch = (url, opts = {}) =>
  apiFetch(url, { ...opts, headers: { ...opts.headers, Authorization: `Bearer ${token()}` } });

const fmt = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';
const statusColor = {
  pending: 'bg-amber-100 text-amber-800', confirmed: 'bg-emerald-100 text-emerald-800',
  'checked-in': 'bg-blue-100 text-blue-800', 'checked-out': 'bg-indigo-100 text-indigo-800',
  completed: 'bg-green-100 text-green-800', cancelled: 'bg-red-100 text-red-800',
  'no-show': 'bg-gray-100 text-gray-600',
};

/* ── stat card ────────────────────────────────────────────────── */
const StatCard = ({ icon: Icon, label, value, color }) => (
  <motion.div
    className="bg-white/[0.06] backdrop-blur-sm border border-white/10 rounded-2xl p-5 hover:bg-white/[0.09] transition-all duration-300"
    whileHover={{ y: -2 }}
  >
    <div className="flex items-center gap-3 mb-3">
      <div className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <span className="text-white/40 text-xs tracking-wider uppercase">{label}</span>
    </div>
    <p className="text-white text-3xl font-light">{value ?? '—'}</p>
  </motion.div>
);

/* ── booking detail modal ─────────────────────────────────────── */
const BookingModal = ({ booking, onClose }) => {
  if (!booking) return null;
  const g = booking.primaryGuest || {};
  const p = booking.pricing || {};
  const Row = ({ label, val }) => (
    <div className="flex justify-between py-2.5 border-b border-white/5 last:border-0">
      <span className="text-white/40 text-sm">{label}</span>
      <span className="text-white text-sm font-medium text-right max-w-[60%]">{val || '—'}</span>
    </div>
  );

  const [updating, setUpdating] = useState(false);

  const updateStatus = async (newStatus) => {
    setUpdating(true);
    try {
      await authFetch(`/booking/${booking._id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus }),
      });
      // Refresh local state if needed or just close and let parent refresh
      onClose(true); // pass true to indicate a refresh is needed
    } catch (err) {
      alert(err.message || 'Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <motion.div className="fixed inset-0 z-[100] flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => onClose()} />
      <motion.div
        className="relative bg-gradient-to-b from-forest-900 to-forest-950 border border-white/10 rounded-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto shadow-2xl"
        initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
      >
        <div className="sticky top-0 bg-forest-900/95 backdrop-blur-sm border-b border-white/10 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
          <div>
            <h3 className="text-white font-serif text-lg">Booking Details</h3>
            <span className="text-gold-400 text-xs font-mono tracking-wider">{booking.bookingRef}</span>
          </div>
          <button onClick={() => onClose()} className="text-white/40 hover:text-white transition-colors p-1"><X className="w-5 h-5" /></button>
        </div>

        <div className="p-6 space-y-6">
          {/* Status Management */}
          <div className="space-y-3">
            <h4 className="text-gold-400 text-xs tracking-wider uppercase flex items-center gap-2"><RefreshCw className="w-3.5 h-3.5" />Manage Status</h4>
            <div className="flex flex-wrap gap-2">
              <select
                value={booking.status}
                disabled={updating}
                onChange={(e) => updateStatus(e.target.value)}
                className="flex-1 bg-white/[0.05] border border-white/10 rounded-xl px-4 py-2 text-white text-sm focus:outline-none focus:border-gold-500/40 appearance-none cursor-pointer disabled:opacity-50"
              >
                {['pending', 'confirmed', 'checked-in', 'checked-out', 'completed', 'cancelled', 'no-show'].map(s => (
                  <option key={s} value={s} className="bg-forest-900">{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                ))}
              </select>
              <div className={`px-4 py-2 rounded-xl text-xs font-medium flex items-center ${booking.paymentStatus === 'fully-paid' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'}`}>
                {booking.paymentStatus?.replace('-', ' ').toUpperCase()}
              </div>
            </div>
            {updating && (
              <div className="flex items-center gap-2 text-gold-400 text-[10px] animate-pulse">
                <Loader2 className="w-3 h-3 animate-spin" /> Updating status...
              </div>
            )}
          </div>

          {/* Guest Info */}
          <div>
            <h4 className="text-gold-400 text-xs tracking-wider uppercase mb-3 flex items-center gap-2"><Users className="w-3.5 h-3.5" />Guest Information</h4>
            <div className="bg-white/[0.03] rounded-xl p-4">
              <Row label="Name" val={`${g.firstName || ''} ${g.lastName || ''}`} />
              <Row label="Email" val={g.email} />
              <Row label="Phone" val={`${g.countryCode || ''} ${g.phone || ''}`} />
              <Row label="Nationality" val={g.nationality} />
            </div>
          </div>

          {/* Booking Info */}
          <div>
            <h4 className="text-gold-400 text-xs tracking-wider uppercase mb-3 flex items-center gap-2"><Calendar className="w-3.5 h-3.5" />Stay Details</h4>
            <div className="bg-white/[0.03] rounded-xl p-4">
              <Row label="Check-in" val={fmt(booking.checkIn)} />
              <Row label="Check-out" val={fmt(booking.checkOut)} />
              <Row label="Nights" val={booking.nights} />
              <Row label="Package" val={booking.packageName || booking.packageId} />
              <Row label="Guests" val={`${booking.totalGuests?.adults || 1} adults, ${booking.totalGuests?.children || 0} children`} />
              <Row label="Source" val={booking.source} />
            </div>
          </div>

          {/* Pricing */}
          <div>
            <h4 className="text-gold-400 text-xs tracking-wider uppercase mb-3 flex items-center gap-2"><CreditCard className="w-3.5 h-3.5" />Pricing</h4>
            <div className="bg-white/[0.03] rounded-xl p-4">
              <Row label="Base Price" val={`${p.currency || 'USD'} ${p.basePrice?.toFixed(2)}`} />
              <Row label="Subtotal" val={`${p.currency || 'USD'} ${p.subtotal?.toFixed(2)}`} />
              <Row label="Tax" val={`${p.currency || 'USD'} ${p.taxAmount?.toFixed(2)}`} />
              <div className="flex justify-between py-2.5 border-t border-gold-500/20 mt-1">
                <span className="text-gold-400 text-sm font-medium">Total</span>
                <span className="text-gold-400 text-sm font-bold">{p.currency || 'USD'} {p.totalAmount?.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Special Requests */}
          {booking.specialRequests && (
            <div>
              <h4 className="text-gold-400 text-xs tracking-wider uppercase mb-3">Special Requests</h4>
              <p className="text-white/60 text-sm bg-white/[0.03] rounded-xl p-4 leading-relaxed">{booking.specialRequests}</p>
            </div>
          )}

          {/* Timeline */}
          {booking.timeline?.length > 0 && (
            <div>
              <h4 className="text-gold-400 text-xs tracking-wider uppercase mb-3 flex items-center gap-2"><Clock className="w-3.5 h-3.5" />Timeline</h4>
              <div className="space-y-2">
                {booking.timeline.map((e, i) => (
                  <div key={i} className="flex gap-3 text-xs bg-white/[0.03] rounded-lg p-3">
                    <span className="text-white/30 whitespace-nowrap">{fmt(e.timestamp)}</span>
                    <span className="text-white/70">{e.event}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <p className="text-white/20 text-xs text-center pt-2">
            Created: {fmt(booking.createdAt)} · Updated: {fmt(booking.updatedAt)}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

/* ── main dashboard ───────────────────────────────────────────── */
const AdminDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({});
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Auth check
  useEffect(() => {
    const t = token();
    const u = localStorage.getItem('janani_admin_user');
    if (!t || !u) { navigate('/admin'); return; }
    try { setUser(JSON.parse(u)); } catch { navigate('/admin'); }
  }, [navigate]);

  // Fetch bookings
  const fetchBookings = useCallback(async () => {
    setLoading(true);
    try {
      let url = `/booking?page=${page}&limit=10&sort=-createdAt`;
      if (statusFilter) url += `&status=${statusFilter}`;
      if (search) url += `&search=${encodeURIComponent(search)}`;
      const res = await authFetch(url);
      setBookings(res.data || []);
      setMeta(res.meta || {});
    } catch (err) {
      if (err.status === 401) { localStorage.clear(); navigate('/admin'); }
    } finally { setLoading(false); }
  }, [page, statusFilter, search, navigate]);

  // Fetch stats
  const fetchStats = useCallback(async () => {
    try {
      const res = await authFetch('/booking/stats');
      setStats(res.data);
    } catch {}
  }, []);

  useEffect(() => { if (user) { fetchBookings(); fetchStats(); } }, [user, fetchBookings, fetchStats]);

  // View booking
  const viewBooking = async (id) => {
    try {
      const res = await authFetch(`/booking/${id}`);
      setSelectedBooking(res.data);
      setShowModal(true);
    } catch {}
  };

  // Delete booking
  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await authFetch(`/booking/${deleteId}`, { method: 'DELETE' });
      setDeleteId(null);
      fetchBookings();
      fetchStats();
    } catch (err) {
      alert(err.message || 'Cannot delete this booking');
    } finally { setDeleting(false); }
  };

  const logout = () => { localStorage.clear(); navigate('/admin'); };
  const totalPages = meta.totalPages || 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-forest-950 via-[#0f1f0e] to-forest-950">
      {/* Top Nav */}
      <nav className="sticky top-0 z-40 bg-forest-950/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-gold-400/20 to-gold-600/20 rounded-lg flex items-center justify-center border border-gold-500/20">
              <Leaf className="w-4 h-4 text-gold-400" />
            </div>
            <div>
              <span className="text-white font-serif text-sm">Janani</span>
              <span className="text-white/30 text-xs ml-1.5 hidden sm:inline">Dashboard</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-white/40 text-xs hidden sm:block">Welcome, {user?.name || 'Admin'}</span>
            <button onClick={logout} className="flex items-center gap-2 text-white/40 hover:text-red-400 text-xs transition-colors">
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-white font-serif text-2xl sm:text-3xl">Booking Management</h1>
          <p className="text-white/30 text-sm mt-1">View and manage all guest bookings</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={Package} label="Total Bookings" value={stats?.total} color="bg-forest-600" />
          <StatCard icon={Clock} label="Pending" value={stats?.byStatus?.pending || 0} color="bg-amber-600" />
          <StatCard icon={Users} label="Confirmed" value={stats?.byStatus?.confirmed || 0} color="bg-emerald-600" />
          <StatCard icon={Calendar} label="This Month" value={stats?.monthToDate} color="bg-blue-600" />
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search by name, email, or ref..."
              className="w-full pl-11 pr-4 py-3 bg-white/[0.05] border border-white/10 rounded-xl text-white placeholder:text-white/20 text-sm focus:outline-none focus:border-gold-500/40 transition-colors"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="px-4 py-3 bg-white/[0.05] border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-gold-500/40 appearance-none cursor-pointer min-w-[150px]"
          >
            <option value="" className="bg-forest-900">All Statuses</option>
            {['pending', 'confirmed', 'checked-in', 'checked-out', 'completed', 'cancelled', 'no-show'].map(s => (
              <option key={s} value={s} className="bg-forest-900">{s.charAt(0).toUpperCase() + s.slice(1)}</option>
            ))}
          </select>
          <button onClick={() => { fetchBookings(); fetchStats(); }} className="px-4 py-3 bg-white/[0.05] border border-white/10 rounded-xl text-white/50 hover:text-white hover:bg-white/[0.08] transition-all">
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* Table */}
        <div className="bg-white/[0.03] border border-white/8 rounded-2xl overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-6 h-6 text-gold-400 animate-spin" />
            </div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-20">
              <AlertCircle className="w-10 h-10 text-white/20 mx-auto mb-3" />
              <p className="text-white/40 text-sm">No bookings found</p>
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/5">
                      {['Ref', 'Guest', 'Package', 'Check-in', 'Status', 'Amount', 'Actions'].map(h => (
                        <th key={h} className="text-left text-white/30 text-xs tracking-wider uppercase px-5 py-4 font-medium">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((b, i) => (
                      <motion.tr
                        key={b._id}
                        className="border-b border-white/5 hover:bg-white/[0.03] transition-colors"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.03 }}
                      >
                        <td className="px-5 py-4">
                          <span className="text-gold-400 text-xs font-mono tracking-wider">{b.bookingRef}</span>
                        </td>
                        <td className="px-5 py-4">
                          <p className="text-white text-sm">{b.primaryGuest?.firstName} {b.primaryGuest?.lastName}</p>
                          <p className="text-white/30 text-xs">{b.primaryGuest?.email}</p>
                        </td>
                        <td className="px-5 py-4 text-white/60 text-sm">{b.packageName || b.packageId || '—'}</td>
                        <td className="px-5 py-4 text-white/60 text-sm">{fmt(b.checkIn)}</td>
                        <td className="px-5 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColor[b.status] || 'bg-gray-100 text-gray-600'}`}>
                            {b.status}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-white text-sm font-medium">
                          {b.pricing?.currency || 'USD'} {b.pricing?.totalAmount?.toFixed(2)}
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <button onClick={() => viewBooking(b._id)} className="p-2 text-white/30 hover:text-gold-400 hover:bg-white/[0.05] rounded-lg transition-all" title="View details">
                              <Eye className="w-4 h-4" />
                            </button>
                            {['pending', 'cancelled'].includes(b.status) && (
                              <button onClick={() => setDeleteId(b._id)} className="p-2 text-white/30 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all" title="Delete">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden divide-y divide-white/5">
                {bookings.map((b) => (
                  <div key={b._id} className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gold-400 text-xs font-mono">{b.bookingRef}</span>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColor[b.status]}`}>{b.status}</span>
                    </div>
                    <p className="text-white text-sm">{b.primaryGuest?.firstName} {b.primaryGuest?.lastName}</p>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-white/40">{fmt(b.checkIn)} → {fmt(b.checkOut)}</span>
                      <span className="text-white font-medium">{b.pricing?.currency} {b.pricing?.totalAmount?.toFixed(2)}</span>
                    </div>
                    <div className="flex gap-2 pt-1">
                      <button onClick={() => viewBooking(b._id)} className="flex-1 py-2 bg-white/[0.05] border border-white/10 rounded-lg text-white/60 text-xs hover:bg-white/[0.1] transition-all flex items-center justify-center gap-1.5">
                        <Eye className="w-3.5 h-3.5" /> View
                      </button>
                      {['pending', 'cancelled'].includes(b.status) && (
                        <button onClick={() => setDeleteId(b._id)} className="py-2 px-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-xs hover:bg-red-500/20 transition-all flex items-center gap-1.5">
                          <Trash2 className="w-3.5 h-3.5" /> Delete
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between px-5 py-4 border-t border-white/5">
                  <span className="text-white/30 text-xs">Page {page} of {totalPages}</span>
                  <div className="flex gap-2">
                    <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1}
                      className="p-2 bg-white/[0.05] border border-white/10 rounded-lg text-white/50 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all">
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page >= totalPages}
                      className="p-2 bg-white/[0.05] border border-white/10 rounded-lg text-white/50 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all">
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* Booking Detail Modal */}
      <AnimatePresence>
        {showModal && (
          <BookingModal
            booking={selectedBooking}
            onClose={(refresh) => {
              setShowModal(false);
              setSelectedBooking(null);
              if (refresh === true) {
                fetchBookings();
                fetchStats();
              }
            }}
          />
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteId && (
          <motion.div className="fixed inset-0 z-[100] flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setDeleteId(null)} />
            <motion.div className="relative bg-forest-900 border border-white/10 rounded-2xl p-6 w-full max-w-sm shadow-2xl text-center"
              initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}>
              <div className="w-14 h-14 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-7 h-7 text-red-400" />
              </div>
              <h3 className="text-white font-serif text-lg mb-2">Delete Booking?</h3>
              <p className="text-white/40 text-sm mb-6">This action cannot be undone. Only pending or cancelled bookings can be deleted.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteId(null)} className="flex-1 py-3 bg-white/[0.05] border border-white/10 rounded-xl text-white/60 text-sm hover:bg-white/[0.1] transition-all">Cancel</button>
                <button onClick={handleDelete} disabled={deleting}
                  className="flex-1 py-3 bg-red-500/20 border border-red-500/30 rounded-xl text-red-400 text-sm hover:bg-red-500/30 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                  {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                  {deleting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminDashboard;
