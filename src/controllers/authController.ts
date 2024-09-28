import { Request,Response,NextFunction } from "express";
import dbUtils from "../utils/db.utils";
import { RoleEnum } from "../utils/roleEnum";
import { Users } from "../models/Users";
import * as bcrypt from 'bcrypt';
import Jwt from "jsonwebtoken";


class AuthController {

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

  async doLogin(req: Request, res: Response, next: NextFunction) {
    debugger
    const { Email, Password } = req.body;
    // if (!memberData.validatedUserData.email || !password) {
    //   return res.status(400).json({ message: "Please provide both email and password" });
    // }

    try {
      const connection = await dbUtils.getDefaultConnection();
      const memberRepo = connection.getRepository(Users)

      const member = await memberRepo.createQueryBuilder("member")
        .where("member.Email = :Email", { Email: Email })
        .andWhere("member.Role = :Role", { Role: RoleEnum.Admin })
        .getOne()

      if (!member) {
        return res.status(404).json({ message: "User not found" });
      }

      if (member.Password === null) {
        return res.status(401).json({ message: "the User not allowed to login and password null" });
      }

      // const skipSuperAdmin = member.Role !== 3;
      // if (skipSuperAdmin) {
      //   const tenantStatus = member?.TenantId.Active !== null ? member.TenantId.Active : true;
      //   if (tenantStatus !== true) {
      //     return res.status(409).json({ message: "TenantStatus is not Active" });
      //   }
      // }

      const isPasswordValid = await bcrypt.compareSync(Password, member.Password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid password" });
      }
      const token = Jwt.sign({ member }, process.env.AUTH_SECRET_KEY || 'default_secret_key', { expiresIn: '8h' });

      return res.status(200).json({ token });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "error", error });
    }
  }

}

export default new AuthController();