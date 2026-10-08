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

const getQueryString = (query?: LanduseApiQuery): string => {
  const searchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(query ?? {})) {
    if (value !== null && value !== undefined) {
      searchParams.set(key, String(value));
    }
  }

  return searchParams.toString();
};

const getLanduseApiUrl = (path: string, query?: LanduseApiQuery): string => {
  const apiHost = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");
  const url = `${apiHost}/landuse/${path.replace(/^\//, "")}`;
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
    getLanduseApiUrl(path, options.query),
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
