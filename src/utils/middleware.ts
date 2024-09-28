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

export default { isAuthenticated};