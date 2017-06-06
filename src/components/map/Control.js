import ReactDOM from 'react-dom';
import L from 'leaflet';
import {MapControl} from 'react-leaflet';

export default class Control extends MapControl {
  componentWillMount() {
    const {className, children} = this.props;

    const control = L.control({
      position: this.props.position || 'bottomright',
    });

    control.handleClick = this.handleClick;

    control.onAdd = function () {
      let div = L.DomUtil.create('div', `leaflet-control ${className}`);
      let link = L.DomUtil.create('a', 'leaflet-control-button', div);

      L.DomEvent
        .on(link, 'mousedown dblclick', L.DomEvent.stopPropagation)
        .on(link, 'click', L.DomEvent.stop)
        .on(link, 'click', this.handleClick, control);

      ReactDOM.render(children, link);

      return div;
    };

    this.leafletElement = control;
  }

  handleClick = (event: Object) => {
    const {onClick} = this.props;
    L.DomEvent.stopPropagation(event);
    event.stopPropagation();

    onClick && onClick(event);
  }
}
