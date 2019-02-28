// @flow
import React, {PureComponent} from 'react';
import {Row, Column} from 'react-foundation';
import {connect} from 'react-redux';
import flowRight from 'lodash/flowRight';

import Authorization from '$components/authorization/Authorization';
import BoxItem from '$components/content/BoxItem';
import BoxItemContainer from '$components/content/BoxItemContainer';
import FormText from '$components/form/FormText';
import FormTextTitle from '$components/form/FormTextTitle';
import GreenBox from '$components/content/GreenBox';
import InspectionItem from './InspectionItem';
import {LeaseInspectionsFieldPaths, LeaseInspectionsFieldTitles} from '$src/leases/enums';
import {getContentInspections} from '$src/leases/helpers';
import {getUiDataLeaseKey} from '$src/uiData/helpers';
import {isFieldAllowedToRead} from '$util/helpers';
import {getAttributes, getCurrentLease} from '$src/leases/selectors';
import {withWindowResize} from '$components/resize/WindowResizeHandler';

import type {Attributes} from '$src/types';
import type {Lease} from '$src/leases/types';

type Props = {
  attributes: Attributes,
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
    const {attributes, largeScreen} = this.props;
    const {inspections} = this.state;

    if(!inspections || !inspections.length) {
      return <FormText className='no-margin'>Ei tarkastuksia tai huomautuksia</FormText>;
    }

    return (
      <GreenBox>
        {inspections && !!inspections.length &&
          <BoxItemContainer>
            {largeScreen &&
              <Row>
                <Column large={2}>
                  <Authorization allow={isFieldAllowedToRead(attributes, LeaseInspectionsFieldPaths.INSPECTOR)}>
                    <FormTextTitle uiDataKey={getUiDataLeaseKey(LeaseInspectionsFieldPaths.INSPECTOR)}>
                      {LeaseInspectionsFieldTitles.INSPECTOR}
                    </FormTextTitle>
                  </Authorization>
                </Column>
                <Column large={2}>
                  <Authorization allow={isFieldAllowedToRead(attributes, LeaseInspectionsFieldPaths.SUPERVISION_DATE)}>
                    <FormTextTitle uiDataKey={getUiDataLeaseKey(LeaseInspectionsFieldPaths.SUPERVISION_DATE)}>
                      {LeaseInspectionsFieldTitles.SUPERVISION_DATE}
                    </FormTextTitle>
                  </Authorization>
                </Column>
                <Column large={2}>
                  <Authorization allow={isFieldAllowedToRead(attributes, LeaseInspectionsFieldPaths.SUPERVISED_DATE)}>
                    <FormTextTitle uiDataKey={getUiDataLeaseKey(LeaseInspectionsFieldPaths.SUPERVISED_DATE)}>
                      {LeaseInspectionsFieldTitles.SUPERVISED_DATE}
                    </FormTextTitle>
                  </Authorization>
                </Column>
                <Column large={6}>
                  <Authorization allow={isFieldAllowedToRead(attributes, LeaseInspectionsFieldPaths.DESCRIPTION)}>
                    <FormTextTitle uiDataKey={getUiDataLeaseKey(LeaseInspectionsFieldPaths.DESCRIPTION)}>
                      {LeaseInspectionsFieldTitles.DESCRIPTION}
                    </FormTextTitle>
                  </Authorization>
                </Column>
              </Row>
            }
            {inspections.map((inspection) => {
              if(largeScreen) {
                return(
                  <InspectionItem key={inspection.id} attributes={attributes} inspection={inspection} largeScreen />
                );
              } else {
                return(
                  <BoxItem
                    key={inspection.id}
                    className='no-border-on-first-child no-border-on-last-child'>
                    <InspectionItem attributes={attributes} inspection={inspection} />
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
        attributes: getAttributes(state),
        currentLease: getCurrentLease(state),
      };
    },
  )
)(Inspections);
