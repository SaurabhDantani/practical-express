import * as shell from "shelljs";
//Copy all the view Templates
shell.cp("-R","views","dist/");

//Copy all the public content
shell.cp("-R","public","dist/");

