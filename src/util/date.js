// @flow
/**
 * Get day and month object
 */
export const getDayMonth = (day: number, month: number) => ({day, month});

/**
 * Get current year as string
 * @returns {string}
 */
export  const getCurrentYear = () => new Date().getFullYear().toString();
