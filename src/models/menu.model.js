import mongoose from "mongoose";
import { hoursSchema } from "./restaurant.model.js";

const MenuSchema = mongoose.Schema(
  {
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },
    name: {
      type: String,
      trim: true,
      required: true,
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    published: {
      type: String,
      enum: ["DRAFT", "PUBLISH"],
      default: "DRAFT",
    },
    showDishesOnTop: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    validityPeriod: [hoursSchema],
    additionalText: {
      type: String,
      trim: true,
      default: "",
    },
    outputDesigned: {
      type: String,
      trim: true,
      default: "",
    },
    autoNumbering: {
      enabled: {
        type: Boolean,
        default: false,
      },
      showOnDishesList: {
        type: Boolean,
        default: false,
      },
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

//unique Name for menu in a restaurant
MenuSchema.index({ restaurantId: 1, name: 1 }, { unique: true });

const Menu = mongoose.model("Menu", MenuSchema);

export default Menu;
