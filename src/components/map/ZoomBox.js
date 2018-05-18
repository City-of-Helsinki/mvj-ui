// @ flow
import {Control} from 'leaflet';
import 'leaflet-zoombox';
import {MapControl} from 'react-leaflet';
import type {ControlPosition} from './types';

type LeafletElement = Control.Zoom
type Props = {
  position?: ControlPosition,
  addToZoomControl?: boolean,
  content?: string,
  className?: string,
  modal?: boolean,
  title?: string,
}

class ZoomBox extends MapControl<LeafletElement, Props> {
  createLeafletElement(props: Props): LeafletElement {
    return new Control.ZoomBox(props);
  }
}

export default ZoomBox;
