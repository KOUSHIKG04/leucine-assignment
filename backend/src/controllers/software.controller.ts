import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { Software } from '../entities/Software';


const softwareRepository = AppDataSource.getRepository(Software);


export const createSoftware = async (req: Request, res: Response) => {
    try {
        const { name, description, accessLevels } = req.body;

        if (!name || !description || !accessLevels) {
            return res.status(400).json({
                message: 'Name, description, and access levels are required'
            });
        }

        const software = softwareRepository.create({
            name,
            description,
            accessLevels,
        });

        await softwareRepository.save(software);

        return res.status(201).json({
            message: 'Software created successfully',
            software
        });

    } catch (error) {
        console.error('Error in createSoftware:', error);
        return res.status(500).json({
            message: 'Server error'
        });
    }
};

export const getAllSoftware = async (req: Request, res: Response) => {
    try {
        const software = await softwareRepository.find();

        return res.status(200).json(software);
    } catch (error) {
        console.error('Error in getAllSoftware:', error);
        return res.status(500).json({
            message: 'Server error'
        });
    }
};