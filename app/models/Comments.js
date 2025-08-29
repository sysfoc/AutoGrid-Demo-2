import mongoose, { Schema, models, model } from "mongoose";

const commentSchema = new Schema({
  blogSlug: {
    type: String,
    required: true,
  },
  name: String,
  email: String,
  comment: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Comment = models.Comment || model("Comment", commentSchema);

export default Comment;
