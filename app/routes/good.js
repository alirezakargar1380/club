var express = require('express');
var router = express.Router();

const goodController = require('../controllers/good.controller')

// http://localhost:3000/good
router.get('/', goodController.index);
router.post('/', goodController.create);
router.get('/:id', goodController.show);
router.put('/', goodController.update);
router.delete('/:id', goodController.destroy);

module.exports = router;
