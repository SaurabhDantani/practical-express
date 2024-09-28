import { Request, Response } from "express";
import { IRouting, ImportedRoute } from "./routing.interface";
import * as express from "express";
import IpoController from "../controllers/IpoController";
import middleware from "../utils/middleware";
import { logoPath } from "../utils/constant";

const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req:any, file:any, cb:any) => {
      cb(null, `${logoPath}`);
    },
    filename: (req:any, file:any, cb:any) => {      

      const { companyName, IpoId } = req.body;
      const fileExtension = file.mimetype.split('/')[1];
      const sanitizedCompanyName:any = companyName.replace(/\s+/g, '').toLowerCase();
      cb(null, `${sanitizedCompanyName}.${fileExtension}`);

    }
  });

const upload = multer({ storage });


@ImportedRoute.register
class ipoRoute implements IRouting {
    prefix= "/ipo";

    register(app: express.Application) {

      
      app.post(`${this.prefix}/add`,middleware.isAuthenticated,upload.single('logo'),(req:Request ,res:Response,next: express.NextFunction)=> {        
        return IpoController.addIpo(req,res,next);
      });
      
      app.get(`${this.prefix}/getAll`,middleware.isAuthenticated,(req:Request ,res:Response,next: express.NextFunction)=> {
        return IpoController.getAllIpoData(req,res,next);
      });
      
      
      app.post(`${this.prefix}/delete/:id`,middleware.isAuthenticated,(req:Request ,res:Response,next: express.NextFunction)=> {
        return IpoController.softIpoDelete(req,res,next);
      });

      app.post(`${this.prefix}/active`,middleware.isAuthenticated,(req:Request ,res:Response,next: express.NextFunction)=> {
          return IpoController.activeInactiveController(req,res,next);
      });

      app.post(`${this.prefix}/update`,middleware.isCookieAuthenticated,(req:Request ,res:Response,next: express.NextFunction)=> {
        return IpoController.updateIpo(req,res,next);
    });

    }
}

export default new ipoRoute()