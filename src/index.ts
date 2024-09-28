import express, { Express, Request, Response } from 'express';
import bodyParser from "body-parser";
import path from 'path';
import cors from 'cors';
import passport from './utils/passport';
import dbUtils from './utils/db.utils';
import * as routes from "./routes";
import http from 'http'
const port = 3000

const app: Express = express();
const server = http.createServer(app);

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(passport.initialize());



// Register routes
routes.registerRoutes(app);

const conn: any = dbUtils.init();
if (conn) {
  console.log("Database Connected...........");
} else {
  console.log("Not Connected.....");
}

app.get("/toast",(req,res)=> {
  res.json({message:"working correctly"})
})


server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
