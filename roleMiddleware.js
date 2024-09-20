module.exports = function (...allowedRoles) {
    return (req, res, next) => {
      // Vérifie si l'utilisateur est authentifié
      if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
  
      // Vérifie si l'utilisateur a l'un des rôles autorisés
      const { role } = req.user;
      console.log('User role:', role);
      if (!allowedRoles.includes(role)) {
        return res.status(403).json({ message: `Access denied for role: ${role}` });
      }
  
      next();
    };
  };
  