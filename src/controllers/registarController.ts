// registar.ts

import { Request, Response, NextFunction } from "express";
import dbUtils from "../utils/db.utils";
import { Registrar } from "../models/Registrar";

class RegistrarController {
    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const connection = await dbUtils.getDefaultConnection();
            const registarRepo = connection.getRepository(Registrar);
            const {
                RegistrarName,
                RegistrarPhone,
                RegistrarEmail,
                RegistrarIpoEmail,
                RegistrarWebsite
            } = req.body;

            const create = registarRepo.create({
                RegistrarName,
                RegistrarPhone,
                RegistrarEmail,
                RegistrarIpoEmail,
                RegistrarWebsite
            });

            await registarRepo.save(create);
            return res.redirect(`/registar/get`);
        } catch (error) {
            console.error('Error creating registrar:', error.message);
            return res.status(500).send('Internal server error');
        }
    }

    async update(req: Request, res: Response, next: NextFunction) {
        try {
            const connection = await dbUtils.getDefaultConnection();
            const registarRepo = connection.getRepository(Registrar);
            const {
                RegistrarName,
                RegistrarPhone,
                RegistrarEmail,
                RegistrarIpoEmail,
                RegistrarWebsite,
                RegistrarId
            } = req.body;

            await registarRepo.update(RegistrarId, {
                RegistrarName,
                RegistrarPhone,
                RegistrarEmail,
                RegistrarIpoEmail,
                RegistrarWebsite
            });

            return res.redirect(`/registar/get`);
        } catch (error) {
            console.error('Error updating registrar:', error.message);
            return res.status(500).send('Internal server error');
        }
    }

    async getRegistar(req: Request, res: Response, next: NextFunction) {
        const connection = await dbUtils.getDefaultConnection();
        const registarRepo = connection.getRepository(Registrar);

        try {
            const registar = await registarRepo.find({where:{IsDelete:false}});
            return res.render('registar/index', { registar });
        } catch (error) {
            console.error('Error fetching registrars:', error.message);
            return res.status(500).send('Internal server error');
        }
    }

    async softIpoDelete(req: Request, res: Response, next: NextFunction) {
        try {
            const connection = await dbUtils.getDefaultConnection();
            const ipoRepo = connection.getRepository(Registrar);

            const id = req.body.RegistrarId;
            const updateStatus = await ipoRepo.update(id, {IsDelete:true})
            
            return res.redirect(`/registar/get`);
        } catch (error) {
            console.error(error)
            return
        }
    }
}

export default new RegistrarController();
