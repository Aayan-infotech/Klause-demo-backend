import mongoose from "mongoose";

const varientSetSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    displayMode: {
      type: String,
      enum: ["horizontal", "vertical", "auto"],
      default: "auto",
    },
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

const VarientSet = mongoose.model("VarientSet", varientSetSchema);
export default VarientSet;
