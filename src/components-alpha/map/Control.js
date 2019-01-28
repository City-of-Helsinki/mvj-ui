import ReactDOM from 'react-dom';
import L from 'leaflet';
import {MapControl} from 'react-leaflet';

export default class Control extends MapControl {
  UNSAFE_componentWillMount() {
    const {className, children, title} = this.props;

    const control = L.control({
      position: this.props.position || 'bottomright',
    });

    control.handleClick = this.handleClick;

    control.onAdd = function () {
      const div = L.DomUtil.create('div', `leaflet-control mvj-control ${className}`);
      const link = L.DomUtil.create('a', 'leaflet-control-button', div);
      link.title = title;

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
