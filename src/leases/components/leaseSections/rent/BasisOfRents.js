// @flow
import React, {Fragment, PureComponent} from 'react';
import {connect} from 'react-redux';

import BasisOfRent from './BasisOfRent';
import BoxItemContainer from '$components/content/BoxItemContainer';
import FormText from '$components/form/FormText';
import GrayBox from '$components/content/GrayBox';
import GreenBox from '$components/content/GreenBox';
import {LeaseBasisOfRentsFieldPaths} from '$src/leases/enums';
import {getContentBasisOfRents} from '$src/leases/helpers';
import {getFieldOptions, isEmptyValue} from '$util/helpers';
import {getAttributes as getLeaseAttributes, getCurrentLease} from '$src/leases/selectors';

import type {Attributes} from '$src/types';
import type {Lease} from '$src/leases/types';

type Props = {
  currentLease: Lease,
  leaseAttributes: Attributes,
}

type State = {
  areaUnitOptions: Array<Object>,
  basisOfRents: Array<Object>,
  basisOfRentsArchived: Array<Object>,
  currentLease: Lease,
  indexOptions: Array<Object>,
  intendedUseOptions: Array<Object>,
  leaseAttributes: Attributes,
}
class BasisOfRents extends PureComponent<Props, State> {
  state = {
    areaUnitOptions: [],
    basisOfRents: [],
    basisOfRentsArchived: [],
    currentLease: {},
    indexOptions: [],
    intendedUseOptions: [],
    leaseAttributes: {},
  }
  static getDerivedStateFromProps(props: Props, state: State) {
    const newState = {};

    if(props.leaseAttributes !== state.leaseAttributes) {
      newState.leaseAttributes = props.leaseAttributes;
      newState.areaUnitOptions = getFieldOptions(props.leaseAttributes, LeaseBasisOfRentsFieldPaths.AREA_UNIT)
        .map((item) => ({...item, label: (!isEmptyValue(item.label) ? item.label.replace('^2', '²') : item.label)}));
      newState.indexOptions = getFieldOptions(props.leaseAttributes, LeaseBasisOfRentsFieldPaths.INDEX);
      newState.intendedUseOptions = getFieldOptions(props.leaseAttributes, LeaseBasisOfRentsFieldPaths.INTENDED_USE);
    }

    if(props.currentLease !== state.currentLease) {
      newState.currentLease = props.currentLease;
      newState.basisOfRents = getContentBasisOfRents(props.currentLease, false);
      newState.basisOfRentsArchived = getContentBasisOfRents(props.currentLease, true);
    }

    return newState;
  }

  render() {
    const {
      areaUnitOptions,
      basisOfRents,
      basisOfRentsArchived,
      indexOptions,
      intendedUseOptions,
    } = this.state;

    if(!basisOfRents || !basisOfRents.length) {
      return <FormText className='no-margin'>Ei vuokralaskureita</FormText>;
    }

    return (
      <Fragment>
        <GreenBox>
          <BoxItemContainer>
            {(basisOfRents && !!basisOfRents.length) && basisOfRents.map((basisOfRent, index) => {
              return(
                <BasisOfRent
                  key={index}
                  areaUnitOptions={areaUnitOptions}
                  basisOfRent={basisOfRent}
                  indexOptions={indexOptions}
                  intendedUseOptions={intendedUseOptions}
                />
              );
            })}
          </BoxItemContainer>
        </GreenBox>
        {basisOfRentsArchived && !!basisOfRentsArchived.length && <h3 style={{marginTop: 10, marginBottom: 5}}>Arkisto</h3>}
        {(basisOfRentsArchived && !!basisOfRentsArchived.length) &&
          <GrayBox>
            <BoxItemContainer>
              {basisOfRentsArchived.map((basisOfRent, index) => {
                return(
                  <BasisOfRent
                    key={index}
                    areaUnitOptions={areaUnitOptions}
                    basisOfRent={basisOfRent}
                    indexOptions={indexOptions}
                    intendedUseOptions={intendedUseOptions}
                  />
                );
              })}
            </BoxItemContainer>
          </GrayBox>
        }
      </Fragment>
    );
  }
}

export default connect(
  (state) => {
    return {
      currentLease: getCurrentLease(state),
      leaseAttributes: getLeaseAttributes(state),
    };
  },
)(BasisOfRents);
