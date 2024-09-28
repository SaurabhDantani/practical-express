import { Request, Response } from "express";
import { IRouting, ImportedRoute } from "./routing.interface";
import * as express from "express";
import middleware from "../utils/middleware";
import reservationController from "../controllers/reservationController";

@ImportedRoute.register
class reservetionRoute implements IRouting {
    prefix= "/reservetion";

    register(app: express.Application) {
      
      app.post(`${this.prefix}/update`,middleware.isCookieAuthenticated,(req:Request ,res:Response,next: express.NextFunction)=> {
        return reservationController.update(req,res,next);
      });
      
    }
}

export default new reservetionRoute()