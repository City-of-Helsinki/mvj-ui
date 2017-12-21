import React, {Component} from 'react';
import {Polygon, Tooltip, FeatureGroup} from 'react-leaflet';
import MapContainer from '../../components/map/Map';
import L from 'leaflet';
import {EditControl} from 'react-leaflet-draw';
import {defaultCoordinates, defaultZoom} from '../../constants';

import '../../../node_modules/leaflet-draw/dist/leaflet.draw.css';

L.drawLocal.draw.handlers.circle.tooltip.start = 'Piirrä ympyrä klikkaamalla ja raahaamalla.';
L.drawLocal.draw.handlers.circle.radius = 'Säde';
L.drawLocal.draw.handlers.polygon.tooltip.start = 'Aloita alueen piirtäminen klikkaamalla.';
L.drawLocal.draw.handlers.polygon.tooltip.cont = 'Klikkaa jatkaaksesi alueen piirtämistä';
L.drawLocal.draw.handlers.polygon.tooltip.end = 'Klikkaa ensimmäistä pistettä sulkeaksesi alueen';
L.drawLocal.draw.handlers.rectangle.tooltip.start = 'Piirrä nelikulmio klikkaamalla ja raahaamalla.';
L.drawLocal.draw.handlers.simpleshape.tooltip.end = 'Vapauta hiiren painike lopettaaksesi piirtämisen.';

L.drawLocal.draw.toolbar.actions.title = 'Peruuta';
L.drawLocal.draw.toolbar.actions.text = 'Peruuta';
L.drawLocal.draw.toolbar.finish.title = 'Lopeta piirtäminen';
L.drawLocal.draw.toolbar.finish.text = 'Lopeta';
L.drawLocal.draw.toolbar.undo.title = 'Poista viimeksi lisätty piste';
L.drawLocal.draw.toolbar.undo.text = 'Poista viimeisin piste';

L.drawLocal.edit.toolbar.actions.save.title = 'Tallenna muutokset';
L.drawLocal.edit.toolbar.actions.save.text = 'Tallenna';
L.drawLocal.edit.toolbar.actions.cancel.title = 'Peruuta muutokset';
L.drawLocal.edit.toolbar.actions.cancel.text = 'Peruuta';
L.drawLocal.edit.toolbar.actions.clearAll.title = 'Poista kaikki lisätyt alueet';
L.drawLocal.edit.toolbar.actions.clearAll.text = 'Poista kaikki';

L.drawLocal.edit.toolbar.buttons.editDisabled = 'Ei muokattavia alueita';
L.drawLocal.edit.toolbar.buttons.edit = 'Muokkaa alueita';
L.drawLocal.edit.toolbar.buttons.editDisabled = 'Ei muokattavia alueita';
L.drawLocal.edit.toolbar.buttons.remove = 'Poista alueita';
L.drawLocal.edit.toolbar.buttons.removeDisabled = 'Ei poistettavia alueita';

L.drawLocal.edit.handlers.edit.tooltip.text = 'Muokkaa ominaisuuksia vetämällä kahvoja';
L.drawLocal.edit.handlers.edit.tooltip.subtext = 'Klikkaa peruuta-painiketta kumotaksesi muutokset';
L.drawLocal.edit.handlers.remove.tooltip.text = 'Klikkaa aluetta poistaaksesi sen';

type Props = {
  mockData: Array<Object>,
}

class Map extends Component {
  props: Props

  handleAreaClick = () => {
    console.log('polygon clicked!');
  };

  render() {
    return (
      <div className='map'>
        <MapContainer center={defaultCoordinates}
          zoom={defaultZoom}
        >

          <Polygon
            color="#009246" // tram green
            positions={[
              [60.19, 24.924],
              [60.19, 24.926],
              [60.194, 24.929],
              [60.196, 24.924],
            ]}
            onClick={() => this.handleAreaClick()}
          >
            <Tooltip sticky="true">
              <span>teksti tähän!</span>
            </Tooltip>
          </Polygon>
          <FeatureGroup>
            <EditControl
              position='topright'
              draw={{
                circlemarker: false,
                marker: false,
                polyline: false,
              }}
            />
          </FeatureGroup>
        </MapContainer>
      </div>
    );
  }
}

export default Map;
