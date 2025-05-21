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
        const { softwareId, accessType, reason } = req.body;

        if (!softwareId || !accessType || !reason) {
            return res.status(400).json({
                message: 'Software ID, access type, and reason are required'
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


        const accessRequest = requestRepository.create({
            user: req.user!,
            software,
            accessType: accessType as 'Read' | 'Write' | 'Admin',
            reason,
            status: 'Pending',
        });

        await requestRepository.save(accessRequest);

        return res.status(201).json({
            message: 'Access request submitted successfully',
            request: accessRequest
        });
    } catch (error) {
        console.error('Error in createRequest:', error);
        return res.status(500).json({
            message: 'Server error'
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