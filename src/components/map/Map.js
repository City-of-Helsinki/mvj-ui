// @ flow
import React from 'react';
import {Map, TileLayer/*Marker, Popup*/} from 'react-leaflet';
import {tileLayer} from '../../constants';

type Props = {
  center: Object,
  zoom: Number,
};

const MapContainer = ({center, zoom}: Props) => {
  return (
    <Map center={center} zoom={zoom}>
      <TileLayer
        attribution={null}
        url={tileLayer}
      />
      {/*<Marker position={center}>*/}
      {/*<Popup>*/}
      {/*<span>A pretty CSS3 popup. <br /> Easily customizable.</span>*/}
      {/*</Popup>*/}
      {/*</Marker>*/}
    </Map>
  );
};

export default MapContainer;
