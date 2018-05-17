// @ flow
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import L from 'leaflet';
import {
  GeoJSON,
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
import flowRight from 'lodash/flowRight';
import isEmpty from 'lodash/isEmpty';

import RememberableTermsLayer from '$src/rememberableTerms/components/RememberableTermsLayer';
import {fetchMapDataByType} from '$src/mapData/actions';
import {initializeRememberableTerm, showEditMode} from '$src/rememberableTerms/actions';
import {minZoom, maxZoom} from '$src/constants';
import {getMapDataByType} from '$src/mapData/selectors';
import {getIsEditMode, getRememberableTermList} from '$src/rememberableTerms/selectors';
import {getCoordsToLatLng} from '$util/helpers';

import 'react-leaflet-fullscreen/dist/styles.css';

const bounds = L.bounds([25440000, 6630000], [25571072, 6761072]);
const CRS = new L.Proj.CRS(
  'EPSG:3879',
  '+proj=tmerc +lat_0=0 +lon_0=25 +k=1 +x_0=25500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs', {
    resolutions: [256, 128, 64, 32, 16, 8, 4, 2, 1, 0.5, 0.25, 0.125, 0.0625, 0.03125],
    bounds,
  });

type Props = {
  center: Object,
  children: Object,
  fetchMapDataByType: Function,
  initializeRememberableTerm: Function,
  isEditMode: boolean,
  plansUnderground: ?Array<Object>,
  rememberableTerms?: Array<Object>,
  showEditMode: Function,
  zoom: Number,
  areas: Array<any>,
};

class MapContainer extends Component<Props> {
  static contextTypes = {
    router: PropTypes.object,
  };

  componentWillMount() {
    const {fetchMapDataByType} = this.props;

    fetchMapDataByType('avoindata:Kaavahakemisto_alue_maanalainenkaava_voimassa');
  }

  onMouseOver = (e) => {
    const {isEditMode} = this.props;

    if(!isEditMode) {
      const layer = e.target;
      layer.setStyle({
        fillOpacity: 0.7,
      });
      layer.openPopup();
    }
  }

  onMouseOut = (e) => {
    const {isEditMode} = this.props;

    if(!isEditMode) {
      const layer = e.target;
      layer.setStyle({
        fillOpacity: 0.2,
      });
      // layer.closePopup();
    }
  }

  render() {
    const {center, children, plansUnderground, rememberableTerms, zoom} = this.props;
    return (
      <Map
        center={center}
        minZoom={minZoom}
        maxZoom={maxZoom}
        zoom={zoom}
        zoomControl={false}
        crs={CRS}
      >
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

          <Overlay name="Asemakaava - maanalainen">
            <LayerGroup>
              {!isEmpty(plansUnderground) &&
                <GeoJSON
                  data={plansUnderground}
                  coordsToLatLng={getCoordsToLatLng(plansUnderground)}
                  onEachFeature={(feature, layer) => {
                    if (feature.properties) {
                      const popupContent = `<p>
                        <strong>Asemakaava: ${feature.properties.kaavatunnus}</strong><br/>
                        Tyyppi: ${feature.properties.tyyppi}<br/>
                        Luokka: ${feature.properties.luokka}<br/>
                        Korkeusjärjestelmä: ${feature.properties.korkeusjarjestelma}<br/>
                        Hyväksymispäivämäärä: ${feature.properties.hyvaksymispvm}
                      </p>`;
                      layer.bindPopup(popupContent);
                    }

                    layer.on({
                      mouseover: this.onMouseOver,
                      mouseout: this.onMouseOut,
                    });
                  }}
                  style={{
                    color: '#3A01DF',
                  }}
                />
              }
            </LayerGroup>
          </Overlay>

          <Overlay checked name="Muistettavat ehdot">
            <LayerGroup>
              {!isEmpty(rememberableTerms) && <RememberableTermsLayer/>}
            </LayerGroup>
          </Overlay>
        </LayersControl>

        <FullscreenControl position="topright" />
        <ZoomControl position='topright' />
        {children}
      </Map>
    );
  }
}

export default flowRight(
  connect(
    (state) => {
      return {
        isEditMode: getIsEditMode(state),
        plansUnderground: getMapDataByType(state, 'avoindata:Kaavahakemisto_alue_maanalainenkaava_voimassa'),
        rememberableTerms: getRememberableTermList(state),
      };
    },
    {
      fetchMapDataByType,
      initializeRememberableTerm,
      showEditMode,
    },
  ),
)(MapContainer);
