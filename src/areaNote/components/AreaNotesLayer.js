// @ flow
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {GeoJSON} from 'react-leaflet';

import {initializeAreaNote, showEditMode} from '$src/areaNote/actions';

import {convertAreaNoteListToGeoJson, convertFeatureToFeatureCollection} from '$src/areaNote/helpers';
import {getUserFullName} from '$src/users/helpers';
import {formatDate} from '$src/util/helpers';
import {
  getAreaNoteList,
  getIsEditMode,
  getMethods as getAreaNoteMethods,
} from '$src/areaNote/selectors';

import type {Methods} from '$src/types';
import type {AreaNoteList} from '$src/areaNote/types';

type Props = {
  allowEditing?: boolean,
  areaNoteMethods: Methods,
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

  onClick = (e: any, feature: Object) => {
    const {allowEditing, areaNoteMethods, initializeAreaNote, showEditMode} = this.props;
    if(!areaNoteMethods.PATCH || !allowEditing) return;

    initializeAreaNote({
      geoJSON: convertFeatureToFeatureCollection(feature),
      id: feature.properties.id,
      isNew: false,
      note: feature.properties.note,
    });

    showEditMode();

    e.target.setStyle({
      fillOpacity: 0.2,
    });
  }

  onMouseOver = (e: any) => {
    const {isEditMode} = this.props;

    if(!isEditMode) {
      const layer = e.target;
      layer.setStyle({
        fillOpacity: 0.7,
      });
    }
  }

  onMouseOut = (e: any) => {
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
        // Add this coodination convert function if want to to use EPSG:3879 projection
        // coordsToLatLng={getCoordsToLatLng(areaNotesGeoJson)}
        onEachFeature={(feature, layer) => {
          if (feature.properties) {
            const popupContent = `<p>
              <strong>${formatDate(feature.properties.modified_at)} ${getUserFullName(feature.properties.user)}</strong><br/>
              ${feature.properties.note || '-'}
            </p>`;
            layer.bindPopup(popupContent);
          }

          layer.on({
            click: (e) => this.onClick(e, feature),
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
      areaNoteMethods: getAreaNoteMethods(state),
      areaNotes: getAreaNoteList(state),
      isEditMode: getIsEditMode(state),
    };
  },
  {
    initializeAreaNote,
    showEditMode,
  }
)(AreaNotesLayer);
