import { MapControl, withLeaflet } from "react-leaflet";
import { GeoSearchControl } from "leaflet-geosearch";
import HelsinkiProvider from "./HelsinkiProvider";
type LeafletElement = GeoSearchControl;

class GeoSearch extends MapControl<LeafletElement> {
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
      zoomLevel: 9
    });
  }

}

export default withLeaflet(GeoSearch);