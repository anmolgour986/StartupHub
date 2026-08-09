const express = require('express');
const router = express.Router();
const { uploadFile, getStartupFiles, deleteFile } = require('../controllers/fileController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.use(protect);
router.post('/:startupId', upload.single('file'), uploadFile);
router.get('/:startupId', getStartupFiles);
router.delete('/:id', deleteFile);

module.exports = router;
