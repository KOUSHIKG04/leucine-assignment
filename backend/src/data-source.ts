import { DataSource } from 'typeorm';
import { User } from './entities/User';
import { Software } from './entities/Software';
import { Request } from './entities/Request';


export const AppDataSource = new DataSource({
    type: 'postgres',
    url: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' 
        ? { rejectUnauthorized: false } 
        : false,
    synchronize: true,
    logging: false,
    logger: 'advanced-console', 
    entities: [User, Software, Request],
    extra: {

        max: 10,  
        connectionTimeoutMillis: 5000, 
        idleTimeoutMillis: 10000, 
    },
});
