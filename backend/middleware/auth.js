import { createClient } from '@supabase/supabase-js';
import { logger } from '../utils/logger.js';

const supabaseUrl = process.env.SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder';

const supabase = createClient(supabaseUrl, supabaseKey);

export const verifyAdmin = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Missing or invalid Authorization header' });
    }

    const token = authHeader.split(' ')[1];
    
    // Validate JWT via Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      logger.warn('Unauthorized API access attempt', { error: error?.message });
      return res.status(403).json({ success: false, message: 'Forbidden: Invalid or expired token' });
    }

    // Role-based authorization - verify it's an admin domain email or specific role
    if (!user.email?.endsWith('@jananilifestyle.in') && user.email !== 'admin@jananilifestyle.in') {
      logger.warn('Non-admin user attempted admin API access', { email: user.email });
      return res.status(403).json({ success: false, message: 'Forbidden: Admin access required' });
    }

    req.user = user;
    next();
  } catch (error) {
    logger.error('Auth middleware failure', error);
    res.status(500).json({ success: false, message: 'Internal authentication error' });
  }
};
