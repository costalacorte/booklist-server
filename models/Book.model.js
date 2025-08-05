const { Schema, model } = require("mongoose");

const bookSchema = new Schema(
  {
    title: { type: String, required: true },
    author: { type: String, required: true },
    year: { type: Number },
    isRead: { type: Boolean, default: false },
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

module.exports = model("Book", bookSchema);
