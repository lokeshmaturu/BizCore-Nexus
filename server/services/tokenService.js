/**
 * Token Service
 * Manages JWT generation, verification, and HTTP-only cookie attachments.
 */

const jwt = require('jsonwebtoken');

const getCookieOptions = () => {
  const isProduction = process.env.NODE_ENV === 'production';
  const cookieDays = parseInt(process.env.JWT_COOKIE_EXPIRE || '7', 10);

  return {
    expires: new Date(Date.now() + cookieDays * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: isProduction, // HTTPS only in production
    sameSite: isProduction ? 'strict' : 'lax',
    path: '/',
  };
};

/**
 * Attach authentication JWT cookie and return response payload
 */
const sendTokenResponse = (user, statusCode, res, message = 'Authenticated successfully') => {
  const token = user.generateJWT();
  const cookieOptions = getCookieOptions();

  res.cookie('token', token, cookieOptions);

  return res.status(statusCode).json({
    success: true,
    message,
    token, // Also supplied for client bearer auth header option
    user: {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      companyName: user.companyName,
      branch: user.branch,
      profileImage: user.profileImage,
      isActive: user.isActive,
      createdAt: user.createdAt,
    },
  });
};

/**
 * Clear JWT Cookie on Logout
 */
const clearTokenCookie = (res) => {
  const isProduction = process.env.NODE_ENV === 'production';
  res.cookie('token', 'none', {
    expires: new Date(Date.now() - 1000),
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'strict' : 'lax',
    path: '/',
  });
};

/**
 * Verify JWT Token directly
 */
const verifyToken = (token) => {
  const secret = process.env.JWT_SECRET || 'bizcore_fallback_secret_change_me';
  return jwt.verify(token, secret);
};

module.exports = {
  sendTokenResponse,
  clearTokenCookie,
  verifyToken,
  getCookieOptions,
};
