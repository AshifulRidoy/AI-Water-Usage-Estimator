// Reference scales used ONLY for visualizations (glass-fill / gauge). These
// do not change any displayed number — they only decide how "full" a graphic
// looks. Kept separate from estimation CONFIG (config.ts) since they're a
// presentation concern, not part of the estimation engine itself.

/** Fill reference for a single response/day's badge-level visualization. */
export const VISUAL_REFERENCE_SINGLE_ML = 500; // mL — a large single response looks "full"

/** Fill reference for the popup's "Today" card. */
export const VISUAL_REFERENCE_DAILY_ML = 5_000; // mL — a heavy usage day looks "full"

/** Fill reference for the popup's "Lifetime" card. */
export const VISUAL_REFERENCE_LIFETIME_ML = 100_000; // mL — reference ceiling for the lifetime glass

/**
 * "Daily goal" the circular water gauge is drawn against — purely a visual
 * anchor so the ring has a meaningful fill percentage, NOT a target the
 * extension is telling anyone to hit. Configurable here in one place.
 */
export const WATER_DAILY_GOAL_ML = 150;
