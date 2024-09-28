import { Request,Response,NextFunction } from "express";
import dbUtils from "../utils/db.utils";
import { RoleEnum } from "../utils/roleEnum";
import { Users } from "../models/Users";

class RegisterController {
    async doRegistration(req:Request, res:Response, next:NextFunction) {
          const {FirstName, LastName,role ,Password , Email} = req.body
          let currentRole:any = ""
          if (role === "Admin") {
            currentRole = RoleEnum.Admin
          } else {
            currentRole = RoleEnum.Customer
          }
          try {
              const connection = await dbUtils.getDefaultConnection();
              const memberRepo = connection.getRepository(Users)
  
              const userExists = await memberRepo
              .createQueryBuilder("member")        
              .where("member.Email = :Email", { Email: Email })
              .getOne();            
            if (userExists) {                               
              return res.status(409).json({message:"Email Id exists"})
            }
  
            const member:any = memberRepo.create({
                FirstName:FirstName,
                LastName:LastName,
                Password:Password,
                Role:currentRole
            });
            await memberRepo.save(member);
  
            return res.status(200).json("User register successfully");
          } catch (error) {            
              console.log(error);
              return res.status(500).json({ message: "error", error });
          }
    }
}

export default new RegisterController();