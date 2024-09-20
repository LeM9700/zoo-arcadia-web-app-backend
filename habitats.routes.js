const express = require('express');
const router = express.Router();
const Habitat = require('../models/habitat');

// @route    GET /api/habitats
// @desc     Get all habitats
router.get('/', async (req, res) => {
  try {
    const habitats = await Habitat.find();
    res.json(habitats);
    console.log('GET /api/habitats hit');
    res.send('Habitat route reached');
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route    POST /api/habitats
// @desc     Add a new habitat
router.post('/', async (req, res) => {
  console.log('POST /api/habitats hit')
  const { name, description, image } = req.body;
  try {
    const newHabitat = new Habitat({
      name,
      description,
      image,
    });

    const habitat = await newHabitat.save();
    res.json(habitat);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
