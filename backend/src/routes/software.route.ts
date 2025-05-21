import { Router } from 'express';
import * as softwareController from '../controllers/software.controller';
import { authenticate } from '../middleware/auth.middleware';
import { authorize } from '../middleware/role.middleware';

const router = Router();

router.post('/', authenticate, authorize(['Admin']),
    softwareController.createSoftware);

router.get('/', authenticate, softwareController.getAllSoftware);

export default router;