import { Request, Response } from "express";
import { IRouting, ImportedRoute } from "./routing.interface";
import * as express from "express";
import AuthController from '../controllers/authController'

@ImportedRoute.register
class AuthRoute implements IRouting {
  prefix = "/user";

  register(app: express.Application) {

    app.post(`${this.prefix}/register`, (req: Request, res: Response, next: express.NextFunction) => {
      return AuthController.doRegistration(req, res, next);
    });

    app.post(`${this.prefix}/register`, (req: Request, res: Response, next: express.NextFunction) => {
      return AuthController.doRegistration(req, res, next);
    });
    
  }
}

export default new AuthRoute();
