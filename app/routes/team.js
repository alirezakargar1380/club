var express = require('express');
var router = express.Router();

const teamController = require('../controllers/team.controller')

// http://localhost:3000/competitionController
router.get('/', teamController.index);
router.get('/listUserTeam', teamController.listUserTeam);
router.post('/', teamController.create);
router.get('/:id', teamController.show);
router.put('/', teamController.update);
router.delete('/:id', teamController.destroy);

module.exports = router;
