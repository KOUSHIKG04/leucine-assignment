import { Router } from 'express';
import * as userController from '../controllers/user.controller';
import { authenticate } from '../middleware/auth.middleware';
import { authorize } from '../middleware/role.middleware';

const router = Router();

// Admin routes for user management
router.get('/', authenticate, authorize(['Admin']),
    userController.getAllUsers);

router.patch('/:id', authenticate, authorize(['Admin']),
    userController.updateUserRole);

router.delete('/:id', authenticate, authorize(['Admin']),
    userController.deleteUser);

export default router;
