import { Request, Response } from "express";
import { IRouting, ImportedRoute } from "./routing.interface";
import * as express from "express";
import marketMakerController from "../controllers/marketMakerController";

@ImportedRoute.register
class reservetionRoute implements IRouting {
    prefix= "/marketMaker";

    register(app: express.Application) {
      
      app.post(`${this.prefix}/update`,(req:Request ,res:Response,next: express.NextFunction)=> {
        return marketMakerController.update(req,res,next);
      });

      app.get(`${this.prefix}/get`,(req:Request ,res:Response,next: express.NextFunction)=> {
        return marketMakerController.getMarketMaker(req,res,next);
      });
      
      
      app.post(`${this.prefix}/create`,(req:Request ,res:Response,next: express.NextFunction)=> {
        return marketMakerController.create(req,res,next);
      });

      app.post(`${this.prefix}/delete`,(req:Request ,res:Response,next: express.NextFunction)=> {
        return marketMakerController.softIpoDelete(req,res,next);
      });

    }
}

export default new reservetionRoute()