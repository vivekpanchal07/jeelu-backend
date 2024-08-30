// routes/materialRoutes.js

const express = require('express');
const router = express.Router();
const materialController = require('../controllers/materialController');

router.post('/', materialController.addEntry);
router.get('/', materialController.getEntries);
router.put('/:id', materialController.updateEntry);
router.delete('/:id', materialController.deleteEntry);
router.patch('/entries/:id/inactive', materialController.markAsInactive);
module.exports = router;
