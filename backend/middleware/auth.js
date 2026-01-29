import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import AuditLog from '../models/AuditLog.js';

// Protect routes - verify JWT token
export const protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route',
      });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
      req.user = await User.findById(decoded.id).select('-password');
      
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'User not found',
        });
      }

      if (!req.user.isActive) {
        return res.status(401).json({
          success: false,
          message: 'User account is deactivated',
        });
      }

      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized, token failed',
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Admin only access
export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: 'Access denied. Admin privileges required.',
    });
  }
};

// Role-based access control
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized',
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role '${req.user.role}' is not authorized to access this route`,
      });
    }

    next();
  };
};

// Audit log middleware
export const auditLog = (action, resourceParam) => {
  return async (req, res, next) => {
    // Store original send function
    const originalSend = res.send;

    res.send = async function (data) {
      try {
        const statusCode = res.statusCode;
        
        // Validate resourceId is a valid ObjectId before saving
        const resourceId = req.params.id || req.body._id;
        const isValidObjectId = resourceId && /^[0-9a-fA-F]{24}$/.test(resourceId);
        
        // Use the resourceParam passed to the middleware
        const resource = resourceParam || 'unknown';
        
        await AuditLog.create({
          user: req.user ? req.user._id : null,
          action,
          resource,
          resourceId: isValidObjectId ? resourceId : null,
          details: {
            method: req.method,
            path: req.path,
            body: req.body,
            query: req.query,
          },
          ipAddress: req.ip || req.connection.remoteAddress,
          userAgent: req.headers['user-agent'],
          status: statusCode >= 200 && statusCode < 300 ? 'success' : 'failed',
        });
      } catch (error) {
        console.error('Audit log error:', error);
      }

      // Call original send
      originalSend.call(this, data);
    };

    next();
  };
};
