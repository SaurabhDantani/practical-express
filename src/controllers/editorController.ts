import { Request,Response,NextFunction } from "express";
import { IpoDetail } from "../models/IPODetail";
import dbUtils from "../utils/db.utils";

class TinyMceController {
    
    async editAboutSection(req: Request, res: Response, next: NextFunction) {
        debugger
        try {
            const connection = await dbUtils.getDefaultConnection();
            const ipoRepo = connection.getRepository(IpoDetail);
            const {IpoId,IpoDetailId,aboutSection} = req.body;
            // console.log('Received TinyMCE content:', req.body);
            const ipo = await ipoRepo.update(IpoDetailId, {About:aboutSection});
    
            return res.redirect(`/ipoDetail/get/${IpoId}`);
        } catch (error) {
            console.error('Error updating timeline:', error.message);
            return res.status(500).send('Internal server error');
        }
    }

    async editStrengthSection(req: Request, res: Response, next: NextFunction) {
        debugger
        try {
            const connection = await dbUtils.getDefaultConnection();
            const ipoRepo = connection.getRepository(IpoDetail);
            const {IpoId,IpoDetailId,strengthSection} = req.body;
    
            const ipo = await ipoRepo.update(IpoDetailId, {Strength:strengthSection});
    
            return res.redirect(`/ipoDetail/get/${IpoId}`);
        } catch (error) {
            console.error('Error updating timeline:', error.message);
            return res.status(500).send('Internal server error');
        }
    }

    async editRiskSection(req: Request, res: Response, next: NextFunction) {
        debugger
        try {
            const connection = await dbUtils.getDefaultConnection();
            const ipoRepo = connection.getRepository(IpoDetail);
            const {IpoId,IpoDetailId,riskSection} = req.body;
    
            const ipo = await ipoRepo.update(IpoDetailId, {Risk:riskSection});
    
            return res.redirect(`/ipoDetail/get/${IpoId}`);
        } catch (error) {
            console.error('Error updating timeline:', error.message);
            return res.status(500).send('Internal server error');
        }
    }

    async editObjectiveSection(req: Request, res: Response, next: NextFunction) {
        debugger
        try {
            const connection = await dbUtils.getDefaultConnection();
            const ipoRepo = connection.getRepository(IpoDetail);
            const {IpoId,IpoDetailId,objectivesSection} = req.body;
            await ipoRepo.update(IpoDetailId, {Objectives:objectivesSection});
    
            return res.redirect(`/ipoDetail/get/${IpoId}`);
        } catch (error) {
            console.error('Error updating timeline:', error.message);
            return res.status(500).send('Internal server error');
        }
    }
}

export default new TinyMceController()