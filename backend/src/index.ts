import express from 'express';
import 'dotenv/config';
import 'reflect-metadata';
import cors from 'cors';
import { AppDataSource } from './data-source';
import authRoutes from './routes/auth.routes';
import softwareRoutes from './routes/software.route';
import requestRoutes from './routes/request.route';
import userRoutes from './routes/user.route';

const app = express(); const PORT = process.env.PORT || 5000;

app.use(express.json());

app.use(cors({
    origin: 'http://localhost:5173', 
    credentials: true
}));

app.use('/api/requests', requestRoutes);
app.use('/api/software', softwareRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);


AppDataSource.initialize()
    .then(() => {
        console.log('Connected to DB');
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((error) => console.log('DB connection error:', error));
