import mongoose from "mongoose";
import passportMongoose from "passport-local-mongoose";

const schema = mongoose.Schema;

const userSchema = new schema({
  name: { type: String },
  username: { type: String },
  plan: { type: String },
  userId: { type: String },
  dailyReadQuota: { type: Number },
  customerId: { type: String },
  subscriptionId: { type: String },
});

userSchema.plugin(passportMongoose);
export const users = mongoose.model("users", userSchema);
