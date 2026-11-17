import { landUseTokenizedFetchModule } from "@/landUse/auth/constants";

export type LanduseApiErrorBody = {
  detail?: string;
  [key: string]: unknown;
};

export type LanduseApiQuery = Record<
  string,
  string | number | boolean | null | undefined
>;

export type LanduseApiRequestOptions = {
  query?: LanduseApiQuery;
  headers?: HeadersInit;
  apiNamespace?: "landuse" | "";
};

export type PaginatedResponse<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

export class LanduseApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly body: LanduseApiErrorBody | null,
  ) {
    super(body?.detail ?? `Request failed with status ${status}`);
    this.name = "LanduseApiError";
  }
}

export const isLanduseApiError = (error: unknown): error is LanduseApiError =>
  error instanceof LanduseApiError ||
  (typeof error === "object" &&
    error !== null &&
    // Matches by name too, since `instanceof` can fail across module/realm boundaries.
    (error as { name?: unknown }).name === "LanduseApiError" &&
    typeof (error as { status?: unknown }).status === "number");

const collectErrorMessages = (value: unknown, prefix: string): string[] => {
  if (typeof value === "string") {
    return [`${prefix}${value}`];
  }
  if (typeof value === "number" || typeof value === "boolean") {
    return [`${prefix}${value}`];
  }
  if (Array.isArray(value)) {
    return value.flatMap((item) => collectErrorMessages(item, prefix));
  }
  if (value && typeof value === "object") {
    return Object.entries(value).flatMap(([field, nested]) =>
      collectErrorMessages(
        nested,
        field === "detail" ? prefix : `${prefix}${field}: `,
      ),
    );
  }
  return [];
};

export const getLanduseApiErrorMessage = (error: unknown): string => {
  if (!isLanduseApiError(error)) {
    return `${error}`;
  }

  if (!error.body) {
    return error.message;
  }

  return collectErrorMessages(error.body, "").join(" ") || error.message;
};

const getQueryString = (query?: LanduseApiQuery): string => {
  const searchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(query ?? {})) {
    if (value !== null && value !== undefined) {
      searchParams.set(key, String(value));
    }
  }

  return searchParams.toString();
};

const getLanduseApiUrl = (
  path: string,
  query?: LanduseApiQuery,
  apiNamespace = "landuse",
): string => {
  const apiHost = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");
  const prefix = apiNamespace ? `/${apiNamespace}` : "";
  const url = `${apiHost}${prefix}/${path.replace(/^\//, "")}`;
  const search = getQueryString(query);
  return search ? `${url}?${search}` : url;
};

const getErrorBody = async (
  response: Response,
): Promise<LanduseApiErrorBody | null> => {
  const contentType = response.headers.get("content-type");
  if (!contentType?.includes("application/json")) {
    return null;
  }

  return response.json() as Promise<LanduseApiErrorBody>;
};

type LanduseApiMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

const requestLanduseApi = async <T>(
  path: string,
  method: LanduseApiMethod,
  options: LanduseApiRequestOptions = {},
  body?: unknown,
): Promise<T> => {
  const headers = new Headers(options.headers);

  if (body !== undefined) {
    headers.set("Content-Type", "application/json");
  }

  const response = await landUseTokenizedFetchModule.tokenizedFetch(
    getLanduseApiUrl(path, options.query, options.apiNamespace),
    {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    },
  );

  if (!response.ok) {
    throw new LanduseApiError(response.status, await getErrorBody(response));
  }

  return response.status === 204
    ? (undefined as T)
    : ((await response.json()) as T);
};

export const callApiGet = <T>(
  path: string,
  options: LanduseApiRequestOptions = {},
): Promise<T> => requestLanduseApi<T>(path, "GET", options);

export const callApiGetAllPages = async <T>(
  path: string,
  options: LanduseApiRequestOptions = {},
): Promise<T[]> => {
  const results: T[] = [];
  const limit = 100;
  let offset = 0;

  while (true) {
    const response = await callApiGet<PaginatedResponse<T>>(path, {
      ...options,
      query: { ...options.query, limit, offset },
    });
    results.push(...response.results);

    if (!response.next) {
      return results;
    }

    offset += response.results.length;
  }
};

export const callApiPost = <TResponse, TBody>(
  path: string,
  body: TBody,
  options: LanduseApiRequestOptions = {},
): Promise<TResponse> =>
  requestLanduseApi<TResponse>(path, "POST", options, body);

export const callApiPut = <TResponse, TBody>(
  path: string,
  body: TBody,
  options: LanduseApiRequestOptions = {},
): Promise<TResponse> =>
  requestLanduseApi<TResponse>(path, "PUT", options, body);

export const callApiPatch = <TResponse, TBody>(
  path: string,
  body: TBody,
  options: LanduseApiRequestOptions = {},
): Promise<TResponse> =>
  requestLanduseApi<TResponse>(path, "PATCH", options, body);

export const callApiDelete = (
  path: string,
  options: LanduseApiRequestOptions = {},
): Promise<void> => requestLanduseApi<void>(path, "DELETE", options);
