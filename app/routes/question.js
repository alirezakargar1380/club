var express = require('express');
var router = express.Router();

const questionController = require('../controllers/question.controller')

// http://localhost:3000/question
router.get('/', questionController.index);
router.post('/', questionController.create);
router.get('/:id', questionController.show);
router.put('/', questionController.update);
router.put('/like', questionController.like);
router.put('/disLike', questionController.disLike);
router.delete('/:id', questionController.destroy);

module.exports = router;
