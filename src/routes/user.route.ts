import { Request, Response } from "express";
import { IRouting, ImportedRoute } from "./routing.interface";
import * as express from "express";

@ImportedRoute.register
class UserRoute implements IRouting {
  prefix = "/user";

  register(app: express.Application) {

    // app.get(`${this.prefix}/get/:id`,middleware.isCookieAuthenticated , (req: Request, res: Response, next: express.NextFunction) => {
    //   return ipoDetailController.getIpoDetail(req, res, next);
    // });
    
  }
}

export default new UserRoute();
