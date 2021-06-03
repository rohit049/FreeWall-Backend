const express = require('express');
const wallController = require('./../controllers/wallController');
const router = express.Router();

router.route('/wall-stats').get(wallController.getWallStats);

router
  .route('/top-5-cheap')
  .get(wallController.aliasTopWalls, wallController.getAllWalls);

router
  .route('/')
  .get(wallController.getAllWalls)
  .post(wallController.createWall);

router
  .route('/:id')
  .get(wallController.getWall)
  .patch(wallController.updateWall)
  .delete(wallController.deleteWall);

module.exports = router;
