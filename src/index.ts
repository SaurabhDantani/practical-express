// src/index.ts
import express, { Express, Request, Response } from 'express';
import bodyParser from "body-parser";
import path from 'path';
import cookieParser from "cookie-parser";
import cors from 'cors';
import passport from './utils/passport';
import dbUtils from './utils/db.utils';
import * as routes from "./routes";
import flash from 'connect-flash'; 
import session from 'express-session';
import http from 'http'
import { Server } from 'socket.io';
const port = 3000

const app: Express = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(passport.initialize());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

// Serve static files
app.use("/public", express.static(path.join(__dirname, '../public')));
app.use(flash());

app.use(session({ secret: process.env.AUTH_SECRET_KEY || 'ILove_Node', resave: false, saveUninitialized: true }));

app.use((req, res, next) => {
  res.locals.successMessages = req.flash('success');
  res.locals.errorMessages = req.flash('error');
  next();
});
// Register routes
routes.registerRoutes(app);

const conn: any = dbUtils.init();
if (conn) {
  console.log("Database Connected...........");
} else {
  console.log("Not Connected.....");
}

app.get("/toast",(req,res)=> {
  const toastMessage = "This is a toast notification!";
  res.render('ui/toaster', { toastMessage })
  // res.json({message:"working correctly"})
})

io.on('connection', (socket)=> {
  debugger
  console.log('socket io server connected')

  socket.on("message", (msg)=> {
    console.log(`Message received: ${msg}`);
    io.emit('message', msg);
  });

  socket.on("disconnect", ()=> {
    console.log('User disconnected');
  })

});

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
