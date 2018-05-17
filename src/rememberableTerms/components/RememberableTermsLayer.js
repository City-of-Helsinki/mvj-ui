// @ flow
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {GeoJSON} from 'react-leaflet';

import {initializeRememberableTerm, showEditMode} from '../actions';
import {getRememberableTermsById} from '../helpers';
import {getIsEditMode, getRememberableTermList} from '../selectors';
import {getCoordsToLatLng} from '$util/helpers';


type Props = {
  initializeRememberableTerm: Function,
  isEditMode: boolean,
  rememberableTerms: Object,
  showEditMode: Function,
}

class RememberableTermsLayer extends Component<Props> {
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
    const {rememberableTerms} = this.props;
    return (
      <GeoJSON
        // Change key when rememberableTerms is changes to force update after editing shapes
        key={JSON.stringify(rememberableTerms)}
        data={rememberableTerms}
        coordsToLatLng={getCoordsToLatLng(rememberableTerms)}
        onEachFeature={(feature, layer) => {
          if (feature.properties && feature.properties.comment) {
            const popupContent = `<p>
              <strong>Muistettava ehto</strong><br/>
              ${feature.properties.comment}
            </p>`;
            layer.bindPopup(popupContent);
          }

          layer.on({
            click: () => {
              const {initializeRememberableTerm, rememberableTerms, showEditMode} = this.props;
              initializeRememberableTerm({
                comment: feature.properties.comment,
                geoJSON: getRememberableTermsById(rememberableTerms, feature.properties.id),
                id: feature.properties.id,
                isNew: false,
              });
              showEditMode();
            },
            mouseover: this.onMouseOver,
            mouseout: this.onMouseOut,
          });
        }}
        style={{
          color: '#C95678',
        }}
      />
    );

  }
}


export default connect(
  (state) => {
    return {
      isEditMode: getIsEditMode(state),
      rememberableTerms: getRememberableTermList(state),
    };
  },
  {
    initializeRememberableTerm,
    showEditMode,
  }
)(RememberableTermsLayer);
