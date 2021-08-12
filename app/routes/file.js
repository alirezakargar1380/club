var express = require('express');
const upload = require('../utils/multer.utitlity');
var router = express.Router();

const fileController = require('../controllers/file.controller')

// http://localhost:3000/file
router.get('/:type/:id', fileController.getFiles);
router.post('/', fileController.create);
router.put('/setIsMain/:fileId', fileController.setIsMain);
// router.put('/', fileController.update);
// router.delete('/:id', fileController.destroy);

module.exports = router;
