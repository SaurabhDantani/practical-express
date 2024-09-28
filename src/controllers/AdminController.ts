import { Request, Response, NextFunction } from "express";
import dbUtils from "../utils/db.utils";
import { AdminLogins } from "../models/AdminLogin";
import * as bcrypt from 'bcrypt';
import Jwt from "jsonwebtoken";
import { AdminToken } from "../models/AdminToken";

class AdminController {
    async getLoginForm(req: Request, res: Response, next: NextFunction) {
        return res.render('auth-signin')
    }

    async adminRegister(req: Request, res: Response, next: NextFunction) {
        debugger
        try {
            const connection = await dbUtils.getDefaultConnection();
            const adminRepo = connection.getRepository(AdminLogins)

            const { email, password } = req.body;

            const admin = adminRepo.create({
                EmailAddress: email,
                Password: password
            });

            await adminRepo.save(admin)
            return res.status(200).json("User register successfully");
        } catch (error) {
            return console.log(error)
        }

    }

    async dashBoard(req: Request, res: Response, next: NextFunction) {
        return res.render('layout')
        // return res.render('dashboard/index')
    }

    async adminLogin(req: Request, res: Response, next: NextFunction) {
        debugger
        try {
            const connection = await dbUtils.getDefaultConnection();
            const adminRepo = connection.getRepository(AdminLogins);
            const adminTokenRepo = connection.getRepository(AdminToken);

            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({ message: 'Please enter email aznd password' });
            }

            const member: any = await adminRepo.findOne({ where: { EmailAddress: email } });

            if (!member) {
                return res.status(400).json({ message: "Member not exists" });
            }

            // if(member) {
            //     this.checkLoginToken(member.LoginId) 
            // }

            const isPasswordValid = bcrypt.compareSync(password, member.Password);
            if (!isPasswordValid) {
                return res.status(401).json({ message: "Invalid password" });
            }

            const token = Jwt.sign({ id: member.LoginId }, process.env.AUTH_SECRET_KEY || 'default_secret_key', { expiresIn: '12h' });

            // try {
            //     if (token) {
            //         const loginTime = Date.now();
            //         const saveAdminToken = adminTokenRepo.create({
            //             UserId: member.LoginId,
            //             // LoginTime:loginTime,
            //             Token: token
            //         })
            //         await adminTokenRepo.save(saveAdminToken)
            //         res.cookie('jwt', token, { httpOnly: true });
            //         return res.json({ success: true, token });
            //     } else {
            //         return res.status(500).json({ message: "Token generation failed" });
            //     }
            // } catch (error) {
            //     console.log(error)
            //     return res.status(500).json({ message: "Token generation failed" });
            // }
            res.cookie('jwt', token, { httpOnly: true });
            return res.json({ success: true, token });

        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    //check login token

    async checkLoginToken(adminId:any){
        const connection = await dbUtils.getDefaultConnection();
        const adminRepo = connection.getRepository(AdminLogins);
        const adminTokenRepo = connection.getRepository(AdminToken);
        debugger
        try {
            const existingTokens = await adminTokenRepo.find({ where: { UserId: adminId } });
            // console.log("admin is available",findAdmin)
            if (existingTokens.length > 0) {
                for (const token of existingTokens) {
                    await adminTokenRepo.remove(token);
                }
            }
        } catch (error) {
            
        }
    }
}

export default new AdminController();