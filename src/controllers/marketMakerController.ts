// registar.ts

import { Request, Response, NextFunction } from "express";
import dbUtils from "../utils/db.utils";
import { Registrar } from "../models/Registrar";
import { MarketMaker } from "../models/MarketMaker";

class MarketMakerController {
    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const connection = await dbUtils.getDefaultConnection();
            const marketMakerRepo = connection.getRepository(MarketMaker);
            const {
                MarketMakerName
            } = req.body;

            const create = marketMakerRepo.create({
                MarketMakerName
            });

            await marketMakerRepo.save(create);
            return res.redirect(`/marketMaker/get`);
        } catch (error) {
            console.error('Error creating marketMaker:', error.message);
            return res.status(500).send('Internal server error');
        }
    }

    async update(req: Request, res: Response, next: NextFunction) {
        try {
            const connection = await dbUtils.getDefaultConnection();
            const marketMakerRepo = connection.getRepository(MarketMaker);
            const {
                MarketMakerName,
                MarketMakerId
            } = req.body;

            await marketMakerRepo.update(MarketMakerId, {
                MarketMakerName:MarketMakerName
            });

            return res.redirect(`/marketMaker/get`);
        } catch (error) {
            console.error('Error updating marketMaker:', error.message);
            return res.status(500).send('Internal server error');
        }
    }

    async getMarketMaker(req: Request, res: Response, next: NextFunction) {
        const connection = await dbUtils.getDefaultConnection();
        const marketMakerRepo = connection.getRepository(MarketMaker);

        try {
            const marketMaker = await marketMakerRepo.find({where:{IsDelete:false}});
            return res.render('marketMaker/index', { marketMaker });
        } catch (error) {
            console.error('Error fetching marketMaker:', error.message);
            return res.status(500).send('Internal server error');
        }
    }

    async softIpoDelete(req: Request, res: Response, next: NextFunction) {
        debugger
        try {
            const connection = await dbUtils.getDefaultConnection();
            const ipoRepo = connection.getRepository(MarketMaker);

            const id = req.body.MarketMakerId;
            const updateStatus = await ipoRepo.update(id, {IsDelete:true})
            
            return res.redirect(`/marketMaker/get`);
        } catch (error) {
            console.error(error)
            return
        }
    }
}

export default new MarketMakerController();
