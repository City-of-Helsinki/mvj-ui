// @ flow
import React from 'react';
import {Map, TileLayer} from 'react-leaflet';
import {tileLayer} from '../../constants';
import L from 'leaflet';
import 'proj4leaflet';

const bounds = L.bounds(L.point(-548576, 6291456), L.point(1548576, 8388608));
const originNw = [bounds.min.x, bounds.max.y];
const GK25 = new L.Proj.CRS(
  'EPSG:3067',
  '+proj=utm +zone=35 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs', {
    resolutions: [8192, 4096, 2048, 1024, 512, 256, 128, 64, 32, 16, 8, 4, 2, 1, 0.5, 0.25, 0.125],
    transformation: new L.Transformation(1, -originNw[0], -1, originNw[1]),
    bounds,
  });

type Props = {
  center: Object,
  children: Object,
  zoom: Number,
  areas: Array<any>,
};

const MapContainer = ({center, zoom, children}: Props) => {
  return (
    <Map
      center={center}
      zoom={zoom}
      crs={GK25}
    >
      <TileLayer
        attribution={null}
        url={tileLayer}
      />
      {children}
    </Map>
  );
};

export default MapContainer;
