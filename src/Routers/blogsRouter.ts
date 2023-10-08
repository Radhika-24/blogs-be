import express from "express";
import { users } from "../database/users";
import { verifyUser } from "../authenticate";
import { User } from "../model/User";
import { PAGE_LENGTH, PLANS, STARTER_PLAN_QUOTA } from "../contants";
import { blogs } from "../database/blogs";

export const blogsRouter = express.Router();

blogsRouter
  .route("/")
  .get(verifyUser, async (req, res) => {
    try {
      const page = req.body.page || 1;
      const user = await users.findOne({ _id: (req.user as User)._id });
      if (user.plan === PLANS.PROFESSIONAL) {
        res.json(
          await blogs
            .find()
            .skip((page - 1) * PAGE_LENGTH)
            .limit(PAGE_LENGTH)
        );
      } else if (user.plan === PLANS.STARTER && page === 1) {
        res.json(await blogs.find().limit(PAGE_LENGTH));
      } else {
        res.statusCode = 403;
        res.statusMessage = "Forbidden";
        res.send();
      }
    } catch (err) {
      res.statusCode = 500;
      res.statusMessage = "Something went wrong";
      res.send();
    }
  })
  .post(verifyUser, async (req, res) => {
    try {
      const { title, content } = req.body;
      const user = await users.findOne({ _id: (req.user as User)._id });
      if (user.plan === PLANS.FREE) {
        res.statusCode = 403;
        res.statusMessage = "Forbidden";
        res.send();
      } else {
        const newBlog = await blogs.create({
          title,
          content,
          publishedBy: (req.user as User)._id,
        });
        if (newBlog) {
          res.statusCode = 200;
          res.statusMessage = "Blog published";
          res.json({ message: "published" });
        } else {
          res.statusCode = 500;
          res.statusMessage = "Something went wrong";
          res.send();
        }
      }
    } catch (err) {
      res.statusCode = 500;
      res.statusMessage = "Something went wrong";
      res.send();
    }
  });

blogsRouter.route("/:id").get(verifyUser, async (req, res) => {
  try {
    const user = await users.findOne({ _id: (req.user as User)._id });
    if (user.plan === PLANS.FREE) {
      res.statusCode = 403;
      res.statusMessage = "Forbidden";
      res.send();
    } else if (user.plan === PLANS.PROFESSIONAL) {
      res.json(await blogs.findOne({ _id: req.params.id }));
    } else if (user.plan === PLANS.STARTER) {
      if (user.dailyReadQuota > 0) {
        const c = await users.findOneAndUpdate(
          { _id: user._id },
          { dailyReadQuota: user.dailyReadQuota - 1 }
        );
        const blog = await blogs.findOne({ _id: req.params.id });
        const publisher = await users.findById(blog.publishedBy, { name: 1 });
        blog.publishedBy = publisher?.name || null;
        res.json(blog);
      } else {
        res.statusCode = 403;
        res.statusMessage = "Daily quota exceeded";
        res.send();
      }
    }
  } catch (err) {
    res.statusCode = 500;
    res.statusMessage = "Something went wrong";
    res.send();
  }
});
