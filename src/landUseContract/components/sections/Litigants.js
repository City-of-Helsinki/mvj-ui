// @flow
import React, {Fragment, PureComponent} from 'react';
import {connect} from 'react-redux';

import FormText from '$components/form/FormText';
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

class Litigants extends PureComponent<Props, State> {
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
      <Fragment>
        {(!activeLitigants.length) &&
          <FormText className='no-margin'>Ei osapuolia</FormText>
        }
        {!!activeLitigants.length && activeLitigants.map((litigant, index) =>
          <Litigant key={index} litigant={litigant} />
        )}

        {/* Archived litigants */}
        {!!archivedLitigants.length &&
          <h3 style={{marginTop: 10, marginBottom: 5}}>Arkisto</h3>
        }
        {!!archivedLitigants.length && archivedLitigants.map((litigant, index) =>
          <Litigant key={index} litigant={litigant} />
        )}
      </Fragment>
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
