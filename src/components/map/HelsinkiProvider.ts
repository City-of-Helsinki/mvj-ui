import { Provider } from "leaflet-geosearch";
import { SERVICE_MAP_URL } from "@/util/constants";
import type {
  AddressResult,
  ServiceMapResponse,
  ParseArgument,
  SearchArgument,
  SearchResult,
} from "./types";
export default class HelsinkiProvider extends Provider<
  ServiceMapResponse,
  AddressResult
> {
  options: Record<string, any>;

  constructor(options: Record<string, string | number | boolean> = {}) {
    super(options);
    this.options = options;
  }

  getParamString(params: Record<string, any>) {
    return Object.keys(params)
      .map(
        (key) =>
          `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`,
      )
      .join("&");
  }

  async search({ query }: SearchArgument): Promise<Array<AddressResult>> {
    const url = this.endpoint({
      query,
    });
    const request = await fetch(url);
    const json = (await request.json()) as ServiceMapResponse;
    return this.parse({
      data: json,
    });
  }

  endpoint({ query }: { query: string }) {
    const { params } = this.options;
    const paramString = this.getParamString({
      ...params,
      q: query,
    });
    return `${SERVICE_MAP_URL}/search/?${paramString}&type=address&municipality=helsinki`;
  }

  parse({ data }: ParseArgument<ServiceMapResponse>): Array<SearchResult> {
    return data.results?.map((address) => {
      return {
        x: address.location?.coordinates[0] ?? 0,
        y: address.location?.coordinates[1] ?? 0,
        label: address.name?.fi ?? "",
        bounds: null,
        raw: address,
      };
    });
  }
}
