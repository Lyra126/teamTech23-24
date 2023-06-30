import express from 'express';
import { createSatellite, getAllSatellite, getSatelliteByID} from '../controllers/Satellite.controller.js';

const router = express.Router();

router.route('/').get(getAllSatellite);
router.route('/').post(createSatellite);
router.route('/:id').get(getSatelliteByID);

export default router;