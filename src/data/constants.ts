import log from "../log";

export const LANE_SIZE = 70;
export const LANE_PADDING = 3;

export const CENTRE_LANE_SIZE = 120;
export const CENTRE_LANE_SIDE_OFFSET = CENTRE_LANE_SIZE / 2;

// Maximum time before a note cannot be hit.
export const HIT_WINDOW = 150;

// Maximum health.
export const MAX_HEALTH = 100;
// If <= this, game over
export const MIN_HEALTH = 0;
export const SCROLL_SPEED = 1;

// Variables for rendering when we're running without VSync.
export const FPS_LIMIT = 1200;
export const MIN_MS_PER_FRAME = FPS_LIMIT / 1000;

// if anything is missing, it references this variable
//@ts-expect-error
window.build = {};

export const IS_PROD = build.NODE_ENV == "production";
export const IS_DEV = !IS_PROD;

export const GAMPLO_ENABLED = !!build.GAMPLO_ENABLED;

log("\nIS_PROD: ", IS_PROD, "\nGAMPLO_ENABLED: ", GAMPLO_ENABLED);
