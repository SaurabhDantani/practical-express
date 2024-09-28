import { Request, Response } from "express";
import { IRouting, ImportedRoute } from "./routing.interface";
import * as express from "express";
import middleware from "../utils/middleware";
// import reservationController from "../controllers/reservationController";
import registarController from "../controllers/registarController";

@ImportedRoute.register
class reservetionRoute implements IRouting {
    prefix= "/registar";

    register(app: express.Application) {
      
      app.post(`${this.prefix}/update`,(req:Request ,res:Response,next: express.NextFunction)=> {
        return registarController.update(req,res,next);
      });

      app.get(`${this.prefix}/get`,(req:Request ,res:Response,next: express.NextFunction)=> {
        return registarController.getRegistar(req,res,next);
      });
      
      
      app.post(`${this.prefix}/create`,(req:Request ,res:Response,next: express.NextFunction)=> {
        return registarController.create(req,res,next);
      });

      app.post(`${this.prefix}/delete`,(req:Request ,res:Response,next: express.NextFunction)=> {
        return registarController.softIpoDelete(req,res,next);
      });

    }
}

export default new reservetionRoute()