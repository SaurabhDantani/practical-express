import { Request, Response } from "express";
import { IRouting, ImportedRoute } from "./routing.interface";
import * as express from "express";
import middleware from "../utils/middleware";
import editorController from "../controllers/editorController";

@ImportedRoute.register
class editorRoute implements IRouting {
    prefix= "/editor";

    register(app: express.Application) {
      
      app.post(`${this.prefix}/editAboutSection`,middleware.isCookieAuthenticated,(req:Request ,res:Response,next: express.NextFunction)=> {
        return editorController.editAboutSection(req,res,next);
      });
      
      
      app.post(`${this.prefix}/editStrengthSection`,middleware.isCookieAuthenticated,(req:Request ,res:Response,next: express.NextFunction)=> {
        return editorController.editStrengthSection(req,res,next);
      });

      app.post(`${this.prefix}/editRiskSection`,middleware.isCookieAuthenticated,(req:Request ,res:Response,next: express.NextFunction)=> {
          return editorController.editRiskSection(req,res,next);
      });

      app.post(`${this.prefix}/editObjectiveSection`,middleware.isCookieAuthenticated,(req:Request ,res:Response,next: express.NextFunction)=> {
        return editorController.editObjectiveSection(req,res,next);
    });
    }
}

export default new editorRoute()