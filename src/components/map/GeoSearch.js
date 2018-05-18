// @ flow
import {MapControl} from 'react-leaflet';
import {GeoSearchControl} from 'leaflet-geosearch';
import HelsinkiProvider from './HelsinkiProvider';

class GeoSearch extends MapControl {

  createLeafletElement() {
    return GeoSearchControl({
      position: 'topright',
      style: 'bar',
      showMarker: false,
      provider: new HelsinkiProvider(),
      showPopup: false,
      autoClose: true,
      retainZoomLevel: false,
      animateZoom: true,
      keepResult: false,
      searchLabel: 'Hae osoitteella',
      zoomLevel: 9,
    });
  }
}

export default GeoSearch;
