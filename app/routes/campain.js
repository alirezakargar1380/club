var express = require('express');
var router = express.Router();

const compainController = require('../controllers/campain.controller')

// http://localhost:3000/competitionController
router.get('/', compainController.index);
router.post('/', compainController.create);
router.get('/:id', compainController.show);
router.put('/', compainController.update);
router.delete('/:id', compainController.destroy);

module.exports = router;
