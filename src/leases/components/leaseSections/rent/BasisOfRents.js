// @flow
import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import get from 'lodash/get';

import BasisOfRent from './BasisOfRent';
import BoxItemContainer from '$components/content/BoxItemContainer';
import FormText from '$components/form/FormText';
import GrayBox from '$components/content/GrayBox';
import GreenBox from '$components/content/GreenBox';
import {getContentBasisOfRents} from '$src/leases/helpers';
import {getFieldOptions, isEmptyValue} from '$util/helpers';
import {getAttributes, getCurrentLease} from '$src/leases/selectors';

import type {Attributes} from '$src/types';
import type {Lease} from '$src/leases/types';

type Props = {
  attributes: Attributes,
  currentLease: Lease,
}

type State = {
  areaUnitOptions: Array<Object>,
  attributes: Attributes,
  basisOfRents: Array<Object>,
  basisOfRentsArchived: Array<Object>,
  currentLease: Lease,
  indexOptions: Array<Object>,
  intendedUseOptions: Array<Object>,
}
class BasisOfRents extends PureComponent<Props, State> {
  state = {
    areaUnitOptions: [],
    attributes: {},
    basisOfRents: [],
    basisOfRentsArchived: [],
    currentLease: {},
    indexOptions: [],
    intendedUseOptions: [],
  }
  static getDerivedStateFromProps(props: Props, state: State) {
    const newState = {};

    if(props.attributes !== state.attributes) {
      newState.attributes = props.attributes;
      newState.areaUnitOptions = getFieldOptions(get(props.attributes, 'basis_of_rents.child.children.area_unit'))
        .map((item) => ({...item, label: (!isEmptyValue(item.label) ? item.label.replace('^2', '²') : item.label)}));
      newState.indexOptions = getFieldOptions(get(props.attributes, 'basis_of_rents.child.children.index'));
      newState.intendedUseOptions = getFieldOptions(get(props.attributes, 'basis_of_rents.child.children.intended_use'));
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

    return (
      <div>
        <GreenBox>
          <BoxItemContainer>
            {(!basisOfRents || !basisOfRents.length) && <FormText>Ei vuokralaskureita</FormText>}
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
      </div>
    );
  }
}

export default connect(
  (state) => {
    return {
      attributes: getAttributes(state),
      currentLease: getCurrentLease(state),
    };
  },
)(BasisOfRents);
