import { Ipo } from './models/Ipo';
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Users } from './models/Users';

import dotenv from 'dotenv';
dotenv.config();

const dbHost = process.env.DB_HOST;
const dbPort = parseInt(process.env.DB_PORT || '6543');
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;
const dbName = process.env.DB_NAME;


export const dataSource = new DataSource({
    type: 'postgres',
    host: dbHost,
    port: dbPort,
    username: dbUser,
    password: dbPassword,
    database: dbName,
    synchronize: false,
    migrationsRun: false,
    logging: false,
    entities: [
        Ipo,
        Users,
    ],
    migrations: ["src/migration/**/*.ts"],
});