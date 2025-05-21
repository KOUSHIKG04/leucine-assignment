import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppDataSource } from '../data-source';
import { User } from '../entities/User';

declare global {
    namespace Express {
        interface Request {
            user?: User;
        }
    }
}

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Access denied. No token provided.' });
        }

        const token = authHeader.split(' ')[1];


        const decoded = jwt.verify(
            token, process.env.JWT_SECRET || 'default_secret'
        ) as any;


        const userRepository
            = AppDataSource.getRepository(User);

        const user = await userRepository.findOneBy({
            id: decoded.userId
        });

        if (!user) {
            return res.status(404).json({
                message: 'User not found.'
            });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token.' });
    }
};