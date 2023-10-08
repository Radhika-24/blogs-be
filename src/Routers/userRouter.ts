import express from "express";
import passport from "passport";
import { getToken, verifyUser } from "../authenticate";
import { User } from "../model/User";
import { users } from "../database/users";
import { PLANS, STARTER_PLAN_QUOTA } from "../contants";

export const userRouter = express.Router();

userRouter
  .route("/login")
  .post(passport.authenticate("local"), (req, res, next) => {
    const token = getToken({ _id: (req.user as User)._id });
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.json({
      status: "Logged in Successfully",
      token: token,
      success: true,
    });
  });

userRouter.route("/logout").get((req: any, res, next) => {
  if (req.session) {
    req.session.destroy();
    res.json({ message: "Logged out" });
  } else {
    res.statusCode = 403;
    res.statusMessage = "Not logged in";
    res.send();
  }
});

userRouter.route("/signup").post(async (req, res) => {
  const { username, plan, name, password } = req.body;
  const user = await users.findOne({ username });
  if (user) {
    res.statusCode = 403;
    res.statusMessage = "User exists";
    res.send();
  } else {
    const user = new users({ username, plan, name });
    if (plan !== PLANS.FREE) {
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
    if (plan === PLANS.STARTER) {
      user.dailyReadQuota = STARTER_PLAN_QUOTA;
    }
    await user.setPassword(password);
    const newUser = await user.save();
    passport.authenticate("local");
    const token = getToken({ _id: newUser._id });
    res.status(200).json({ plan: newUser._doc.plan, token });
  }
});

userRouter.route("/").get(verifyUser, async (req, res) => {
  res.json(await users.findOne({ _id: (req.user as User)._id }));
});
