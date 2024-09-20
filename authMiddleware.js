const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  // Récupérer le token depuis l'en-tête
  const token = req.header('x-auth-token');

  // Vérifier si le token est présent
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    // Décoder le token JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Ajouter l'utilisateur décodé à l'objet req
    req.user = decoded.user;

    // Vérifier si l'utilisateur a un rôle admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied, admins only' });
    }

    next(); // Passer à la prochaine étape
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};
