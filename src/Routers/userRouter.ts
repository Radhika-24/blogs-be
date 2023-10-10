import express from "express";
import passport from "passport";
import { getToken, verifyUser } from "../authenticate";
import { User } from "../model/User";
import { users } from "../database/users";
import { PLANS, PLAN_ID, STARTER_PLAN_QUOTA } from "../contants";
import { ChargeBee } from "chargebee-typescript";

export const userRouter = express.Router();
const chargeBee = new ChargeBee();
chargeBee.configure({
  site: "tmc-assignment-test",
  api_key: "test_8v9tX4UnVUaYQYXZH0FbX3IM7qq66my3",
});

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
  const { username, plan, name, password, card } = req.body;
  const user = await users.findOne({ username });
  if (user) {
    res.statusCode = 403;
    res.statusMessage = "User exists";
    res.send();
  } else {
    const user = new users({ username, plan, name });
    if (plan !== PLANS.FREE) {
      //charge bee api for creating user
      try {
        const cutomer = await chargeBee.customer
          .create({
            first_name: name,
            email: username,
            card: {
              first_name: name,
              number: card.number,
              expiry_month: card.month,
              expiry_year: card.year,
              cvv: card.cvv,
            },
          })
          .request();
        //store charge bee id in db
        if (cutomer) {
          user.customerId = cutomer.customer.id; // used to retrieve customer details
        }
      } catch (err) {
        console.log(err);
        res.statusCode = 500;
        res.json({ errorMessage: err.message });
      }
      //create and store subscription id
      if (user.customerId) {
        try {
          const subscription = await chargeBee.subscription
            .create_with_items(user.customerId, {
              subscription_items: [
                {
                  item_price_id:
                    plan === PLANS.STARTER
                      ? PLAN_ID.STARTER
                      : PLAN_ID.PROFFESIONAL,
                },
              ],
            })
            .request();
          if (subscription) {
            user.subscriptionId = subscription.subscription.id; // used to retrieve invoice/ subscripion details
          }
        } catch (err) {
          console.log(err);
          res.statusCode = 500;
          res.json({ errorMessage: err.message });
        }
      }
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
