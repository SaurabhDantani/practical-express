import Jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from "express";
import passport from "passport";

const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    debugger
    passport.authenticate('jwt', { session: false }, (err:any, user:any, info:any) => {
        console.log(req.cookies)
        if (err) return next(err);
        if(info) return res.json(info)
        if (!user) return res.redirect('/');
        req.user = user;
        next();
    })(req, res, next);
};

const isCookieAuthenticated = (req: any, res: any, next: NextFunction) => {
    debugger
    const token = req.cookies.jwt
    if (!token) {
        return res.redirect('/')
        // return res.status(401).json({ message: "Authentication token is missing" });
    }

    Jwt.verify(token, process.env.AUTH_SECRET_KEY || 'ILove_Node', (err: any, decoded: any) => {
        if (err) {
            return res.status(401).json({ message: "Invalid token" });
        }

        req.user = decoded;
        next();
    });
};

export default { isAuthenticated, isCookieAuthenticated};


// async function checkLoginToken(req: Request, res: Response, next: NextFunction) {
//     debugger
//     const connection = await dbUtils.getDefaultConnection();
//     const adminTokenRepo = connection.getRepository(AdminToken);
//     debugger
//     if (!req.headers.authorization) {
//         return res.status(401).json({ message: 'Authorization header missing' });
//     }
//     const decoded:any = Jwt.verify(req.headers.authorization.split(' ')[1], process.env.AUTH_SECRET_KEY || 'defaul_key')
//     const headerToken:any = req.headers.authorization.split(' ')[1]
//     try {
//         const existingTokens:any = await adminTokenRepo.find({ where: { UserId: decoded.id } });
//         if (existingTokens.length > 0) {
//             for (const token of existingTokens) {
//                 console.log(token.Token)
//                 if(headerToken != token.Token) {
//                     res.redirect('/')
//                     console.log("token is not equal")
//                 }
//             }
//         }
//     } catch (error) {
//         return res.status(500).json({ message: 'Internal server error' });
//     }
//     next(); // Ensure next() is called if no errors occur
//     return;
// }