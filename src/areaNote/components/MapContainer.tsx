import React, { Component } from "react";
import PropTypes from "prop-types";
import L from "leaflet";
import { LayersControl, LayerGroup, Map, WMSTileLayer, ZoomControl } from "react-leaflet";
const {
  BaseLayer,
  Overlay
} = LayersControl;
import FullscreenControl from "react-leaflet-fullscreen";
import proj4 from "proj4";
import "proj4leaflet";
import GeoSearch from "@/components/map/GeoSearch";
import Loader from "@/components/loader/Loader";
import LoaderWrapper from "@/components/loader/LoaderWrapper";
import ZoomBox from "@/components/map/ZoomBox";
import { MIN_ZOOM, MAX_ZOOM } from "@/util/constants";
const bounds = L.bounds([25440000, 6630000], [25571072, 6761072]);
const CRS = new L.Proj.CRS('EPSG:3879', '+proj=tmerc +lat_0=0 +lon_0=25 +k=1 +x_0=25500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs', {
  resolutions: [256, 128, 64, 32, 16, 8, 4, 2, 1, 0.5, 0.25, 0.125, 0.0625, 0.03125],
  bounds
});
proj4.defs('EPSG:3879', '+proj=tmerc +lat_0=0 +lon_0=25 +k=1 +x_0=25500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs');
proj4.defs('WGS84', '+title=WGS 84 (long/lat) +proj=longlat +ellps=WGS84 +datum=WGS84 +units=degrees');
type Props = {
  bounds?: Record<string, any>;
  center: Record<string, any>;
  children: Record<string, any>;
  isLoading?: boolean;
  onMapDidMount?: (...args: Array<any>) => any;
  onViewportChanged?: (...args: Array<any>) => any;
  overlayLayers?: Array<Record<string, any>>;
  zoom: number;
  enableSearch?: boolean;
  onMapRefAvailable?: (...args: Array<any>) => any;
};

class MapContainer extends Component<Props> {
  map: any;
  static contextTypes: Record<string, any> = {
    router: PropTypes.object
  };
  setMapRef: (arg0: any) => void = el => {
    this.map = el;
    this.props.onMapRefAvailable?.(el);
  };
  componentDidMount: () => void = () => {
    const {
      onMapDidMount
    } = this.props;

    if (this.map && onMapDidMount) {
      onMapDidMount(this.getMapValues());
    }
  };
  handleViewportChanged: () => void = () => {
    const {
      onViewportChanged
    } = this.props;

    if (this.map && onViewportChanged) {
      onViewportChanged(this.getMapValues());
    }
  };
  getMapValues: () => Record<string, any> = () => {
    return {
      bBox: this.map.leafletElement.getBounds().toBBoxString(),
      zoom: this.map.leafletElement.getZoom()
    };
  };

  render(): React.ReactNode {
    const {
      bounds,
      center,
      children,
      isLoading,
      overlayLayers,
      zoom,
      enableSearch = true
    } = this.props;
    return <Map ref={this.setMapRef} attributionControl={false} center={center ? center : undefined} bounds={bounds ? bounds : undefined} maxBoundsViscosity={0} minZoom={MIN_ZOOM} maxZoom={MAX_ZOOM} zoom={zoom} zoomControl={false} crs={CRS} boxZoom={false} onViewportChanged={this.handleViewportChanged}>
        {isLoading && <LoaderWrapper className='relative-overlay-wrapper'><Loader isLoading={true} /></LoaderWrapper>}
        <LayersControl position='topright'>
          <BaseLayer checked name="Karttasarja">
            <WMSTileLayer url={'https://kartta.hel.fi/ws/geoserver/avoindata/wms?'} layers={'avoindata:Karttasarja'} format={'image/png'} transparent={true} />
          </BaseLayer>
          <BaseLayer name="Ortoilmakuva">
            <WMSTileLayer url={'https://kartta.hel.fi/ws/geoserver/avoindata/wms?'} layers={'avoindata:Ortoilmakuva'} format={'image/png'} transparent={true} />
          </BaseLayer>
          <BaseLayer name="Asemakaava">
            <WMSTileLayer url={'https://kartta.hel.fi/ws/geoserver/avoindata/wms?'} layers={'avoindata:Ajantasa_asemakaava'} format={'image/png'} transparent={true} />
          </BaseLayer>
          {!!overlayLayers && overlayLayers.length && overlayLayers.map((layer, index) => <Overlay checked={layer.checked} name={layer.name} key={index}>
              <LayerGroup>
                {layer.component}
              </LayerGroup>
            </Overlay>)}
        </LayersControl>

        {enableSearch && <GeoSearch />}
        <FullscreenControl position="topright" title='Koko näytön tila' />
        <ZoomControl position='topright' zoomInTitle='Lähennä' zoomOutTitle='Loitonna' />
        <ZoomBox position='topright' modal={true} title='Tarkenna valittuun alueeseen' />
        {children}
      </Map>;
  }

}

export default MapContainer;