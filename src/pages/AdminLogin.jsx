import { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Mail, Loader2, Eye, EyeOff, Leaf } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../config/api';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      // Store Supabase access_token and profile (same keys as before)
      localStorage.setItem('janani_admin_token', res.data.token);
      localStorage.setItem('janani_admin_user', JSON.stringify(res.data.user));

      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.message || 'Invalid credentials. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-forest-950 via-forest-900 to-forest-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-1/4 -left-20 w-[500px] h-[500px] bg-forest-800/30 rounded-full blur-[120px]"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-1/4 -right-20 w-[400px] h-[400px] bg-gold-500/10 rounded-full blur-[100px]"
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      <motion.div
        className="relative w-full max-w-md"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
      >
        {/* Logo & Header */}
        <div className="text-center mb-8">
          <motion.div
            className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-gold-400/20 to-gold-600/20 rounded-2xl border border-gold-500/20 backdrop-blur-sm mb-6"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <Leaf className="w-8 h-8 text-gold-400" />
          </motion.div>
          <h1 className="font-serif text-3xl text-white mb-2">Admin Portal</h1>
          <p className="text-white/40 text-sm tracking-wide">Janani Lifestyle Management</p>
        </div>

        {/* Login Card */}
        <motion.div
          className="bg-white/[0.05] backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label className="block text-white/50 text-xs tracking-wider uppercase mb-2 font-medium">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@jananilifestyle.in"
                  required
                  className="w-full pl-12 pr-4 py-3.5 bg-white/[0.05] border border-white/10 rounded-xl
                           text-white placeholder:text-white/20 text-sm
                           focus:outline-none focus:border-gold-500/50 focus:bg-white/[0.08]
                           transition-all duration-300"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-white/50 text-xs tracking-wider uppercase mb-2 font-medium">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-12 pr-12 py-3.5 bg-white/[0.05] border border-white/10 rounded-xl
                           text-white placeholder:text-white/20 text-sm
                           focus:outline-none focus:border-gold-500/50 focus:bg-white/[0.08]
                           transition-all duration-300"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-red-300 text-sm"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {error}
              </motion.div>
            )}

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-gradient-to-r from-gold-500 to-gold-600 text-white font-medium text-sm
                       tracking-wider uppercase rounded-xl
                       hover:from-gold-600 hover:to-gold-700 hover:shadow-lg hover:shadow-gold-500/20
                       disabled:opacity-50 disabled:cursor-not-allowed
                       transition-all duration-300 flex items-center justify-center gap-2"
              whileHover={{ scale: isLoading ? 1 : 1.01 }}
              whileTap={{ scale: isLoading ? 1 : 0.99 }}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </motion.button>
          </form>
        </motion.div>

        {/* Footer */}
        <p className="text-center text-white/20 text-xs mt-6 tracking-wider">
          © {new Date().getFullYear()} Janani Lifestyle · Admin Access Only
        </p>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
