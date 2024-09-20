const express = require('express');
const router = express.Router();
const Animal = require('../models/animals');

// @route    GET /api/animals
// @desc     Get all animals
router.get('/', async (req, res) => {
  try {
    const animals = await Animal.find().populate('habitat');
    res.json(animals);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route    POST /api/animals
// @desc     Add a new animal
router.post('/', async (req, res) => {
  const { name, species, age, habitat, description, healthStatus } = req.body;
  try {
    const newAnimal = new Animal({
      name,
      species,
      age,
      habitat,
      description,
      healthStatus,
    });

    const animal = await newAnimal.save();
    res.json(animal);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route    GET /api/animals/:id
// @desc     Get animal by ID
router.get('/:id', async (req, res) => {
  try {
    const animal = await Animal.findById(req.params.id).populate('habitat');
    if (!animal) {
      return res.status(404).json({ message: 'Animal not found' });
    }
    res.json(animal);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route    PUT /api/animals/:id
// @desc     Update animal
router.put('/:id', async (req, res) => {
    const { name, species, age, habitat, description, healthStatus } = req.body;
    try {
      let animal = await Animal.findById(req.params.id);
      if (!animal) {
        return res.status(404).json({ message: 'Animal not found' });
      }
  
      animal.name = name || animal.name;
      animal.species = species || animal.species;
      animal.age = age || animal.age;
      animal.habitat = habitat || animal.habitat;
      animal.description = description || animal.description;
      animal.healthStatus = healthStatus || animal.healthStatus;
  
      await animal.save();
      res.json(animal);
    } catch (err) {
      res.status(500).json({ message: 'Server Error' });
    }
  });
  
  // @route    DELETE /api/animals/:id
  // @desc     Delete animal
  router.delete('/:id', async (req, res) => {
    try {
      const animal = await Animal.findByIdAndDelete(req.params.id);
      if (!animal) {
        return res.status(404).json({ message: 'Animal not found' });
      }
  
      res.json({ message: 'Animal removed' });
    } catch (err) {
      console.error(err);  // Affiche l'erreur complète dans la console  
      res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
