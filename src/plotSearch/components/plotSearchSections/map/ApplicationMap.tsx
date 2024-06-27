import React, { Component } from "react";
import { connect } from "react-redux";
import flowRight from "lodash/flowRight";
import isEmpty from "lodash/isEmpty";
import AreaNotesEditMap from "/src/areaNote/components/AreaNotesEditMap";
import AreaNotesLayer from "/src/areaNote/components/AreaNotesLayer";
import { fetchAreaNoteList } from "/src/areaNote/actions";
import { UsersPermissions } from "/src/usersPermissions/enums";
import { hasPermissions } from "util/helpers";
import { getAreaNoteList } from "/src/areaNote/selectors";
import { getUsersPermissions } from "/src/usersPermissions/selectors";
import type { AreaNoteList } from "/src/areaNote/types";
import type { UsersPermissions as UsersPermissionsType } from "/src/usersPermissions/types";
type OwnProps = {};
type Props = OwnProps & {
  areaNotes: AreaNoteList;
  fetchAreaNoteList: (...args: Array<any>) => any;
  usersPermissions: UsersPermissionsType;
};

class ApplicationMap extends Component<Props> {
  componentDidMount() {
    const {
      fetchAreaNoteList,
      usersPermissions
    } = this.props;

    if (hasPermissions(usersPermissions, UsersPermissions.VIEW_AREANOTE)) {
      fetchAreaNoteList({});
    }
  }

  getOverlayLayers = () => {
    const {
      areaNotes,
      usersPermissions
    } = this.props;
    const layers = [];
    {
      hasPermissions(usersPermissions, UsersPermissions.VIEW_AREANOTE) && !isEmpty(areaNotes) && layers.push({
        checked: false,
        component: <AreaNotesLayer key='area_notes' allowToEdit={false} areaNotes={areaNotes} />,
        name: 'Muistettavat ehdot'
      });
    }
    return layers;
  };

  render() {
    const overlayLayers = this.getOverlayLayers();
    return <AreaNotesEditMap allowToEdit={false} overlayLayers={overlayLayers} />;
  }

}

export default (flowRight(connect(state => {
  return {
    areaNotes: getAreaNoteList(state),
    usersPermissions: getUsersPermissions(state)
  };
}, {
  fetchAreaNoteList
}))(ApplicationMap) as React.ComponentType<OwnProps>);