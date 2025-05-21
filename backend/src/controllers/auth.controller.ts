import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../entities/User';

const userRepository = AppDataSource.getRepository(User);


export const signup = async (req: Request, res: Response) => {
  try {
    const { username, password, role = 'Employee' } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        message: 'Username and password are required'
      });
    }

    const existingUser =
      await userRepository.findOneBy({ username });

    if (existingUser) {
      return res.status(400).json({
        message: 'Username already exists'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = userRepository.create({
      username,
      password: hashedPassword,
      role,
    });

    await userRepository.save(user);

    return res.status(201).json({
      message: 'User created successfully'
    });
  } catch (error) {
    console.error('Error in signup:', error);
    return res.status(500).json({
      message: 'Server error'
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        message: 'Username and password are required'
      });
    }

    const user = await userRepository.findOneBy({ username });
    if (!user) {
      return res.status(401).json({
        message: 'Invalid credentials'
      });
    }


    const validPassword =
      await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({
        message: 'Invalid credentials'
      });
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET || 'default_secret',
      { expiresIn: '24h' }
    );

    return res.status(200).json({
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Error in login:', error);
    return res.status(500).json({
      message: 'Server error'
    });
  }
};