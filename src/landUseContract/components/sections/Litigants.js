// @flow
import React, {Component} from 'react';
import {connect} from 'react-redux';

import Litigant from './Litigant';
import {getContentLitigants, isLitigantArchived} from '$src/landUseContract/helpers';
import {getCurrentLandUseContract} from '$src/landUseContract/selectors';

import type {LandUseContract} from '$src/landUseContract/types';

type Props = {
  currentLandUseContract: LandUseContract,
}

type State = {
  activeLitigants: Array<Object>,
  archivedLitigants: Array<Object>,
  currentLandUseContract: LandUseContract,
  litigants: Array<Object>,
}

class Litigants extends Component<Props, State> {
  state = {
    activeLitigants: [],
    archivedLitigants: [],
    currentLandUseContract: {},
    litigants: [],
  }

  static getDerivedStateFromProps(props: Props, state: State) {
    if(props.currentLandUseContract !== state.currentLandUseContract) {
      const litigants = getContentLitigants(props.currentLandUseContract);

      return {
        activeLitigants: litigants.filter((litigant) => !isLitigantArchived(litigant.litigant)),
        archivedLitigants: litigants.filter((litigant) => isLitigantArchived(litigant.litigant)),
        currentLandUseContract: props.currentLandUseContract,
        litigants: litigants,
      };
    }

    return null;
  }

  render() {
    const {activeLitigants, archivedLitigants} = this.state;

    return (
      <div>
        {(!activeLitigants.length) &&
          <p className='no-margin'>Ei osapuolia</p>
        }
        {!!activeLitigants.length && activeLitigants.map((litigant, index) =>
          <Litigant key={index} litigant={litigant} />
        )}

        {/* Archived litigants */}
        {(archivedLitigants.length) &&
          <h3 style={{marginTop: 10, marginBottom: 5}}>Arkisto</h3>
        }
        {!!archivedLitigants.length && archivedLitigants.map((litigant, index) =>
          <Litigant key={index} litigant={litigant} />
        )}
      </div>
    );
  }
}

export default connect(
  (state) => {
    return {
      currentLandUseContract: getCurrentLandUseContract(state),
    };
  }
)(Litigants);
