import express from "express";
import mongoose from "mongoose";
import cron from "node-cron";
import cors from "cors";
import { MONGO_URL, PLANS, SECRET_KEY, STARTER_PLAN_QUOTA } from "./contants";
import { userRouter } from "./Routers/userRouter";
import session from "express-session";
import { blogsRouter } from "./Routers/blogsRouter";
import { users } from "./database/users";

const app = express();
const port = process.env.PORT || 3001;
// Setup mongoose connection
mongoose.connect(MONGO_URL);

// Set up middleware for parsing JSON and URL-encoded bodies
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: SECRET_KEY }));
app.use("/blogs", blogsRouter);
app.use("/", userRouter);
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
// reset daily raedy quota for STARTER plan customers
cron.schedule("0 0 0 * * * *", (req, res) => {
  const u = users.updateMany(
    { plan: PLANS.STARTER },
    { dailyReadQuota: STARTER_PLAN_QUOTA }
  );
});
