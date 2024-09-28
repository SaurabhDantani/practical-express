import { TimeLine } from './models/TimeLine';
import { Ipo } from './models/Ipo';
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { LotSize } from './models/LotSize';
import { LeadManager } from './models/LeadManager';
import { IPOGMP } from './models/IPOGMP';
import { MarketMaker } from './models/MarketMaker';
import { PromoterHoldings } from './models/PromoterHolding';
import { Registrar } from './models/Registrar';
import { Valuation } from './models/Valuation';
import { IpoDetail } from './models/IPODetail';
import { Reservation } from './models/Reservation';
import { IpoSubscription } from './models/IPOSubscription';
import { AdminLogins } from './models/AdminLogin';
import { Pricing } from './models/Pricing';
import { Users } from './models/Users';
import { Payments } from './models/Payments';
import { AdminToken } from './models/AdminToken';
import { RelationIpoLeadManagers } from './models/RelationIpoLeadManagers';
import { RelationIpoMarketMakers } from './models/RelationIpoMarketMakers';
import { NoReservations } from './models/NoReservetion';

export const dataSource = new DataSource({
    type: 'mssql',
    host: 'FSS-104',
    port: 1433,
    username: 'sa',
    password: 'Fss@123',
    database: 'IPO',//'IPO',//saurabh_ipo_demo
    synchronize: false,
    migrationsRun: false,
    logging: false,
    entities: [
        Ipo,
        TimeLine, 
        LotSize,
        LeadManager,
        Registrar,
        MarketMaker,
        IPOGMP,
        Valuation,
        PromoterHoldings,
        IpoDetail,
        Reservation,
        IpoSubscription,
        AdminLogins,
        Pricing,
        Users,
        Payments,
        AdminToken,
        RelationIpoLeadManagers,
        RelationIpoMarketMakers,
        NoReservations
    ],
    migrations: ["src/migration/**/*.ts"],
    options: {
        encrypt: false,
        trustServerCertificate: true,
    },
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 90000,
    },
   
});


// "typeorm": "npx typeorm-ts-node-commonjs",
// "typeorm:create": "typeorm migration:create -o src/migration/$any_name",
// "migration:run": "typeorm migration:run -d dist/src/db.js",
// "migration:generate": "typeorm migration:generate src/migration/$any_name -d dist/src/db.js"