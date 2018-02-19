import {Polygon} from 'react-leaflet';
require('leaflet-measure-path');

type Props = {
  showOnHover?: boolean,
  minDistance?: number,
  formatDistance: Function,
  formatArea: Function,
}

class PolygonWithMeasurements extends Polygon {
  props: Props

  createLeafletElement(props) {
    return super.createLeafletElement(props);
  }

  updateLeafletElement(fromProps, toProps) {
    super.updateLeafletElement(fromProps, toProps);
  }

  componentDidMount() {
    super.componentDidMount();
    this.leafletElement.showMeasurements();
  }
}

export default PolygonWithMeasurements;
