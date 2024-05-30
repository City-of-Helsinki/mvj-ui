import React, { Component } from "react";
import { connect } from "react-redux";
import flowRight from "lodash/flowRight";
import isEmpty from "lodash/isEmpty";
import AreaNotesEditMap from "areaNote/components/AreaNotesEditMap";
import AreaNotesLayer from "areaNote/components/AreaNotesLayer";
import { fetchAreaNoteList } from "areaNote/actions";
import { UsersPermissions } from "usersPermissions/enums";
import { hasPermissions } from "util/helpers";
import { getAreaNoteList } from "areaNote/selectors";
import { getUsersPermissions } from "usersPermissions/selectors";
import type { AreaNoteList } from "areaNote/types";
import type { UsersPermissions as UsersPermissionsType } from "usersPermissions/types";
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