var express = require('express');
var router = express.Router();

const newsController = require('../controllers/news.controller')

// http://localhost:3000/news
router.get('/', newsController.index);
router.post('/', newsController.create);
router.get('/:id', newsController.show);
router.put('/', newsController.update);
router.delete('/:id', newsController.destroy);


module.exports = router;
