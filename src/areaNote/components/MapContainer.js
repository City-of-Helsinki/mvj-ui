// @ flow
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import L from 'leaflet';
import {
  LayersControl,
  LayerGroup,
  Map,
  WMSTileLayer,
  ZoomControl,
} from 'react-leaflet';
const {BaseLayer, Overlay} = LayersControl;
import FullscreenControl from 'react-leaflet-fullscreen';
import 'proj4';
import 'proj4leaflet';

import GeoSearch from '$components/map/GeoSearch';
import Loader from '$components/loader/Loader';
import LoaderWrapper from '$components/loader/LoaderWrapper';
import ZoomBox from '$components/map/ZoomBox';
import {minZoom, maxZoom} from '$src/constants';

const bounds = L.bounds([25440000, 6630000], [25571072, 6761072]);
const CRS = new L.Proj.CRS(
  'EPSG:3879',
  '+proj=tmerc +lat_0=0 +lon_0=25 +k=1 +x_0=25500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs', {
    resolutions: [256, 128, 64, 32, 16, 8, 4, 2, 1, 0.5, 0.25, 0.125, 0.0625, 0.03125],
    bounds,
  });

type Props = {
  bounds?: Object,
  center: Object,
  children: Object,
  isLoading?: boolean,
  onMapDidMount?: Function,
  onViewportChanged?: Function,
  overlayLayers?: Array<Object>,
  zoom: Number,
};

class MapContainer extends Component<Props> {
  map: any

  static contextTypes = {
    router: PropTypes.object,
  };

  setMapRef = (el: any) => {
    this.map = el;
  }

  componentDidMount = () => {
    const {onMapDidMount} = this.props;

    if(this.map && onMapDidMount) {
      onMapDidMount(this.getMapValues());
    }
  }

  handleViewportChanged = () => {
    const {onViewportChanged} = this.props;

    if(this.map && onViewportChanged) {
      onViewportChanged(this.getMapValues());
    }
  }

  getMapValues = () => {
    return {
      bBox: this.map.leafletElement.getBounds().toBBoxString(),
      zoom: this.map.leafletElement.getZoom(),
    };
  }

  render() {
    const {bounds, center, children, isLoading, overlayLayers, zoom} = this.props;

    return (
      <Map
        ref={this.setMapRef}
        attributionControl={false}
        center={center ? center : undefined}
        bounds={bounds ? bounds : undefined}
        minZoom={minZoom}
        maxZoom={maxZoom}
        zoom={zoom}
        zoomControl={false}
        crs={CRS}
        boxZoom={false}
        onViewportChanged={this.handleViewportChanged}
      >
        {isLoading &&
          <LoaderWrapper className='relative-overlay-wrapper'><Loader isLoading={true} /></LoaderWrapper>
        }
        <LayersControl position='topright'>
          <BaseLayer checked name="Karttasarja">
            <WMSTileLayer
              url={'https://kartta.hel.fi/ws/geoserver/avoindata/wms?'}
              layers={'avoindata:Karttasarja'}
              format={'image/png'}
              transparent={true}
            />
          </BaseLayer>
          <BaseLayer name="Ortoilmakuva">
            <WMSTileLayer
              url={'https://kartta.hel.fi/ws/geoserver/avoindata/wms?'}
              layers={'avoindata:Ortoilmakuva'}
              format={'image/png'}
              transparent={true}
            />
          </BaseLayer>
          <BaseLayer name="Asemakaava">
            <WMSTileLayer
              url={'https://kartta.hel.fi/ws/geoserver/avoindata/wms?'}
              layers={'avoindata:Ajantasa_asemakaava'}
              format={'image/png'}
              transparent={true}
            />
          </BaseLayer>
          {!!overlayLayers && overlayLayers.length && overlayLayers.map((layer, index) =>
            <Overlay checked={layer.checked} name={layer.name} key={index}>
              <LayerGroup>
                {layer.component}
              </LayerGroup>
            </Overlay>
          )}
        </LayersControl>

        <GeoSearch />
        <FullscreenControl
          position="topright"
          title='Koko näytön tila'
        />
        <ZoomControl
          position='topright'
          zoomInTitle='Lähennä'
          zoomOutTitle='Loitonna'
        />
        <ZoomBox
          position='topright'
          modal={true}
          title='Tarkenna valittuun alueeseen'
        />
        {children}
      </Map>
    );
  }
}

export default MapContainer;
