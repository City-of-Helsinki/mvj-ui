// @ flow
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {GeoJSON} from 'react-leaflet';

import {initializeAreaNote, showEditMode} from '$src/areaNote/actions';
import {convertAreaNoteListToGeoJson, convertFeatureForDraw} from '$src/areaNote/helpers';
import {getCoordsToLatLng} from '$util/helpers';
import {getAreaNoteList, getIsEditMode} from '$src/areaNote/selectors';

import type {AreaNoteList} from '$src/areaNote/types';

type Props = {
  allowEditing?: boolean,
  areaNotes: AreaNoteList,
  initializeAreaNote: Function,
  isEditMode: boolean,
  showEditMode: Function,
}

type State = {
  areaNotes: AreaNoteList,
  areaNotesGeoJson: Object,
}

class AreaNotesLayer extends Component<Props, State> {
  static defaultProps = {
    allowEditing: false,
  }

  state = {
    areaNotes: [],
    areaNotesGeoJson: {},
  }

  static getDerivedStateFromProps(props, state) {
    if(props.areaNotes !== state.areaNotes) {
      return {
        areaNotesGeoJson: convertAreaNoteListToGeoJson(props.areaNotes),
        areaNotes: props.areaNotes,
      };
    }
    return null;
  }

  onMouseOver = (e) => {
    const {isEditMode} = this.props;

    if(!isEditMode) {
      const layer = e.target;
      layer.setStyle({
        fillOpacity: 0.7,
      });
    }
  }

  onMouseOut = (e) => {
    const {isEditMode} = this.props;

    if(!isEditMode) {
      const layer = e.target;
      layer.setStyle({
        fillOpacity: 0.2,
      });
    }
  }
  render() {
    const {areaNotesGeoJson} = this.state;

    return (
      <GeoJSON
        // Change key when area notes is changes to force update after editing shapes
        key={JSON.stringify(areaNotesGeoJson)}
        data={areaNotesGeoJson}
        coordsToLatLng={getCoordsToLatLng(areaNotesGeoJson)}
        onEachFeature={(feature, layer) => {
          if (feature.properties && feature.properties.note) {
            const popupContent = `<p>
              <strong>Muistettava ehto</strong><br/>
              ${feature.properties.note}
            </p>`;
            layer.bindPopup(popupContent);
          }

          layer.on({
            click: (e) => {
              const {allowEditing} = this.props;
              if(!allowEditing) {
                return;
              }
              const {initializeAreaNote, showEditMode} = this.props;

              initializeAreaNote({
                geoJSON: convertFeatureForDraw(feature),
                id: feature.properties.id,
                isNew: false,
                note: feature.properties.note,
              });

              showEditMode();
              e.target.setStyle({
                fillOpacity: 0.2,
              });
            },
            mouseover: this.onMouseOver,
            mouseout: this.onMouseOut,
          });
        }}
        style={{
          color: '#2196f3',
        }}
      />
    );

  }
}


export default connect(
  (state) => {
    return {
      areaNotes: getAreaNoteList(state),
      isEditMode: getIsEditMode(state),
    };
  },
  {
    initializeAreaNote,
    showEditMode,
  }
)(AreaNotesLayer);
