import { Router } from 'express';
import * as requestController from '../controllers/request.controller';
import { authenticate } from '../middleware/auth.middleware';
import { authorize } from '../middleware/role.middleware';

const router = Router();

// Employee routes
router.post('/', authenticate, authorize(['Employee']),
    requestController.createRequest);

// Manager routes
router.get('/pending', authenticate, authorize(['Manager']),
    requestController.getPendingRequests);
    
router.patch('/:id', authenticate, authorize(['Manager', 'Admin']),
    requestController.updateRequestStatus);

// Admin routes
router.get('/', authenticate, authorize(['Admin']),
    requestController.getAllRequests);

router.delete('/:id', authenticate, authorize(['Admin']),
    requestController.deleteRequest);

export default router;