// Re-exports the configurable CONFIG for estimator internals.
// Kept as its own file (per architecture.md folder structure) so estimator/*
// modules import from here rather than reaching into shared/ directly —
// this is the seam where estimator-specific overrides could be added later
// without touching shared/constants.
export { getConfig, ESTIMATION_VERSION, DEFAULT_CONFIG } from "../shared/constants/config";
export type { EstimationConfig } from "../shared/constants/config";
