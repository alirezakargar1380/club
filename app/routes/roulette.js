var express = require('express');
var router = express.Router();

const rouletteController = require('../controllers/roulette.controller');

// http://localhost:3000/roulette
router.get('/', rouletteController.index);
router.post('/', rouletteController.create);
router.get('/:id', rouletteController.show);
router.put('/', rouletteController.update);
router.delete('/:id', rouletteController.destroy);
router.post('/run', rouletteController.run);

module.exports = router;
