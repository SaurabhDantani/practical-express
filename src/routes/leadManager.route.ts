import { Request, Response } from "express";
import { IRouting, ImportedRoute } from "./routing.interface";
import * as express from "express";
import middleware from "../utils/middleware";
import leadManagerController from "../controllers/leadManagerController";
// import reservationController from "../controllers/reservationController";
// import registarController from "../controllers/registarController";

@ImportedRoute.register
class leadManager implements IRouting {
    prefix= "/leadManager";

    register(app: express.Application) {
      
      app.post(`${this.prefix}/update`,(req:Request ,res:Response,next: express.NextFunction)=> {
        return leadManagerController.update(req,res,next);
      });

      app.get(`${this.prefix}/get`,(req:Request ,res:Response,next: express.NextFunction)=> {
        return leadManagerController.getLeadManager(req,res,next);
      });
      
      app.post(`${this.prefix}/create`,(req:Request ,res:Response,next: express.NextFunction)=> {
        return leadManagerController.create(req,res,next);
      });

      app.post(`${this.prefix}/delete`,(req:Request ,res:Response,next: express.NextFunction)=> {
        return leadManagerController.softIpoDelete(req,res,next);
      });
    }
}

export default new leadManager()