// @ flow
import React from 'react';
import {Map, WMSTileLayer} from 'react-leaflet';
import L from 'leaflet';
import 'proj4leaflet';

import {minZoom, maxZoom} from '../../constants';

const bounds = L.bounds([25440000, 6630000], [25571072, 6761072]);
// const originNw = [bounds.min.x, bounds.max.y];
const CRS = new L.Proj.CRS(
  'EPSG:3879',
  '+proj=tmerc +lat_0=0 +lon_0=25 +k=1 +x_0=25500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs', {
    resolutions: [256, 128, 64, 32, 16, 8, 4, 2, 1, 0.5, 0.25, 0.125, 0.0625, 0.03125],
    // transformation: new L.Transformation(1, -originNw[0], -1, originNw[1]),
    bounds,
  });

type Props = {
  center: Object,
  children: Object,
  zoom: Number,
  areas: Array<any>,
};

const MapContainer = ({center, zoom, children, ...rest}: Props) => {
  return (
    <Map
      center={center}
      minZoom={minZoom}
      maxZoom={maxZoom}
      zoom={zoom}
      crs={CRS}
      {...rest}
    >
      <WMSTileLayer
        url={'https://kartta.hel.fi/ws/geoserver/avoindata/wms?'}
        layers={'avoindata:Karttasarja'}
        format={'image/png'}
        transparent={true}
        onTileerror={console.warn}
        onLoading={console.log}
        onLoad={console.log}
      />
      {children}
    </Map>
  );
};

export default MapContainer;
