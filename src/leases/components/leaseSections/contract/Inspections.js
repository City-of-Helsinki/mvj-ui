// @flow
import React, {PureComponent} from 'react';
import {Row, Column} from 'react-foundation';
import {connect} from 'react-redux';
import flowRight from 'lodash/flowRight';

import BoxItem from '$components/content/BoxItem';
import BoxItemContainer from '$components/content/BoxItemContainer';
import FormText from '$components/form/FormText';
import FormTextTitle from '$components/form/FormTextTitle';
import GreenBox from '$components/content/GreenBox';
import InspectionItem from './InspectionItem';
import {getContentInspections} from '$src/leases/helpers';
import {getCurrentLease} from '$src/leases/selectors';
import {withWindowResize} from '$components/resize/WindowResizeHandler';

import type {Lease} from '$src/leases/types';

type Props = {
  currentLease: Lease,
  largeScreen: boolean,
}

type State = {
  currentLease: Lease,
  inspections: Array<Object>,
}

class Inspections extends PureComponent<Props, State> {
  state = {
    currentLease: {},
    inspections: [],
  }

  static getDerivedStateFromProps(props: Props, state: State) {
    const newState = {};

    if(props.currentLease !== state.currentLease) {
      newState.currentLease = props.currentLease;
      newState.inspections = getContentInspections(props.currentLease);
    }

    return newState;
  }

  render() {
    const {largeScreen} = this.props;
    const {inspections} = this.state;

    if(!inspections || !inspections.length) {
      return <FormText>Ei tarkastuksia tai huomautuksia</FormText>;
    }

    return (
      <GreenBox>
        {inspections && !!inspections.length &&
          <BoxItemContainer>
            {largeScreen &&
              <Row>
                <Column large={2}>
                  <FormTextTitle title='Tarkastaja' />
                </Column>
                <Column large={2}>
                  <FormTextTitle title='Valvontapvm' />
                </Column>
                <Column large={2}>
                  <FormTextTitle title='Valvottu pvm' />
                </Column>
                <Column large={6}>
                  <FormTextTitle title='Huomautus' />
                </Column>
              </Row>
            }
            {inspections.map((inspection) => {
              if(largeScreen) {
                return(
                  <InspectionItem key={inspection.id} inspection={inspection} largeScreen/>
                );
              } else {
                return(
                  <BoxItem
                    key={inspection.id}
                    className='no-border-on-last-child'>
                    <InspectionItem inspection={inspection}/>
                  </BoxItem>
                );
              }
            })}
          </BoxItemContainer>
        }
      </GreenBox>
    );
  }
}

export default flowRight(
  withWindowResize,
  connect(
    (state) => {
      return {
        currentLease: getCurrentLease(state),
      };
    },
  )
)(Inspections);
