import mongoose from "mongoose";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import Restaurant from "../../models/restaurant.model.js";
import VarientSet from "../../models/varient-set.model.js";
import Varient from "../../models/varient.model.js";

const mapIconsToVariants = (variants, files) => {
  return variants.map((v, index) => ({
    ...v,
    icon: files?.[index]?.location ?? "",
  }));
};

export const createVariantSet = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { restaurantId, name, displayMode, variants } = req.body;
  const files = req.files ?? [];
  
  if (files.length !== variants.length) {
    throw new ApiError(400, "ICON_COUNT_MISMATCH", req.lang);
  }

  const restaurant = await Restaurant.findOne({
    _id: restaurantId,
    ownerId: userId,
    isDeleted: false,
  });
  if (!restaurant) {
    throw new ApiError(404, "RESTAURANT_NOT_FOUND", req.lang);
  }

  const existing = await VarientSet.findOne({ restaurant: restaurantId, name });
  if (existing) {
    throw new ApiError(409, "VARIANT_SET_ALREADY_EXISTS", req.lang);
  }

  const variantNames = variants.map((v) => v.name.trim().toLowerCase());
  if (variantNames.length !== new Set(variantNames).size) {
    throw new ApiError(409, "VARIANT_ALREADY_EXISTS", req.lang);
  }

  const variantsWithIcons = mapIconsToVariants(variants, files);

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const [variantSet] = await VarientSet.create(
      [
        {
          name,
          displayMode: displayMode ?? "auto",
          restaurant: restaurantId,
          userId,
        },
      ],
      { session }
    );

    const variantDocs = variantsWithIcons.map((v) => ({
      name: v.name.trim(),
      icon: v.icon,
      varientSetId: variantSet._id,
      restaurant: restaurantId,
      userId,
    }));

    const createdVariants = await Varient.insertMany(variantDocs, { session });

    await session.commitTransaction();
    session.endSession();

    return res.status(201).json(
      new ApiResponse(201, "VARIANT_SET_CREATED_SUCCESSFULLY", req.lang, {
        ...variantSet.toObject(),
        variants: createdVariants,
      })
    );
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
});

// ─── Get All Variant-Sets (with variant summary) ─────────────────────────────
export const getAllVariantSets = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { restaurantId } = req.query;
  if (!restaurantId) {
    throw new ApiError(400, "RESTAURANT_ID_REQUIRED", req.lang);
  }

  const restaurant = await Restaurant.findOne({
    _id: restaurantId,
    ownerId: userId,
    isDeleted: false,
  });
  if (!restaurant) {
    throw new ApiError(404, "RESTAURANT_NOT_FOUND", req.lang);
  }

  const variantSets = await VarientSet.find({
    restaurant: restaurantId,
  }).lean();

  const variantSetIds = variantSets.map((vs) => vs._id);
  const variants = await Varient.find({
    varientSetId: { $in: variantSetIds },
  })
    .select("varientSetId name icon")
    .lean();

  const variantMap = variants.reduce((acc, v) => {
    const key = v.varientSetId.toString();
    if (!acc[key]) acc[key] = [];
    acc[key].push(v);
    return acc;
  }, {});

  const result = variantSets.map((vs) => ({
    ...vs,
    variants: variantMap[vs._id.toString()] ?? [],
    variantsSummary: (variantMap[vs._id.toString()] ?? [])
      .map((v) => v.name)
      .join(", "),
  }));

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        "VARIANT_SETS_FETCHED_SUCCESSFULLY",
        req.lang,
        result
      )
    );
});

// ─── Get Single Variant-Set ───────────────────────────────────────────────────
export const getVariantSetById = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { variantSetId } = req.params;
  const { restaurantId } = req.query;

  if (!restaurantId) {
    throw new ApiError(400, "RESTAURANT_ID_REQUIRED", req.lang);
  }
  if (!variantSetId) {
    throw new ApiError(400, "VARIANT_SET_ID_REQUIRED", req.lang);
  }

  const restaurant = await Restaurant.findOne({
    _id: restaurantId,
    ownerId: userId,
    isDeleted: false,
  });
  if (!restaurant) {
    throw new ApiError(404, "RESTAURANT_NOT_FOUND", req.lang);
  }

  const variantSet = await VarientSet.findOne({
    _id: variantSetId,
    restaurant: restaurantId,
  }).lean();
  if (!variantSet) {
    throw new ApiError(404, "VARIANT_SET_NOT_FOUND", req.lang);
  }

  const variants = await Varient.find({ varientSetId: variantSetId }).lean();

  return res.status(200).json(
    new ApiResponse(200, "VARIANT_SET_FETCHED_SUCCESSFULLY", req.lang, {
      ...variantSet,
      variants,
    })
  );
});

// ─── Update Variant-Set with Variants ────────────────────────────────────────
export const updateVariantSet = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { variantSetId } = req.params;
  const { restaurantId, name, displayMode, variants } = req.body;
  const files = req.files ?? [];

  // 1. Verify restaurant ownership
  const restaurant = await Restaurant.findOne({
    _id: restaurantId,
    ownerId: userId,
    isDeleted: false,
  });
  if (!restaurant) {
    throw new ApiError(404, "RESTAURANT_NOT_FOUND", req.lang);
  }

  // 2. Verify variant-set exists
  const variantSet = await VarientSet.findOne({
    _id: variantSetId,
    restaurant: restaurantId,
  });
  if (!variantSet) {
    throw new ApiError(404, "VARIANT_SET_NOT_FOUND", req.lang);
  }

  // 3. Check duplicate set name (only if name is changing)
  if (name && name !== variantSet.name) {
    const existing = await VarientSet.findOne({
      restaurant: restaurantId,
      name,
    });
    if (existing) {
      throw new ApiError(409, "VARIANT_SET_ALREADY_EXISTS", req.lang);
    }
  }

  // 4. Update variant-set fields
  const setUpdateFields = {};
  if (name !== undefined) setUpdateFields.name = name;
  if (displayMode !== undefined) setUpdateFields.displayMode = displayMode;

  const updatedSet = await VarientSet.findByIdAndUpdate(
    variantSetId,
    { $set: setUpdateFields },
    { new: true, runValidators: true }
  );

  // 5. Sync variants if provided
  let finalVariants = await Varient.find({ varientSetId: variantSetId }).lean();

  if (variants !== undefined) {
    // Check duplicate variant names in submitted list
    const variantNames = variants.map((v) => v.name.trim().toLowerCase());
    if (variantNames.length !== new Set(variantNames).size) {
      throw new ApiError(409, "VARIANT_ALREADY_EXISTS", req.lang);
    }

    // Track which file index is for new variants (no _id)
    let newVariantFileIndex = 0;
    const existingIds = finalVariants.map((v) => v._id.toString());
    const submittedIds = variants
      .filter((v) => v._id)
      .map((v) => v._id.toString());

    // Soft-delete removed variants
    const toDeleteIds = existingIds.filter((id) => !submittedIds.includes(id));
    if (toDeleteIds.length > 0) {
      await Varient.deleteMany({ _id: { $in: toDeleteIds } });
    }

    // Update existing variants
    const updateOps = variants
      .filter((v) => v._id)
      .map((v) => {
        const updateData = { name: v.name.trim() };
        // Only update icon if a new file was uploaded for this variant
        // Files for existing variants come after new variants in the array
        return Varient.findByIdAndUpdate(
          v._id,
          { $set: updateData },
          { new: true }
        );
      });
    await Promise.all(updateOps);

    // Insert new variants (no _id) — icons mapped from files by index
    const newVariants = variants.filter((v) => !v._id);
    if (newVariants.length > 0) {
      const newDocs = newVariants.map((v, index) => ({
        name: v.name.trim(),
        icon: files?.[index]?.location ?? "",
        varientSetId: variantSetId,
        restaurant: restaurantId,
        userId,
      }));
      await Varient.insertMany(newDocs);
    }

    finalVariants = await Varient.find({ varientSetId: variantSetId }).lean();
  }

  return res.status(200).json(
    new ApiResponse(200, "VARIANT_SET_UPDATED_SUCCESSFULLY", req.lang, {
      ...updatedSet.toObject(),
      variants: finalVariants,
    })
  );
});

// ─── Delete Variant-Set (and all its Variants) ───────────────────────────────
export const deleteVariantSet = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { variantSetId, restaurantId } = req.body;

  const restaurant = await Restaurant.findOne({
    _id: restaurantId,
    ownerId: userId,
    isDeleted: false,
  });
  if (!restaurant) {
    throw new ApiError(404, "RESTAURANT_NOT_FOUND", req.lang);
  }

  const variantSet = await VarientSet.findOne({
    _id: variantSetId,
    restaurant: restaurantId,
  });
  if (!variantSet) {
    throw new ApiError(404, "VARIANT_SET_NOT_FOUND", req.lang);
  }

  await VarientSet.findByIdAndDelete(variantSetId);
  await Varient.deleteMany({ varientSetId: variantSetId });

  return res
    .status(200)
    .json(
      new ApiResponse(200, "VARIANT_SET_DELETED_SUCCESSFULLY", req.lang, null)
    );
});
