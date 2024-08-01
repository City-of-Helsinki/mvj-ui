import type { AddressResult, ParseArguments, ServiceMapResponse } from "./types"
export default class Provider {
  options: Record<string, any>;

  constructor(options: Record<string, any> = {}) {
    this.options = options;
  }

  getParamString(params: Record<string, any>) {
    return Object.keys(params).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`).join('&');
  }

  async search({
    query
  }: { query: string }) {
    const url = this.endpoint({
      query
    });
    const request = await fetch(url);
    const json = await request.json() as ServiceMapResponse;
    return this.parse({
      data: json
    });
  }

  endpoint({
    query
  }: { query: string }) {
    const {
      params
    } = this.options;
    const paramString = this.getParamString({
      ...params,
      q: query
    });
    return `https://api.hel.fi/servicemap/v2/search/?${paramString}&type=address&municipality=helsinki`;
  }

  parse({
    data
  }: ParseArguments): Array<AddressResult> {
    return data.results?.map(address => {
      return {
        x: address.location?.coordinates[0] ?? 0,
        y: address.location?.coordinates[1] ?? 0,
        label: address.name?.fi ?? "",
      };
    });
  }
}