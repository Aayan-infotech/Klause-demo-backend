// utils/validateTimingSections.js

const minsToTime = (mins) => {
  const h = String(Math.floor(mins / 60)).padStart(2, "0");
  const m = String(mins % 60).padStart(2, "0");
  return `${h}:${m}`;
};

const slotsOverlap = (a, b) => a.from < b.to && b.from < a.to;

const dateRangesOverlap = (a, b) => {
  const aStart = new Date(a.startDate).getTime();
  const aEnd = a.endDate ? new Date(a.endDate).getTime() : Infinity;
  const bStart = new Date(b.startDate).getTime();
  const bEnd = b.endDate ? new Date(b.endDate).getTime() : Infinity;
  return aStart <= bEnd && bStart <= aEnd;
};

const fmtDate = (d) =>
  d ? new Date(d).toISOString().slice(0, 10) : "open-ended";
const fmtRange = (dr) => `${fmtDate(dr.startDate)} → ${fmtDate(dr.endDate)}`;

/**
 * Validates one section (openingHours / deliveryHours / foodPickupHours).
 * Returns the FIRST conflict found as { key, params } or null if clean.
 */
const validateSection = (entries) => {
  const weeklyDayRegistry = new Map(); // day → { index, isClosed }
  const dateRangeRegistry = []; // [{ index, dateRange }]

  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];

    // ── 1. Internal time-slot overlap ──────────────────────────
    if (!entry.isClosed && Array.isArray(entry.timeSlots)) {
      const slots = entry.timeSlots;
      for (let x = 0; x < slots.length; x++) {
        for (let y = x + 1; y < slots.length; y++) {
          if (slotsOverlap(slots[x], slots[y])) {
            return {
              key: "TIMESLOT_OVERLAP",
              params: {
                index: i,
                fromA: minsToTime(slots[x].from),
                toA: minsToTime(slots[x].to),
                fromB: minsToTime(slots[y].from),
                toB: minsToTime(slots[y].to),
              },
            };
          }
        }
      }
    }

    // ── 2. WEEKLY day conflict ──────────────────────────────────
    if (entry.scheduleType === "WEEKLY" && Array.isArray(entry.days)) {
      for (const day of entry.days) {
        if (weeklyDayRegistry.has(day)) {
          const prev = weeklyDayRegistry.get(day);
          const params = { index: i, day, prevIndex: prev.index };

          if (prev.isClosed && !entry.isClosed) {
            return { key: "DAY_OPEN_BUT_ALREADY_CLOSED", params };
          }
          if (!prev.isClosed && entry.isClosed) {
            return { key: "DAY_CLOSED_BUT_ALREADY_OPEN", params };
          }
          if (!prev.isClosed && !entry.isClosed) {
            return { key: "DAY_DUPLICATE_OPEN", params };
          }
          return { key: "DAY_DUPLICATE_CLOSED", params };
        }

        weeklyDayRegistry.set(day, { index: i, isClosed: entry.isClosed });
      }
    }

    // ── 3. DATE_RANGE overlap ───────────────────────────────────
    if (entry.scheduleType === "DATE_RANGE" && entry.dateRange) {
      for (const prev of dateRangeRegistry) {
        if (dateRangesOverlap(entry.dateRange, prev.dateRange)) {
          return {
            key: "DATE_RANGE_OVERLAP",
            params: {
              index: i,
              rangeA: fmtRange(entry.dateRange),
              prevIndex: prev.index,
              rangeB: fmtRange(prev.dateRange),
            },
          };
        }
      }
      dateRangeRegistry.push({ index: i, dateRange: entry.dateRange });
    }
  }

  return null; // no conflict
};

/**
 * Runs all three sections in order, throws ApiError on first conflict found.
 * @param {object} body     - validated req.body
 * @param {string} lang     - req.lang
 * @param {Function} ApiError
 */
export const validateTimingSections = (body, lang, ApiError) => {
  const {
    openingHours,
    isDeliveryService,
    isDeliveryHoursSameAsOpeningHours,
    deliveryHours,
    isFoodPickUP,
    isFoodPickupHoursSameAsOpeningHours,
    foodPickupHours,
  } = body;

  // Order matters — opening first, then delivery, then pickup
  const sectionsToCheck = [
    openingHours ?? [],

    isDeliveryService && !isDeliveryHoursSameAsOpeningHours
      ? (deliveryHours ?? [])
      : [],

    isFoodPickUP && !isFoodPickupHoursSameAsOpeningHours
      ? (foodPickupHours ?? [])
      : [],
  ];

  for (const section of sectionsToCheck) {
    const conflict = validateSection(section);
    if (conflict) {
      // Exactly matches your ApiError signature:
      // throw new ApiError(statusCode, messageKey, lang, params)
      throw new ApiError(422, conflict.key, lang, conflict.params);
    }
  }
};

export const validatePeriodTimingSections = (periods, lang, ApiError) => {
  const conflict = validateSection(periods);
  if (conflict) {
    // Exactly matches your ApiError signature:
    // throw new ApiError(statusCode, messageKey, lang, params)
    throw new ApiError(422, conflict.key, lang, conflict.params);
  }
};
