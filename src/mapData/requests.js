// @flow

import callMapDataApi from './callMapDataApi';

export const fetchMapData = (search: string) => {
  const protocol = ~location.protocol.indexOf('http') ? location.protocol : 'https:';
  return callMapDataApi(new Request(`${protocol}//kartta.hel.fi/ws/geoserver/avoindata/wfs?${search || ''}`));
};
