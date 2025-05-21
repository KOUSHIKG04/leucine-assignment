import { Router } from 'express';
import * as requestController from '../controllers/request.controller';
import { authenticate } from '../middleware/auth.middleware';
import { authorize } from '../middleware/role.middleware';

const router = Router();

router.post('/', authenticate, authorize(['Employee']),
    requestController.createRequest);

router.get('/pending', authenticate, authorize(['Manager']),
    requestController.getPendingRequests);
    
router.patch('/:id', authenticate, authorize(['Manager']),
    requestController.updateRequestStatus);

export default router;