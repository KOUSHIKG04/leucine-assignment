import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { User } from '../entities/User';

const userRepository = AppDataSource.getRepository(User);

// Admin functionality to get all users
export const getAllUsers = async (req: Request, res: Response) => {
    try {
        // Check if user is admin
        if (req.user?.role !== 'Admin') {
            return res.status(403).json({
                message: 'Access denied. Admin privileges required.'
            });
        }

        const users = await userRepository.find();

        return res.status(200).json(users);
    } catch (error) {
        console.error('Error in getAllUsers:', error);
        return res.status(500).json({
            message: 'Server error'
        });
    }
};

// Admin functionality to update a user's role
export const updateUserRole = async (req: Request, res: Response) => {
    try {
        // Check if user is admin
        if (req.user?.role !== 'Admin') {
            return res.status(403).json({
                message: 'Access denied. Admin privileges required.'
            });
        }

        const { id } = req.params;
        const { role } = req.body;

        if (!role || !['Admin', 'Manager', 'Employee'].includes(role)) {
            return res.status(400).json({
                message: 'Valid role (Admin, Manager, or Employee) is required'
            });
        }

        const user = await userRepository.findOneBy({ id: parseInt(id) });

        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        // Prevent admin from changing their own role to avoid locking themselves out
        if (user.id === req.user.id && role !== 'Admin') {
            return res.status(400).json({
                message: 'Cannot change your own admin role'
            });
        }

        user.role = role as 'Admin' | 'Manager' | 'Employee';
        await userRepository.save(user);

        return res.status(200).json({
            message: `User role updated to ${role} successfully`,
            user: {
                id: user.id,
                username: user.username,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Error in updateUserRole:', error);
        return res.status(500).json({
            message: 'Server error'
        });
    }
};

// Admin functionality to delete a user
export const deleteUser = async (req: Request, res: Response) => {
    try {
        // Check if user is admin
        if (req.user?.role !== 'Admin') {
            return res.status(403).json({
                message: 'Access denied. Admin privileges required.'
            });
        }

        const { id } = req.params;
        
        const user = await userRepository.findOneBy({ id: parseInt(id) });

        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        // Prevent admin from deleting themselves
        if (user.id === req.user.id) {
            return res.status(400).json({
                message: 'Cannot delete your own admin account'
            });
        }

        await userRepository.remove(user);

        return res.status(200).json({
            message: 'User deleted successfully'
        });
    } catch (error) {
        console.error('Error in deleteUser:', error);
        return res.status(500).json({
            message: 'Server error'
        });
    }
};
