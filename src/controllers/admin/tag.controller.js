import Extra from "../../models/extra.model.js";
import Tag from "../../models/tags.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

export const createTag = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const userId = req.user._id;

  if (!req.file) {
    throw new ApiError(400, "ICON_IS_REQUIRED", req.lang);
  }

  const exists = await Tag.findOne({ name: name.trim(), type: "global" });
  if (exists) {
    throw new ApiError(409, "TAG_NAME_IS_ALREADY_PRESENT", req.lang);
  }

  const tag = await Tag.create({
    name: name.trim(),
    originalName: name.trim(),
    icon: req.file.location,
    type: "global",
    userId,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, "TAG_CREATED_SUCCESSFULLY", req.lang, tag));
});

export const getAllTags = asyncHandler(async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.max(1, parseInt(req.query.limit) || 10);
  const skip = (page - 1) * limit;

  const matchStage = { type: "global" };

  if (req.query.search) {
    matchStage.name = { $regex: req.query.search.trim(), $options: "i" };
  }

  if (req.query.isActive !== undefined) {
    matchStage.isActive = req.query.isActive === "true";
  }

  const allowedSortFields = ["name", "isActive", "createdAt", "updatedAt"];
  const sortBy = allowedSortFields.includes(req.query.sortBy)
    ? req.query.sortBy
    : "createdAt";
  const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;

  const aggregation = [
    { $match: matchStage },
    { $sort: { [sortBy]: sortOrder } },
    {
      $facet: {
        tags: [
          { $skip: skip },
          { $limit: limit },
          {
            $project: {
              name: 1,
              originalName: 1,
              icon: 1,
              isActive: 1,
              type: 1,
              createdAt: 1,
              updatedAt: 1,
            },
          },
        ],
        totalCount: [{ $count: "count" }],
      },
    },
  ];

  const result = await Tag.aggregate(aggregation);

  const tags = result[0]?.tags || [];
  const totalCount = result[0]?.totalCount[0]?.count || 0;
  const totalPages = Math.ceil(totalCount / limit);

  return res.status(200).json(
    new ApiResponse(
      200,
      tags.length > 0 ? "TAGS_FETCHED_SUCCESSFULLY" : "NO_TAGS_FOUND",
      req.lang,
      tags.length > 0
        ? {
            tags,
            total_page: totalPages,
            current_page: page,
            total_records: totalCount,
            per_page: limit,
            sort_by: sortBy,
            sort_order: sortOrder === 1 ? "asc" : "desc",
          }
        : null
    )
  );
});

// ─── Get Single Global Tag ────────────────────────────────────────────────────
export const getTagById = asyncHandler(async (req, res) => {
  const { tagId } = req.params;

  const tag = await Tag.findOne({ _id: tagId, type: "global" }).lean();
  if (!tag) {
    throw new ApiError(404, "TAG_NOT_FOUND", req.lang);
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "TAG_FETCHED_SUCCESSFULLY", req.lang, tag));
});

// ─── Update Global Tag ────────────────────────────────────────────────────────
export const updateTag = asyncHandler(async (req, res) => {
  const { tagId } = req.params;
  const { name, isActive } = req.body;

  const tag = await Tag.findOne({ _id: tagId, type: "global" });
  if (!tag) {
    throw new ApiError(404, "TAG_NOT_FOUND", req.lang);
  }

  // Check duplicate name (only if name is changing)
  if (name && name.trim().toLowerCase() !== tag.name.toLowerCase()) {
    const duplicate = await Tag.findOne({
      type: "global",
      name: { $regex: `^${name.trim()}$`, $options: "i" },
      _id: { $ne: tagId },
    });
    if (duplicate) {
      throw new ApiError(409, "TAG_NAME_IS_ALREADY_PRESENT", req.lang);
    }
  }

  if (name !== undefined) tag.name = name.trim();
  if (isActive !== undefined) tag.isActive = isActive;

  // Update icon only if a new file was uploaded
  if (req.file) {
    tag.icon = req.file.location;
  }

  await tag.save();

  return res
    .status(200)
    .json(new ApiResponse(200, "TAG_UPDATED_SUCCESSFULLY", req.lang, tag));
});

// ─── Toggle Global Tag (Active / Inactive) ────────────────────────────────────
export const toggleTagStatus = asyncHandler(async (req, res) => {
  const { tagId } = req.params;

  const tag = await Tag.findOne({ _id: tagId, type: "global" });
  if (!tag) {
    throw new ApiError(404, "TAG_NOT_FOUND", req.lang);
  }

  tag.isActive = !tag.isActive;
  await tag.save();

  return res.status(200).json(
    new ApiResponse(200, "TAG_STATUS_UPDATED_SUCCESSFULLY", req.lang, {
      _id: tag._id,
      isActive: tag.isActive,
    })
  );
});

// ─── Delete Global Tag ────────────────────────────────────────────────────────
export const deleteTag = asyncHandler(async (req, res) => {
  const { tagId } = req.params;

  const tag = await Tag.findOne({ _id: tagId, type: "global" });
  if (!tag) {
    throw new ApiError(404, "TAG_NOT_FOUND", req.lang);
  }

  //check this tag is not in the use
  const inUse = await Extra.exists({ tags: tagId });

  if (inUse) {
    throw new ApiError(400, "TAG_IN_USE_CANNOT_DELETE", req.lang);
  }

  await Tag.findByIdAndDelete(tagId);

  return res
    .status(200)
    .json(new ApiResponse(200, "TAG_DELETED_SUCCESSFULLY", req.lang, null));
});
