// @flow

import callMapDataApi from './callMapDataApi';

export const fetchMapData = (search: string) => {
  return callMapDataApi(new Request(`http://kartta.hel.fi/ws/geoserver/avoindata/wfs?${search || ''}`));
};
