// @flow
import React, {Fragment, PureComponent} from 'react';
import {connect} from 'react-redux';

import ConstructabilityItem from './ConstructabilityItem';
import Divider from '$components/content/Divider';
import FormText from '$components/form/FormText';
import SendEmail from './SendEmail';
import {LeaseAreasFieldPaths} from '$src/leases/enums';
import {getContentConstructability} from '$src/leases/helpers';
import {getFieldAttributes, getFieldOptions} from '$src/util/helpers';
import {getAttributes, getCurrentLease} from '$src/leases/selectors';

import type {Attributes} from '$src/types';
import type {Lease} from '$src/leases/types';

type Props = {
  attributes: Attributes,
  currentLease: Lease,
}

type State = {
  areas: Array<Object>,
  attributes: Attributes,
  constructabilityReportInvestigationStateOptions: Array<Object>,
  constructabilityStateOptions: Array<Object>,
  currentLease: Lease,
  locationOptions: Array<Object>,
  pollutedLandRentConditionStateOptions: Array<Object>,
  typeOptions: Array<Object>,
}

class Constructability extends PureComponent<Props, State> {
  state = {
    areas: [],
    attributes: {},
    constructabilityReportInvestigationStateOptions: [],
    constructabilityStateOptions: [],
    currentLease: {},
    locationOptions: [],
    pollutedLandRentConditionStateOptions: [],
    typeOptions: [],
  }

  static getDerivedStateFromProps(props: Props, state: State) {
    const newState = {};

    if(props.attributes !== state.attributes) {
      newState.currentLease = props.currentLease;
      newState.constructabilityReporInvestigationtStateOptions = getFieldOptions(getFieldAttributes(props.attributes, LeaseAreasFieldPaths.CONSTRUCTABILITY_REPORT_INVESTIGATION_STATE));
      newState.constructabilityStateOptions = getFieldOptions(getFieldAttributes(props.attributes, LeaseAreasFieldPaths.PRECONSTRUCTION_STATE));
      newState.locationOptions = getFieldOptions(getFieldAttributes(props.attributes, LeaseAreasFieldPaths.LOCATION));
      newState.pollutedLandRentConditionStateOptions = getFieldOptions(getFieldAttributes(props.attributes, LeaseAreasFieldPaths.POLLUTED_LAND_RENT_CONDITION_STATE));
      newState.typeOptions = getFieldOptions(getFieldAttributes(props.attributes, LeaseAreasFieldPaths.TYPE));
    }

    if(props.currentLease !== state.currentLease) {
      newState.currentLease = props.currentLease;
      newState.areas = getContentConstructability(props.currentLease);
    }

    return newState;
  }

  render() {
    const {
      areas,
      constructabilityReportInvestigationStateOptions,
      constructabilityStateOptions,
      locationOptions,
      pollutedLandRentConditionStateOptions,
      typeOptions,
    } = this.state;

    return (
      <Fragment>
        <h2>Rakentamiskelpoisuus</h2>
        <Divider />
        <SendEmail />

        {!areas || !areas.length &&
          <FormText className='no-margin'>Ei vuokra-alueita</FormText>
        }
        {areas && !!areas.length && areas.map((area) =>
          <ConstructabilityItem
            key={area.id}
            area={area}
            constructabilityReportInvestigationStateOptions={constructabilityReportInvestigationStateOptions}
            constructabilityStateOptions={constructabilityStateOptions}
            locationOptions={locationOptions}
            pollutedLandRentConditionStateOptions={pollutedLandRentConditionStateOptions}
            typeOptions={typeOptions}
          />
        )}
      </Fragment>
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
)(Constructability);
