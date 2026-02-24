import mongoose from "mongoose";

const extraSetSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    displayMode: {
      type: String,
      enum: ["horizontal_buttons", "vertical_list", "auto"],
      default: "auto",
    },
    extras: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Extra",
      },
    ],
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const ExtraSet = mongoose.model("ExtraSet", extraSetSchema);
export default ExtraSet;