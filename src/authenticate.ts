import passport from "passport";
import passportLocal from "passport-local";
import { users } from "./database/users";
import passportJwt from "passport-jwt";
import jwt from "jsonwebtoken";
import { SECRET_KEY } from "./contants";

const JwtStrategy = passportJwt.Strategy;
const ExtractJwt = passportJwt.ExtractJwt;

const LocalStrategy = passportLocal.Strategy;

passport.use(users.createStrategy());
passport.serializeUser(users.serializeUser());
passport.deserializeUser(users.deserializeUser());
passport.session();

export const local = passport.use(new LocalStrategy(users.authenticate()));
export const getToken = function (user) {
  return jwt.sign(user, SECRET_KEY, {
    expiresIn: 360000,
  });
};
const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: SECRET_KEY,
};

export const jwtPassport = passport.use(
  new JwtStrategy(opts, async (jwt_payload, done) => {
    const authUser = await users.findOne({ _id: jwt_payload._id });
    if (authUser) {
      return done(null, authUser);
    }
    return done(null, false);
  })
);

export const verifyUser = passport.authenticate("jwt");
export const verifyAdmin = (req, res, next) => {
  if (req.user.admin) {
    next();
  } else {
    const err = new Error("You are not authorised");
    return next({ ...err, status: 401 });
  }
};
