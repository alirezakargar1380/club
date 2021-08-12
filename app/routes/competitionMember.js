var express = require('express');
var router = express.Router();

const competitionVisitorPositionController = require('../controllers/competitionVisitorPosition.controller')

// http://localhost:3000/competitionVisitorPositionController
router.get('/', competitionVisitorPositionController.index);
router.post('/', competitionVisitorPositionController.create);
router.get('/:id', competitionVisitorPositionController.show);
router.put('/', competitionVisitorPositionController.update);
router.delete('/:id', competitionVisitorPositionController.destroy);

module.exports = router;
