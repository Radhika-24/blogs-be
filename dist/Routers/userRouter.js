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
exports.userRouter = void 0;
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
const authenticate_1 = require("../authenticate");
const users_1 = require("../database/users");
const contants_1 = require("../contants");
exports.userRouter = express_1.default.Router();
exports.userRouter
    .route("/login")
    .post(passport_1.default.authenticate("local"), (req, res, next) => {
    const token = (0, authenticate_1.getToken)({ _id: req.user._id });
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.json({
        status: "Logged in Successfully",
        token: token,
        success: true,
    });
});
exports.userRouter.route("/logout").get((req, res, next) => {
    if (req.session) {
        req.session.destroy();
        res.json({ message: "Logged out" });
    }
    else {
        res.statusCode = 403;
        res.statusMessage = "Not logged in";
        res.send();
    }
});
exports.userRouter.route("/signup").post((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, plan, name, password } = req.body;
    const user = yield users_1.users.findOne({ username });
    if (user) {
        res.statusCode = 403;
        res.statusMessage = "User exists";
        res.send();
    }
    else {
        const user = new users_1.users({ username, plan, name });
        if (plan !== contants_1.PLANS.FREE) {
            //charge bee api for creating user
            /**
             *
             * chargebee.configure({site : "{site}",
              api_key : "{site_api_key}"});
            const cutomer  = await chargebee.customer.create({
              first_name : "John",
              last_name : "Doe",
              email : "john@test.com",
              card : {
                first_name : "Richard",
                last_name : "Fox",
                number : "4012888888881881",
                expiry_month : 10,
                expiry_year : 2022,
                cvv : "999"
                }
            })
            //store charge bee id in db
            user.customerId = customer.id
      
            //create and store subscription id
             */
        }
        if (plan === contants_1.PLANS.STARTER) {
            user.dailyReadQuota = contants_1.STARTER_PLAN_QUOTA;
        }
        yield user.setPassword(password);
        const newUser = yield user.save();
        passport_1.default.authenticate("local");
        const token = (0, authenticate_1.getToken)({ _id: newUser._id });
        res.status(200).json({ plan: newUser._doc.plan, token });
    }
}));
exports.userRouter.route("/").get(authenticate_1.verifyUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.json(yield users_1.users.findOne({ _id: req.user._id }));
}));
//# sourceMappingURL=userRouter.js.map