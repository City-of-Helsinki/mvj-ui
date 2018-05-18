// @flow
import {MapControl} from 'react-leaflet';
import {GeoSearchControl, GoogleProvider} from 'leaflet-geosearch';

class GeoSearch extends MapControl {

  createLeafletElement() {
    return GeoSearchControl({
      position: 'topright',
      style: 'button',
      showMarker: false,
      provider: new GoogleProvider(),

      showPopup: false,
      autoClose: true,
      retainZoomLevel: false,
      animateZoom: true,
      keepResult: false,
      searchLabel: 'Hae',
    });
  }
}

export default GeoSearch;
