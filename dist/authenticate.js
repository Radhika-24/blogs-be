"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyAdmin = exports.verifyUser = exports.jwtPassport = exports.getToken = exports.local = void 0;
const passport_1 = __importDefault(require("passport"));
const passport_local_1 = __importDefault(require("passport-local"));
const users_1 = require("./database/users");
const passport_jwt_1 = __importDefault(require("passport-jwt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const contants_1 = require("./contants");
const JwtStrategy = passport_jwt_1.default.Strategy;
const ExtractJwt = passport_jwt_1.default.ExtractJwt;
const LocalStrategy = passport_local_1.default.Strategy;
passport_1.default.use(users_1.users.createStrategy());
passport_1.default.serializeUser(users_1.users.serializeUser());
passport_1.default.deserializeUser(users_1.users.deserializeUser());
passport_1.default.session();
exports.local = passport_1.default.use(new LocalStrategy(users_1.users.authenticate()));
const getToken = function (user) {
    return jsonwebtoken_1.default.sign(user, contants_1.SECRET_KEY, {
        expiresIn: 360000,
    });
};
exports.getToken = getToken;
const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: contants_1.SECRET_KEY,
};
exports.jwtPassport = passport_1.default.use(new JwtStrategy(opts, (jwt_payload, done) => __awaiter(void 0, void 0, void 0, function* () {
    const authUser = yield users_1.users.findOne({ _id: jwt_payload._id });
    if (authUser) {
        return done(null, authUser);
    }
    return done(null, false);
})));
exports.verifyUser = passport_1.default.authenticate("jwt");
const verifyAdmin = (req, res, next) => {
    if (req.user.admin) {
        next();
    }
    else {
        const err = new Error("You are not authorised");
        return next(Object.assign(Object.assign({}, err), { status: 401 }));
    }
};
exports.verifyAdmin = verifyAdmin;
//# sourceMappingURL=authenticate.js.map