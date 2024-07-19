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
  }: Record<string, any>) {
    // eslint-disable-next-line no-bitwise
    const protocol = ~location.protocol.indexOf('http') ? location.protocol : 'https:';
    const url = this.endpoint({
      query,
      protocol
    });
    const apiKey = process.env.PAIKKATIETOHAKU_API_KEY
    const request = await fetch(
      url, 
      { 
        headers: { 
          Authorization: `Bearer Api-Key ${apiKey}`,
        }
      }
    );
    const json = await request.json();
    return this.parse({
      data: json
    });
  }

  endpoint({
    query
  }: any = {}) {
    const {
      params
    } = this.options;
    const paramString = this.getParamString({ ...params,
      name: query
    });
    const proto = 'https:';
    return `${proto}//paikkatietohaku.api.hel.fi/v1/address/?${paramString}&municipality=91`;
  }

  parse({
    data
  }: any) {
    return data.objects.map(r => {
      return {
        x: r.location.coordinates[0],
        y: r.location.coordinates[1],
        label: r.name
      };
    });
  }

}