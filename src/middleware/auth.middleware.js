import admin from 'firebase-admin';

export const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: "Authentication token required" });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.userId = decodedToken.uid;
    next();
  } catch (error) {
    console.error("Firebase ID Token Verification Error:", error.message);
    if (error.code === 'auth/id-token-expired') {
        return res.status(403).json({ message: "Firebase ID token expired." });
    }
    if (error.code === 'auth/argument-error') {
        return res.status(403).json({ message: "Invalid Firebase ID token format." });
    }
    return res.status(403).json({ message: "Invalid or expired Firebase ID token." });
  }
};