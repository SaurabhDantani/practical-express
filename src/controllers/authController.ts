import { Request, Response, NextFunction } from 'express';
import dbUtils from "../utils/db.utils";
import { Users } from '../models/Users';
import { RoleEnum } from '../utils/roleEnum';
import * as bcrypt from 'bcrypt';
import Jwt from 'jsonwebtoken';

class AuthController {
  async doRegistration(req: Request, res: Response, next: NextFunction) {
    const { email,firstName,lastName,password,role } = req.body;
    let currentRole: any = role === 'Admin' ? RoleEnum.Admin : RoleEnum.Customer;

    try {
      // const connection = AppDataSource.getRepository(Users);
      const connection = await dbUtils.getDefaultConnection();
      const memberRepo = connection.getRepository(Users)

      const userExists = await memberRepo
        .createQueryBuilder('user')
        .where('user.Email = :Email', { Email:email })
        .getOne();

      if (userExists) {
        return res.status(409).json({ message: 'Email Id exists' });
      }

      const member = memberRepo.create({
        FirstName:firstName,
        LastName:lastName,
        Password: password,
        Email:email,
        Role: currentRole,
      });

      await memberRepo.save(member);

      return res.status(200).json('User registered successfully');
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'error', error });
    }
  }

  async doLogin(req: Request, res: Response, next: NextFunction) {
    const { Email, Password } = req.body;
    try {
      const connection = await dbUtils.getDefaultConnection();
      const memberRepo = connection.getRepository(Users)

      const member = await memberRepo
        .createQueryBuilder('user')
        .where('user.Email = :Email', { Email })
        .andWhere('user.Role = :Role', { Role: RoleEnum.Admin })
        .getOne();

      if (!member) {
        return res.status(404).json({ message: 'User not found' });
      }

      if (!member.Password) {
        return res.status(401).json({ message: 'Password not set' });
      }

      const isPasswordValid = await bcrypt.compare(Password, member.Password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid password' });
      }

      const token = Jwt.sign({ member }, process.env.AUTH_SECRET_KEY || 'default_secret_key', {
        expiresIn: '8h',
      });

      return res.status(200).json({ token });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'error', error });
    }
  }
}

export default new AuthController();
