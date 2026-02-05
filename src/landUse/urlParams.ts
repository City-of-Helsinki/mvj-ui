/**
 * Parse URL search string with support for duplicated parameter keys
 * @param search - URL search string (e.g., "?phase=value1&phase=value2")
 * @returns Object with parsed parameters, arrays for duplicated keys
 */
export const parseUrlParams = (
  search: string = "",
): Record<string, string | string[]> => {
  const params: Record<string, string | string[]> = {};
  const searchParams = new URLSearchParams(search);

  searchParams.forEach((value, key) => {
    if (params[key]) {
      // Key already exists, convert to array or append to array
      if (Array.isArray(params[key])) {
        (params[key] as string[]).push(value);
      } else {
        params[key] = [params[key] as string, value];
      }
    } else {
      params[key] = value;
    }
  });

  return params;
};

/**
 * Build query string from parameters object
 * Duplicated parameter keys are supported via array values
 * @param params - Object with parameters, arrays become duplicated keys
 * @returns Query string (e.g., "?phase=value1&phase=value2")
 */
export const buildQueryString = (params: Record<string, any>): string => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === null || value === undefined || value === "") {
      return; // Skip empty values
    }

    if (Array.isArray(value)) {
      // Add multiple values for the same key
      value.forEach((v) => {
        if (v !== null && v !== undefined && v !== "") {
          searchParams.append(key, v);
        }
      });
    } else {
      searchParams.set(key, value);
    }
  });

  const query = searchParams.toString();
  return query ? `?${query}` : "";
};
