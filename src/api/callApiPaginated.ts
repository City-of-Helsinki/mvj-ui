import callApi from "./callApi";

function* callApiPaginated(request: Request): Generator<any, any, any> {
  let { response, bodyAsJson } = yield callApi(request);
  const allResults = [...bodyAsJson.results];

  if (bodyAsJson.next) {
    let nextUrl = bodyAsJson.next;
    while (nextUrl !== null) {
      request = new Request(nextUrl, {
        method: "GET",
      });
      ({ response, bodyAsJson } = yield callApi(request));
      const status = response.status;

      switch (status) {
        case 200:
          allResults.push(...bodyAsJson.results);
          break;
        case 204:
          return {
            response,
          };
        default:
          return {
            response,
            bodyAsJson: {
              exception: response.status,
              message: response.statusText,
            },
          };
      }

      nextUrl = bodyAsJson.next || null;
    }
  }

  bodyAsJson.results = allResults;

  return { response, bodyAsJson };
}

export default callApiPaginated;
