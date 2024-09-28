import { Request, Response } from "express";
import { IRouting, ImportedRoute } from "./routing.interface";
import * as express from "express";
import AdminController from "../controllers/AdminController";
import middleware from "../utils/middleware";


@ImportedRoute.register
class LoginRoute implements IRouting {
    prefix= "/auth";

    register(app: express.Application) {

        app.get('/',(req:Request ,res:Response,next: express.NextFunction)=> {
            return AdminController.getLoginForm(req,res,next);
        });

        app.get(`${this.prefix}/layout`,(req:Request ,res:Response,next: express.NextFunction)=> {
            return AdminController.dashBoard(req,res,next);
        });

        app.post(`${this.prefix}/reg`,(req:Request ,res:Response,next: express.NextFunction)=> {
            return AdminController.adminRegister(req,res,next);
        });

        app.post(`${this.prefix}/login`,(req:Request ,res:Response,next: express.NextFunction)=> {
            return AdminController.adminLogin(req,res,next);
        });

        app.get(`${this.prefix}/pro`,middleware.isAuthenticated,(req:Request ,res:Response,next: express.NextFunction)=> {
            return res.json("from protected route");
        });
    }
}

export default new LoginRoute()