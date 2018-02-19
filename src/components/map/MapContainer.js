// @ flow
import React from 'react';
import {Circle,
  LayersControl,
  LayerGroup,
  Map,
  Polygon,
  Polyline,
  Tooltip,
  WMSTileLayer,
  ZoomControl} from 'react-leaflet';
import FullscreenControl from 'react-leaflet-fullscreen';
import L from 'leaflet';
import 'proj4leaflet';
const {BaseLayer, Overlay} = LayersControl;

import {minZoom, maxZoom} from '../../constants';
import 'react-leaflet-fullscreen/dist/styles.css';

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
  rememberableTerms?: Array<Object>,
  zoom: Number,
  areas: Array<any>,
};

const getShapeForData = (term: Object, index: number) => {
  const {geometry, properties} = term;

  switch (geometry.type) {
    case 'LineString':
      return (
        <Polyline
          color="#D53272"
          positions={geometry.coordinates}
          key={index}
          onClick={() => this.handleAreaClick()}
        >
          {properties.comment && <Tooltip sticky="true"><span>{properties.comment}</span></Tooltip>}
        </Polyline>
      );
    case 'Point':
      return (
        <Circle
          color="#D53272"
          center={geometry.coordinates}
          key={index}
          radius={properties.radius}
          onClick={() => this.handleAreaClick()}
        >
          {properties.comment && <Tooltip sticky="true"><span>{properties.comment}</span></Tooltip>}
        </Circle>
      );
    case 'Polygon':
      return (
        <Polygon
          color="#D53272"
          key={index}
          positions={geometry.coordinates}
          onClick={() => this.handleAreaClick()}
        >
          {properties.comment && <Tooltip sticky="true"><span>{properties.comment}</span></Tooltip>}
        </Polygon>
      );
  }
};

const MapContainer = ({center, rememberableTerms, zoom, children, ...rest}: Props) => {
  return (
    <Map
      center={center}
      minZoom={minZoom}
      maxZoom={maxZoom}
      zoom={zoom}
      zoomControl={false}
      crs={CRS}
      {...rest}
    >
      <LayersControl position='topright'>
        <BaseLayer checked name="Karttasarja">
          <WMSTileLayer
            url={'https://kartta.hel.fi/ws/geoserver/avoindata/wms?'}
            layers={'avoindata:Karttasarja'}
            format={'image/png'}
            transparent={true}
            onTileerror={console.warn}
            onLoading={console.log}
            onLoad={console.log}
          />
        </BaseLayer>

        <Overlay  checked name="Muistettavat ehdot">
          <LayerGroup>
            {rememberableTerms && rememberableTerms.length && rememberableTerms.map((term, index) => {
              return (
                getShapeForData(term, index)
              );
            })}
          </LayerGroup>
        </Overlay>
      </LayersControl>

      <FullscreenControl position="topright" />
      <ZoomControl position='topright' />
      {children}
    </Map>
  );
};

export default MapContainer;
