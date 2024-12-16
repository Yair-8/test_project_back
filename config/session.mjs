import session from "express-session";
import config from "./default.mjs";

const sessionConfig = session({
  secret: config.tokenKey,
  resave: false,
  saveUninitialized: false,
});

export default sessionConfig;
