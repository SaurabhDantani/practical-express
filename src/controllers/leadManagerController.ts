// registar.ts

import { Request, Response, NextFunction } from "express";
import dbUtils from "../utils/db.utils";
import { Registrar } from "../models/Registrar";
import { LeadManager } from "../models/LeadManager";

class LeadManagerController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const connection = await dbUtils.getDefaultConnection();
      const registarRepo = connection.getRepository(LeadManager);
      const { ManagerName, Phone, Email, Website, Fax } = req.body;

      const create = registarRepo.create({
        ManagerName: ManagerName,
        Phone: Phone,
        Email: Email,
        Website: Website,
        Fax: Fax,
      });
      await registarRepo.save(create);
      return res.redirect(`/leadManager/get`);
    } catch (error) {
      console.error("Error creating registrar:", error.message);
      return res.status(500).send("Internal server error");
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const connection = await dbUtils.getDefaultConnection();
      const registarRepo = connection.getRepository(LeadManager);
      const {
        LeadManagerId,
        ManagerName,
        Website,
        Email,
        Phone,
        Fax,
      } = req.body;

      await registarRepo.update(LeadManagerId, {
        ManagerName:ManagerName,
        Website:Website,
        Email:Email,
        Phone:Phone,
        Fax:Fax,
      });
      return res.redirect(`/leadManager/get`);
    } catch (error) {
      console.error("Error updating registrar:", error.message);
      return res.status(500).send("Internal server error");
    }
  }

  async getLeadManager(req: Request, res: Response, next: NextFunction) {
    const connection = await dbUtils.getDefaultConnection();
    const leadManagerRepo = connection.getRepository(LeadManager);

    try {
      const leadManager = await leadManagerRepo.find({where: {IsDelete:false}});
      return res.render("leadManager/index", { leadManager });
    } catch (error) {
      console.error("Error fetching registrars:", error.message);
      return res.status(500).send("Internal server error");
    }
  }

  async softIpoDelete(req: Request, res: Response, next: NextFunction) {
    debugger
    try {
        const connection = await dbUtils.getDefaultConnection();
        const leadManagerRepo = connection.getRepository(LeadManager);
        const id = req.body.LeadManagerId;
        const updateStatus = await leadManagerRepo.update(id, {IsDelete:true})
        
        return res.redirect(`/leadManager/get`);
    } catch (error) {
        console.error(error)
        return
    }
}

}

export default new LeadManagerController();
