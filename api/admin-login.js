// Vercel Serverless Function — POST /api/admin-login  { password }
// The real password lives only in the ADMIN_PASSWORD env var on Vercel,
// never in the client-side code, so it can't be read from "view source".

module.exports = (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, error: 'method_not_allowed' });
    return;
  }

  const secret = process.env.ADMIN_PASSWORD;
  if (!secret) {
    res.status(500).json({ ok: false, error: 'admin_password_not_set' });
    return;
  }

  let password = '';
  try {
    // Vercel's Node runtime auto-parses JSON bodies into req.body.
    password = (req.body && req.body.password) || '';
  } catch (e) {
    password = '';
  }

  const ok = typeof password === 'string' && password.length > 0 && password === secret;

  // Tiny constant-ish delay so brute-forcing the password by timing the
  // response isn't meaningfully easier than just guessing.
  setTimeout(() => {
    res.status(200).json({ ok });
  }, 150);
};
