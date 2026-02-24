import mongoose from "mongoose";

/* ============================= */
/* TIME SLOT SUB-SCHEMA */
/* ============================= */

const timeSlotSchema = new mongoose.Schema(
  {
    from: {
      type: Number, // store in minutes (e.g. 8:00 → 480)
      required: true,
      min: 0,
      max: 1440,
    },
    to: {
      type: Number,
      required: true,
      min: 0,
      max: 1440,
    },
  },
  { _id: false }
);

/* ============================= */
/* DATE RANGE SUB-SCHEMA */
/* ============================= */

const dateRangeSchema = new mongoose.Schema(
  {
    startDate: Date,
    endDate: Date,
  },
  { _id: false }
);

/* ============================= */
/* HOURS SUB-SCHEMA */
/* ============================= */

export const hoursSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["OPENING", "DELIVERY", "PICKUP"],
    // required: true,
  },

  scheduleType: {
    type: String,
    enum: ["WEEKLY", "DATE_RANGE"],
    required: true,
  },

  days: [
    {
      type: String,
      enum: ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"],
    },
  ],

  dateRange: dateRangeSchema,

  timeSlots: [timeSlotSchema],

  isClosed: {
    type: Boolean,
    default: false,
  },

  info: {
    type: String,
    default: "",
  },
});

/* ============================= */
/* MAIN RESTAURANT SCHEMA */
/* ============================= */

const restaurantSchema = new mongoose.Schema(
  {
    restaurantId: {
      type: String,
      required: true,
      unique: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    restaurantType: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "RestaurantType",
        required: true,
      },
    ],

    serviceType: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ServiceType",
        required: true,
      },
    ],

    businessType: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "BusinessType",
        required: true,
      },
    ],

    cuisine: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Cuisine",
        required: true,
      },
    ],

    dishType: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "DishType",
        required: true,
      },
    ],

    dietType: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "DietType",
        required: true,
      },
    ],

    description: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      unique: true,
    },

    latitude: {
      type: Number,
      required: true,
    },

    longitude: {
      type: Number,
      required: true,
    },

    locationPoint: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
      },
    },

    address: {
      street: { type: String, required: true },
      No: { type: String, required: true },
      postCode: { type: String, required: true },
      city: { type: String, required: true },
      country: { type: String, required: true },
    },

    restaurantImages: [
      {
        type: String,
      },
    ],

    payment: {
      type: String,
      enum: ["noAdvance", "requiredAdvance", "allowAdvance"],
    },

    generatedQRCode: {
      type: String,
    },

    displayOnMap: {
      type: String,
      enum: ["none", "showFolded", "showUnfolded"],
      default: "none",
    },

    displayDishesMenu: {
      type: String,
      enum: ["none", "showTopDishes", "showSpecificMenu"],
      default: "none",
    },

    specificMenuId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Menu",
      required: function () {
        return this.displayDishesMenu === "showSpecificMenu";
      },
    },

    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    status: {
      type: String,
      enum: ["DRAFT", "PUBLISH"],
      default: "DRAFT",
    },

    isVerified: {
      type: Boolean,
      default: true,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },

    deletedAt: {
      type: Date,
      default: null,
    },

    /* ============================= */
    /* ALL HOURS STORED HERE */
    /* ============================= */

    openingHours: [hoursSchema],
    additionalInfo: {
      type: String,
      default: "",
    },
    isDeliveryService: {
      type: Boolean,
      default: false,
    },
    isDeliveryHoursSameAsOpeningHours: {
      type: Boolean,
      default: false,
    },
    deliveryHours: [hoursSchema],
    additionalDeliveryInfo: {
      type: String,
      default: "",
    },
    isFoodPickUP: {
      type: Boolean,
      default: false,
    },
    isFoodPickupHoursSameAsOpeningHours: {
      type: Boolean,
      default: false,
    },
    foodPickupHours: [hoursSchema],
    additionalFoodPickupInfo: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

/* ============================= */
/* INDEXES */
/* ============================= */

restaurantSchema.index({ locationPoint: "2dsphere" });
restaurantSchema.index({ email: 1 });
restaurantSchema.index({ phone: 1 });
restaurantSchema.index({ restaurantType: 1 });
restaurantSchema.index({ cuisine: 1 });
restaurantSchema.index({ "address.city": 1 });

const Restaurant = mongoose.model("Restaurant", restaurantSchema);

export default Restaurant;
