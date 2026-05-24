import app from '../backend/app.js';

const PORT = process.env.PORT || 5000;

// Run server locally if not in Vercel environment
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🌿 Janani Backend running at http://localhost:${PORT}`);
    console.log(`🚀 API Base: http://localhost:${PORT}/api/v1`);
  });
}

// Export the app for Vercel Serverless Functions
export default app;
