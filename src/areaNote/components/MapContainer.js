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

import AreaNotesLayer from '$src/areaNote/components/AreaNotesLayer';
import GeoSearch from '$components/map/GeoSearch';
import ZoomBox from '$components/map/ZoomBox';
import {fetchMapDataByType} from '$src/mapData/actions';
import {initializeAreaNote, showEditMode} from '$src/areaNote/actions';
import {minZoom, maxZoom} from '$src/constants';
import {getCoordsToLatLng} from '$util/helpers';
import {getMapDataByType} from '$src/mapData/selectors';
import {getAreaNoteList, getIsEditMode} from '$src/areaNote/selectors';

const bounds = L.bounds([25440000, 6630000], [25571072, 6761072]);
const CRS = new L.Proj.CRS(
  'EPSG:3879',
  '+proj=tmerc +lat_0=0 +lon_0=25 +k=1 +x_0=25500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs', {
    resolutions: [256, 128, 64, 32, 16, 8, 4, 2, 1, 0.5, 0.25, 0.125, 0.0625, 0.03125],
    bounds,
  });

type Props = {
  allowEditing?: boolean,
  areaNotes?: Array<Object>,
  center: Object,
  children: Object,
  fetchMapDataByType: Function,
  initializeAreaNote: Function,
  isEditMode: boolean,
  plansUnderground: ?Array<Object>,
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
    const {allowEditing, areaNotes, center, children, plansUnderground, zoom} = this.props;

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
                    color: '#008b02',
                  }}
                />
              }
            </LayerGroup>
          </Overlay>

          <Overlay checked name="Muistettavat ehdot">
            <LayerGroup>
              {!isEmpty(areaNotes) && <AreaNotesLayer allowEditing={allowEditing}/>}
            </LayerGroup>
          </Overlay>
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

export default flowRight(
  connect(
    (state) => {
      return {
        areaNotes: getAreaNoteList(state),
        isEditMode: getIsEditMode(state),
        plansUnderground: getMapDataByType(state, 'avoindata:Kaavahakemisto_alue_maanalainenkaava_voimassa'),
      };
    },
    {
      fetchMapDataByType,
      initializeAreaNote,
      showEditMode,
    },
  ),
)(MapContainer);