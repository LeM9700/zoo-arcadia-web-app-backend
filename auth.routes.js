const express = require('express');
const router = express.Router();
const User = require('../models/User');
const WorkContract = require('../models/WorkContract');  // Modèle pour les contrats de travail
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// @route    POST /api/auth/register
// @desc     Register a new user with a valid contract number
router.post('/register', async (req, res) => {
  const { name, email, password, contractNumber } = req.body;

  try {
    // Vérifie si l'utilisateur existe déjà
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Vérifie si le numéro de contrat est valide
    const workContract = await WorkContract.findOne({ contractNumber });
    if (!workContract) {
      return res.status(400).json({ message: 'Invalid contract number' });
    }

    // Crée l'utilisateur avec le rôle défini par le contrat de travail
    user = new User({
      name,
      email,
      password,
      role: workContract.role,  // Le rôle est défini par le contrat
      contractNumber,
    });

    await user.save();

    const payload = {
      user: {
        id: user.id,
        role: user.role,
      },
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route    POST /api/auth/login
// @desc     Login user and get token
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    console.log("Tentative de connexion avec l'email:", email);
    const user = await User.findOne({ email });
    if (!user) {
        console.log("Utilisateur non trouvé avec cet email.");
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    console.log("Utilisateur trouvé, comparaison des mots de passe...");
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        console.log("Le mot de passe ne correspond pas.");
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    console.log("Mot de passe correct, génération du token JWT.");

    const payload = {
      user: {
        id: user.id,
        role: user.role,
      },
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });
    console.log("Connexion réussie, token envoyé.");
    res.json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route    POST /api/auth/requestWorkspace
// @desc     Request workspace creation
// @access   Private (accessible uniquement avec un token JWT valide)
router.post('/requestWorkspace', authMiddleware, async (req, res) => {
  try {
    // Vérifie si l'utilisateur a déjà un espace de travail
    let user = await User.findById(req.user.id);
    if (user.spaceCreated) {
      return res.status(400).json({ message: 'Workspace already created' });
    }

    // Mets à jour l'utilisateur pour indiquer que l'espace a été créé
    user.spaceCreated = true;
    await user.save();

    res.json({ message: 'Workspace request submitted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route    POST /api/admin/createUser
// @desc     Créer un utilisateur (Accessible uniquement pour les administrateurs)
// @access   Private (admin only)
router.post('/admin/createUser', authMiddleware, roleMiddleware('admin'), async (req, res) => {
    const { name, email, password, role, contractNumber  } = req.body;
  
    try {
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ message: 'User already exists' });
      }
  
      user = new User({
        name,
        email,
        password,
        role, // Le rôle est défini par l'admin lors de la création
        contractNumber 
      });
  
      await user.save();
      res.json({ message: 'User created successfully' });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ message: 'Server Error' });
    }
  });
  
  // @route    GET /api/veterinarian/reports
  // @desc     Obtenir les comptes-rendus vétérinaires (Accessible uniquement aux vétérinaires)
  // @access   Private (veterinarian only)
  router.get('/veterinarian/reports', authMiddleware, roleMiddleware('veterinarian'), async (req, res) => {
    // Logique pour obtenir les rapports vétérinaires
    res.json({ message: 'Veterinarian reports retrieved successfully' });
  });
  
  // @route    GET /api/employee/services
  // @desc     Obtenir la gestion des services (Accessible uniquement aux employés)
  // @access   Private (employee only)
  router.get('/employee/services', authMiddleware, roleMiddleware('employee'), async (req, res) => {
    // Logique pour gérer les services du zoo
    res.json({ message: 'Employee service management access granted' });
  });


  // @route    POST /api/admin/addContracts
// @desc     Ajouter des contrats de travail
// @access   Private (admin only)
router.post('/addContracts', async (req, res) => {
    try {
      const contracts = [
        { contractNumber: 'CT123456', role: 'admin' },
        { contractNumber: 'CT123457', role: 'veterinarian' },
        { contractNumber: 'CT123458', role: 'employee' }
      ];
  
      await WorkContract.insertMany(contracts);
      res.json({ message: 'Contracts added successfully' });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ message: 'Server Error' });
    }
  });

module.exports = router;
