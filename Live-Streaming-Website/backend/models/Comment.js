const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    vod: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vod",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Static for author population
commentSchema.statics.authorPopulation = function () {
  return { path: "author", select: "username avatar" };
};

module.exports = mongoose.model("Comment", commentSchema);
