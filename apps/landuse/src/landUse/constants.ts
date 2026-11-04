/** How many times the UI query client should retry failed requests before giving
 * up, e.g. in case of server errors or network issues.
*/
export const QUERY_CLIENT_MAX_RETRIES = 3;

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
