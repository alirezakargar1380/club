var express = require('express');
var router = express.Router();

const competitionController = require('../controllers/competition.controller')

// http://localhost:3000/competitionController
router.get('/', competitionController.index);
router.get('/getCompetitionWithCampainId/:campainId', competitionController.getCompetitionWithCampainId);
router.post('/', competitionController.create);
router.post('/createNextLevel', competitionController.createNextLevel);
router.get('/:id', competitionController.show);
router.put('/', competitionController.update);
router.put('/setmetaData', competitionController.setmetaData);
router.delete('/:id', competitionController.destroy);

module.exports = router;
