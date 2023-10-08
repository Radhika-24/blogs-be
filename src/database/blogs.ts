import mongoose from "mongoose";

const schema = mongoose.Schema;

const blogsSchema = new schema({
  title: { type: String },
  content: { type: String },
  publishedBy: { type: String },
});

export const blogs = mongoose.model("blogs", blogsSchema);
