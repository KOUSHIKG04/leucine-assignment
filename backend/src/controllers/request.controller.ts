import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { Request as AccessRequest } from '../entities/Request';
import { Software } from '../entities/Software';

const requestRepository
    = AppDataSource.getRepository(AccessRequest);
const softwareRepository
    = AppDataSource.getRepository(Software);

export const createRequest = async (req: Request, res: Response) => {
    try {
        // Log request information for debugging
        console.log('Request body:', req.body);
        console.log('Authenticated user:', req.user);
        
        const { softwareId, accessType, reason } = req.body;

        if (!softwareId || !accessType || !reason) {
            return res.status(400).json({
                message: 'Software ID, access type, and reason are required'
            });
        }

        // Check if user is authenticated
        if (!req.user) {
            return res.status(401).json({
                message: 'User not authenticated. Please log in.'
            });
        }

        const software = await softwareRepository.findOneBy({ id: softwareId });
        if (!software) {
            return res.status(404).json({
                message: 'Software not found'
            });
        }

        if (!software.accessLevels.includes(accessType)) {
            return res.status(400).json({
                message: 'Invalid access type for this software'
            });
        }

        // Create the access request with explicit type checking
        const accessRequest = requestRepository.create({
            user: req.user,
            software,
            accessType: accessType as 'Read' | 'Write' | 'Admin',
            reason,
            status: 'Pending',
        });

        // Log the created request before saving
        console.log('Access request to be saved:', accessRequest);

        await requestRepository.save(accessRequest);

        return res.status(201).json({
            message: 'Access request submitted successfully',
            request: accessRequest
        });
    } catch (error) {
        console.error('Error in createRequest:', error);
        // Provide more detailed error information
        return res.status(500).json({
            message: 'Server error',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

export const getPendingRequests = async (req: Request, res: Response) => {
    try {

        const requests = await requestRepository.find({
            where: { status: 'Pending' },
            relations: ['user', 'software'],
        });

        return res.status(200).json(requests);
    } catch (error) {
        console.error('Error in getPendingRequests:', error);
        return res.status(500).json({
            message: 'Server error'
        });
    }
};

export const updateRequestStatus = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!status || (status !== 'Approved' && status !== 'Rejected')) {
            return res.status(400).json({
                message: 'Valid status (Approved or Rejected) is required'
            });
        }

        const request = await requestRepository.findOne({
            where: { id: parseInt(id) },
            relations: ['user', 'software'],
        });

        if (!request) {
            return res.status(404).json({
                message: 'Request not found'
            });
        }

        request.status = status as 'Approved' | 'Rejected';
        await requestRepository.save(request);

        return res.status(200).json({
            message: `Request ${status.toLowerCase()} successfully`,
            request
        });
    } catch (error) {
        console.error('Error in updateRequestStatus:', error);
        return res.status(500).json({
            message: 'Server error'
        });
    }
};

// Admin functionality to get all requests
export const getAllRequests = async (req: Request, res: Response) => {
    try {
        // Check if user is admin
        if (req.user?.role !== 'Admin') {
            return res.status(403).json({
                message: 'Access denied. Admin privileges required.'
            });
        }

        const requests = await requestRepository.find({
            relations: ['user', 'software'],
        });

        return res.status(200).json(requests);
    } catch (error) {
        console.error('Error in getAllRequests:', error);
        return res.status(500).json({
            message: 'Server error'
        });
    }
};

// Admin functionality to delete a request
export const deleteRequest = async (req: Request, res: Response) => {
    try {
        // Check if user is admin
        if (req.user?.role !== 'Admin') {
            return res.status(403).json({
                message: 'Access denied. Admin privileges required.'
            });
        }

        const { id } = req.params;
        
        const request = await requestRepository.findOne({
            where: { id: parseInt(id) }
        });

        if (!request) {
            return res.status(404).json({
                message: 'Request not found'
            });
        }

        await requestRepository.remove(request);

        return res.status(200).json({
            message: 'Request deleted successfully'
        });
    } catch (error) {
        console.error('Error in deleteRequest:', error);
        return res.status(500).json({
            message: 'Server error'
        });
    }
};