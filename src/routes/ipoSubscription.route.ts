import { Request, Response } from "express";
import { IRouting, ImportedRoute } from "./routing.interface";
import * as express from "express";
import middleware from "../utils/middleware";
// import ipoSubscriptionController from "../controllers/ipoSubscriptionController";

@ImportedRoute.register
class IpoSubscriptionRoute implements IRouting {
    prefix= "/reservetion";

    register(app: express.Application) {
      
      // app.post(`${this.prefix}/update`,middleware.isCookieAuthenticated,(req:Request ,res:Response,next: express.NextFunction)=> {
      //   return ipoSubscriptionController.update(req,res,next);
      // });
      
      
      // app.post(`${this.prefix}/editStrengthSection`,middleware.isCookieAuthenticated,(req:Request ,res:Response,next: express.NextFunction)=> {
      //   return editorController.editStrengthSection(req,res,next);
      // });

      // app.post(`${this.prefix}/editRiskSection`,middleware.isCookieAuthenticated,(req:Request ,res:Response,next: express.NextFunction)=> {
      //     return editorController.editRiskSection(req,res,next);
      // });
    }
}

export default new IpoSubscriptionRoute()