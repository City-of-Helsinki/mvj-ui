// @flow
import React, {Component} from 'react';
import {connect} from 'react-redux';
import isEmpty from 'lodash/isEmpty';

import ConstructabilityItem from './ConstructabilityItem';
import Divider from '$components/content/Divider';
import FormText from '$components/form/FormText';
import SendEmail from './SendEmail';
import {getContentConstructability} from '$src/leases/helpers';
import {getAttributeFieldOptions} from '$src/util/helpers';
import {getAttributes, getCurrentLease} from '$src/leases/selectors';

import type {Attributes} from '$src/types';
import type {Lease} from '$src/leases/types';

type Props = {
  attributes: Attributes,
  currentLease: Lease,
}

type State = {
  areas: Array<Object>,
  constructabilityReportStateOptions: Array<Object>,
  locationOptions: Array<Object>,
  pollutedLandConditionStateOptions: Array<Object>,
  stateOptions: Array<Object>,
  typeOptions: Array<Object>,
}

class Constructability extends Component<Props, State> {
  state = {
    areas: [],
    constructabilityReportStateOptions: [],
    locationOptions: [],
    pollutedLandConditionStateOptions: [],
    stateOptions: [],
    typeOptions: [],
  }

  componentWillMount() {
    const {attributes, currentLease} = this.props;

    if(!isEmpty(attributes)) {
      this.updateOptions();
    }
    if(!isEmpty(currentLease)) {
      this.updateContent();
    }
  }

  componentDidUpdate(prevProps) {
    if(prevProps.attributes !== this.props.attributes) {
      this.updateOptions();
    }
    if(prevProps.currentLease !== this.props.currentLease) {
      this.updateContent();
    }
  }

  updateContent = () => {
    const {currentLease} = this.props;

    this.setState({
      areas: getContentConstructability(currentLease),
    });
  }

  updateOptions = () => {
    const {attributes} = this.props;

    this.setState({
      constructabilityReportStateOptions: getAttributeFieldOptions(attributes, 'lease_areas.child.children.constructability_report_investigation_state'),
      locationOptions: getAttributeFieldOptions(attributes, 'lease_areas.child.children.location'),
      pollutedLandConditionStateOptions: getAttributeFieldOptions(attributes, 'lease_areas.child.children.polluted_land_rent_condition_state'),
      stateOptions: getAttributeFieldOptions(attributes, 'lease_areas.child.children.preconstruction_state'),
      typeOptions: getAttributeFieldOptions(attributes, 'lease_areas.child.children.type'),
    });
  }

  render() {
    const {
      areas,
      constructabilityReportStateOptions,
      locationOptions,
      pollutedLandConditionStateOptions,
      stateOptions,
      typeOptions,
    } = this.state;

    return (
      <div>
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
            constructabilityReportStateOptions={constructabilityReportStateOptions}
            locationOptions={locationOptions}
            pollutedLandConditionStateOptions={pollutedLandConditionStateOptions}
            stateOptions={stateOptions}
            typeOptions={typeOptions}
          />
        )}
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
)(Constructability);
