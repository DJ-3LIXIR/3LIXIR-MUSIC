
process.env.SUPABASE_URL = 'https://example.supabase.co';
process.env.SUPABASE_SERVICE_KEY = 'mock-key';
process.env.SUPABASE_ANON_KEY = 'mock-anon-key';

try {
  const authMiddleware = require('./middleware/auth');
  console.log('Auth Middleware Export:', authMiddleware);
  console.log('Type of authenticateUser:', typeof authMiddleware.authenticateUser);
} catch (error) {
  console.error('Error requiring auth middleware:', error);
}
