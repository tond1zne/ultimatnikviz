// Vercel Serverless Function — GET /api/config
// Reads Firebase config from environment variables (set in Vercel dashboard)
// and hands it to the browser at runtime, so nothing is hardcoded in the
// static files. Firebase *client* config is not a secret by design (it is
// always visible to anyone using the app), but keeping it in env vars means
// you never commit it to git and can change it per-deployment.

module.exports = (req, res) => {
  res.setHeader('Cache-Control', 'no-store');

  const required = [
    'FIREBASE_API_KEY',
    'FIREBASE_AUTH_DOMAIN',
    'FIREBASE_DATABASE_URL',
    'FIREBASE_PROJECT_ID',
  ];
  const missing = required.filter((k) => !process.env[k]);
  if (missing.length) {
    res.status(500).json({
      error: 'missing_env',
      missing,
      hint: 'Nastav tyto proměnné v Vercel → Project → Settings → Environment Variables a udělej redeploy.',
    });
    return;
  }

  res.status(200).json({
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.FIREBASE_DATABASE_URL,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET || '',
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || '',
    appId: process.env.FIREBASE_APP_ID || '',
  });
};
