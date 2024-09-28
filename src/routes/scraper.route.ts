import { Request, Response } from "express";
import { IRouting, ImportedRoute } from "./routing.interface";
import * as express from "express";
import middleware from "../utils/middleware";
import scraperController from "../controllers/scraperController";

@ImportedRoute.register
class scraperRoute implements IRouting {
    prefix= "/scraper";

    register(app: express.Application) {
      
      app.post(`${this.prefix}/syncIpoDetails`,(req:Request ,res:Response,next: express.NextFunction)=> {
        return scraperController.syncIpoDetails(req,res,next);
      });
      
      app.post(`${this.prefix}/syncLotSize`,(req:Request ,res:Response,next: express.NextFunction)=> {
        return scraperController.syncLotSize(req,res,next);
      });

      app.post(`${this.prefix}/syncTimeLine`,(req:Request ,res:Response,next: express.NextFunction)=> {
        return scraperController.syncTimeLine(req,res,next);
      });

      app.post(`${this.prefix}/syncValuation`,(req:Request ,res:Response,next: express.NextFunction)=> {
        return scraperController.syncValuation(req,res,next);
      });

      app.post(`${this.prefix}/syncFinancialInfo`,(req:Request ,res:Response,next: express.NextFunction)=> {
        return scraperController.syncFinancialInfo(req,res,next);
      });

      app.post(`${this.prefix}/syncObjectives`,(req:Request ,res:Response,next: express.NextFunction)=> {
        return scraperController.syncObjectives(req,res,next);
      });

      app.post(`${this.prefix}/syncReservation`,(req:Request ,res:Response,next: express.NextFunction)=> {
        return scraperController.syncReservation(req,res,next);
      });

      app.post(`${this.prefix}/syncPromoHolding`,(req:Request ,res:Response,next: express.NextFunction)=> {
        return scraperController.syncPromoHolding(req,res,next);
      });

      app.post(`${this.prefix}/syncCompanyAddress`,(req:Request ,res:Response,next: express.NextFunction)=> {
        return scraperController.syncCompanyAddress(req,res,next);
      });

      app.post(`${this.prefix}/syncIPOGMPs`,(req:Request ,res:Response,next: express.NextFunction)=> {
        return scraperController.syncIPOGMPs(req,res,next);
      });

      app.post(`${this.prefix}/syncSubscription`,(req:Request ,res:Response,next: express.NextFunction)=> {
        return scraperController.syncSubscription(req,res,next);
      });

    }
}

export default new scraperRoute()