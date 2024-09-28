import passport from "passport";
import { ExtractJwt, Strategy, StrategyOptions } from "passport-jwt";
import { JwtPayload } from "jsonwebtoken";
import dbUtils from "./db.utils";
import { Users } from "../models/Users";

import dotenv from 'dotenv';
dotenv.config();

const jwtOptions: StrategyOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.AUTH_SECRET_KEY || 'ILove_Node'
}

const jwtStrategy = new Strategy(jwtOptions, async (payload: JwtPayload, done) => {
    try {
        const now = Date.now();
        const connection = await dbUtils.getDefaultConnection();
        const repo = connection.getRepository(Users);
        if(payload.exp && payload.exp < now / 1000) {
            return done(null, false, { message: 'Token expired' });
        }
        const member = await repo.createQueryBuilder("user")
            .where("user.Id = :Id", { Id: payload.Id })
            .getRawOne();

        if (member) {
            done(null, member);
        } else {
            done(null, false);
        }
    } catch (error) {
        done(error, false);
    }
});

passport.use('jwt', jwtStrategy);

export default passport;