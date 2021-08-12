var express = require('express');
var router = express.Router();

const commentController = require('../controllers/comment.controller')

// http://localhost:3000/comment
router.get('/', commentController.index);
router.post('/', commentController.create);
router.get('/:id', commentController.show);
router.put('/', commentController.update);
router.delete('/:id', commentController.destroy);

module.exports = router;
