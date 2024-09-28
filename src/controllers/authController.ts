import { Request, Response, NextFunction } from 'express';
import dbUtils from "../utils/db.utils";
import { Users } from '../models/Users';
import { RoleEnum } from '../utils/roleEnum';
import * as bcrypt from 'bcrypt';
import Jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import crypto from 'crypto';

class AuthController {
  async doRegistration(req: Request, res: Response, next: NextFunction) {
    const { email,firstName,lastName,password,role } = req.body;
    let currentRole: any = role === 'Admin' ? RoleEnum.Admin : RoleEnum.Customer;

    try {
      // const connection = AppDataSource.getRepository(Users);
      const connection = await dbUtils.getDefaultConnection();
      const memberRepo = connection.getRepository(Users)
      const verificationToken = crypto.randomBytes(32).toString('hex');

      const userExists = await memberRepo
        .createQueryBuilder('user')
        .where('user.Email = :Email', { Email:email })
        .getOne();

      if (userExists) {
        userExists.VerificationToken = verificationToken
        await memberRepo.save(userExists);
        await this.sendVerificationEmail(email, verificationToken);
        return res.status(409).json({ message: 'Email Id exists and verification is sent again' });
      }
      
      
      
      const member = memberRepo.create({
        FirstName:firstName,
        LastName:lastName,
        Password: password,
        Email:email,
        Role: currentRole,
        VerificationToken:verificationToken
      });

      await memberRepo.save(member);

      await this.sendVerificationEmail(email, verificationToken);

      return res.status(200).json('User registered successfully. Please check your email for verification.');
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'error', error });
    }
  }

  async sendVerificationEmail(email: string, token: string) {
    const transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
          user: 'katheryn.abernathy@ethereal.email',
          pass: 'AUFWWMX3sUadz91MuA'
      }
   });

    const verificationUrl = `https://practical-express.onrender.com/user/verify-email?token=${token}`;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Email Verification',
      html: `<p>Click <a href="${verificationUrl}">here</a> to verify your email.</p>`,
    };

    await transporter.sendMail(mailOptions);
  }

  async verifyEmail(req: Request, res: Response, next: NextFunction) {
    const { token } = req.query;

    try {
      const connection = await dbUtils.getDefaultConnection();
      const memberRepo = connection.getRepository(Users);

      const user:any = await memberRepo
        .createQueryBuilder('user')
        .where('user.VerificationToken = :VerificationToken', { VerificationToken:token })
        .getOne();

      if (!user) {
        return res.status(400).json({ message: 'Invalid or expired token.' });
      }

      user.IsVerify = true; 
      user.VerificationToken = null; 

      await memberRepo.save(user);

      return res.status(200).json({ message: 'Email verified successfully!' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error during email verification', error });
    }
  }

  async doLogin(req: Request, res: Response, next: NextFunction) {
    const { Email, Password } = req.body;
    try {
      const connection = await dbUtils.getDefaultConnection();
      const memberRepo = connection.getRepository(Users)

      const member:any = await memberRepo
        .createQueryBuilder('user')
        .where('user.Email = :Email', { Email })
        // .andWhere('user.Role = :Role', { Role: RoleEnum.Admin })
        .getOne();


        if (!member) {
          return res.status(404).json({ message: 'Member not found' });
        }

        if (member?.IsVerify == false) {
          return res.status(300).json({ message: 'Email not verified. Please verify your email.' });
        }

        if (member?.Role == 2) {
          return res.status(405).json({ message: 'You are not Admin' });
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
