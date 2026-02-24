import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import mongoose from "mongoose";
import Restaurant from "../../models/restaurant.model.js";

export const addRestaurantTiming = asyncHandler(async (req, res) => {
  const {
    restaurantId,
    type,
    scheduleType,
    days,
    dateRange,
    timeSlots,
    isClosed,
    info,
  } = req.body;

  const restaurant = await Restaurant.findOne({
    _id: restaurantId,
    ownerId: req.user._id,
    isDeleted: false,
  });

  if (!restaurant) {
    throw new ApiError(404, "RESTAURANT_NOT_FOUND", req.lang);
  }
  


  // const existingSchedules = restaurant.hours.filter(
  //   (h) => h.type === type
  // );

  // const isTimeOverlapping = (aStart, aEnd, bStart, bEnd) => {
  //   return aStart < bEnd && bStart < aEnd;
  // };

  // for (const existing of existingSchedules) {
  //   // WEEKLY overlap
  //   if (
  //     scheduleType === "WEEKLY" &&
  //     existing.scheduleType === "WEEKLY"
  //   ) {
  //     const commonDays = existing.days.filter((day) =>
  //       days.includes(day)
  //     );

  //     if (commonDays.length > 0) {
  //       for (const newSlot of timeSlots || []) {
  //         for (const oldSlot of existing.timeSlots || []) {
  //           if (
  //             isTimeOverlapping(
  //               newSlot.from,
  //               newSlot.to,
  //               oldSlot.from,   
  //               oldSlot.to
  //             )
  //           ) {
  //             throw new ApiError(
  //               400,
  //               "TIME_SLOT_OVERLAP_DETECTED",
  //               req.lang
  //             );
  //           }
  //         }
  //       }
  //     }
  //   }

  //   // DATE RANGE overlap
  //   if (
  //     scheduleType === "DATE_RANGE" &&
  //     existing.scheduleType === "DATE_RANGE"
  //   ) {
  //     const newStart = new Date(dateRange.startDate);
  //     const newEnd = new Date(
  //       dateRange.endDate || dateRange.startDate
  //     );

  //     const oldStart = new Date(existing.dateRange.startDate);
  //     const oldEnd = new Date(
  //       existing.dateRange.endDate ||
  //         existing.dateRange.startDate
  //     );

  //     const dateOverlap =
  //       newStart <= oldEnd && oldStart <= newEnd;

  //     if (dateOverlap) {
  //       for (const newSlot of timeSlots || []) {
  //         for (const oldSlot of existing.timeSlots || []) {
  //           if (
  //             isTimeOverlapping(
  //               newSlot.from,
  //               newSlot.to,
  //               oldSlot.from,
  //               oldSlot.to
  //             )
  //           ) {
  //             throw new ApiError(
  //               400,
  //               "DATE_RANGE_TIME_OVERLAP",
  //               req.lang
  //             );
  //           }
  //         }
  //       }
  //     }
  //   }
  // }



  restaurant.hours.push({
    type,
    scheduleType,
    days,
    dateRange,
    timeSlots,
    isClosed,
    info,
  });

  await restaurant.save();

  return res.status(200).json({
    success: true,
    message: "RESTAURANT_TIMING_ADDED_SUCCESSFULLY",
    data: restaurant.hours,
  });
});


export const editRestaurantTiming = asyncHandler(async (req, res) => {
  const {
    restaurantId,
    timingId,
    type,
    scheduleType,
    days,
    dateRange,
    timeSlots,
    isClosed,
    info,
  } = req.body;

  const restaurant = await Restaurant.findOne({
    _id: restaurantId,
    ownerId: req.user._id,
    isDeleted: false,
  });

  if (!restaurant) {
    throw new ApiError(404, "RESTAURANT_NOT_FOUND", req.lang);
  }

  const timingIndex = restaurant.hours.findIndex(
    (h) => h._id.toString() === timingId
  );

  if (timingIndex === -1) {
    throw new ApiError(404, "TIMING_NOT_FOUND", req.lang);
  }

  // Remove current timing temporarily for overlap check
  const existingSchedules = restaurant.hours.filter(
    (h) =>
      h.type === type &&
      h._id.toString() !== timingId
  );

  const isTimeOverlapping = (aStart, aEnd, bStart, bEnd) =>
    aStart < bEnd && bStart < aEnd;

  for (const existing of existingSchedules) {
    if (
      scheduleType === "WEEKLY" &&
      existing.scheduleType === "WEEKLY"
    ) {
      const commonDays = existing.days.filter((day) =>
        days.includes(day)
      );

      if (commonDays.length > 0) {
        for (const newSlot of timeSlots || []) {
          for (const oldSlot of existing.timeSlots || []) {
            if (
              isTimeOverlapping(
                newSlot.from,
                newSlot.to,
                oldSlot.from,
                oldSlot.to
              )
            ) {
              throw new ApiError(
                400,
                "TIME_SLOT_OVERLAP_DETECTED",
                req.lang
              );
            }
          }
        }
      }
    }
  }

  // Update timing
  restaurant.hours[timingIndex] = {
    _id: timingId,
    type,
    scheduleType,
    days,
    dateRange,
    timeSlots,
    isClosed,
    info,
  };

  await restaurant.save();

  return res.status(200).json({
    success: true,
    message: "TIMING_UPDATED_SUCCESSFULLY",
    data: restaurant.hours,
  });
});


export const deleteRestaurantTiming = asyncHandler(async (req, res) => {
  const { restaurantId, timingId } = req.body;

  const restaurant = await Restaurant.findOne({
    _id: restaurantId,
    ownerId: req.user._id,
    isDeleted: false,
  });

  if (!restaurant) {
    throw new ApiError(404, "RESTAURANT_NOT_FOUND", req.lang);
  }

  const timingIndex = restaurant.hours.findIndex(
    (h) => h._id.toString() === timingId
  );

  if (timingIndex === -1) {
    throw new ApiError(404, "TIMING_NOT_FOUND", req.lang);
  }

  restaurant.hours.splice(timingIndex, 1);

  await restaurant.save();

  return res.status(200).json({
    success: true,
    message: "TIMING_DELETED_SUCCESSFULLY",
    data: restaurant.hours,
  });
});

