/**
 * Korotuskerroin is used in collateral and penalty (sakko) calculations.  The
 * default value is set to 1.25, which is based on the current practices in the
 * land use compensation calculations. This value can be adjusted as needed, but
 * it serves as a reasonable starting point for the calculations.
 */
export const DEFAULT_KOROTUSKERROIN = 1.25;

/**
 * Sakkokerroin is the penalty multiplier applied in the sakko (penalty) table
 * in the monitoring tab. Initializes to 1.5 per current practice.
 */
export const INITIAL_SAKKOKERROIN = 1.5;

/**
 * Korvauskynnys is used in maankäyttökorvaus calculations.
 */
export const INITIAL_KORVAUSKYNNYS_EURO = 1_000_000;

/**
 * Korvausprosentti is used in maankäyttökorvaus calculations.
 */
export const INITIAL_KORVAUS_PERCENTAGE = 35;
