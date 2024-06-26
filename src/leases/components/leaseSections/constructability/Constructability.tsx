import React, { Fragment, PureComponent } from "react";
import { connect } from "react-redux";
import ConstructabilityItem from "./ConstructabilityItem";
import Divider from "/src/components/content/Divider";
import FormText from "/src/components/form/FormText";
import SendEmail from "./SendEmail";
import Title from "/src/components/content/Title";
import { LeaseAreasFieldPaths, LeaseAreasFieldTitles } from "leases/enums";
import { getContentConstructabilityAreas } from "leases/helpers";
import { getUiDataLeaseKey } from "uiData/helpers";
import { getFieldOptions } from "util/helpers";
import { getAttributes, getCurrentLease } from "leases/selectors";
import type { Attributes } from "types";
import type { Lease } from "leases/types";
type Props = {
  attributes: Attributes;
  currentLease: Lease;
};
type State = {
  areas: Array<Record<string, any>>;
  attributes: Attributes;
  constructabilityReportInvestigationStateOptions: Array<Record<string, any>>;
  constructabilityStateOptions: Array<Record<string, any>>;
  currentLease: Lease;
  locationOptions: Array<Record<string, any>>;
  pollutedLandRentConditionStateOptions: Array<Record<string, any>>;
  typeOptions: Array<Record<string, any>>;
};

class Constructability extends PureComponent<Props, State> {
  state = {
    areas: [],
    attributes: null,
    constructabilityReportInvestigationStateOptions: [],
    constructabilityStateOptions: [],
    currentLease: {},
    locationOptions: [],
    pollutedLandRentConditionStateOptions: [],
    typeOptions: []
  };

  static getDerivedStateFromProps(props: Props, state: State) {
    const newState: any = {};

    if (props.attributes !== state.attributes) {
      newState.currentLease = props.currentLease;
      newState.constructabilityReporInvestigationtStateOptions = getFieldOptions(props.attributes, LeaseAreasFieldPaths.CONSTRUCTABILITY_REPORT_INVESTIGATION_STATE);
      newState.constructabilityStateOptions = getFieldOptions(props.attributes, LeaseAreasFieldPaths.PRECONSTRUCTION_STATE);
      newState.locationOptions = getFieldOptions(props.attributes, LeaseAreasFieldPaths.LOCATION);
      newState.pollutedLandRentConditionStateOptions = getFieldOptions(props.attributes, LeaseAreasFieldPaths.POLLUTED_LAND_RENT_CONDITION_STATE);
      newState.typeOptions = getFieldOptions(props.attributes, LeaseAreasFieldPaths.TYPE);
    }

    if (props.currentLease !== state.currentLease) {
      newState.currentLease = props.currentLease;
      newState.areas = getContentConstructabilityAreas(props.currentLease);
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
      typeOptions
    } = this.state;
    return <Fragment>
        <Title uiDataKey={getUiDataLeaseKey(LeaseAreasFieldPaths.CONSTRUCTABILITY)}>
          {LeaseAreasFieldTitles.CONSTRUCTABILITY}
        </Title>
        <Divider />
        <SendEmail />

        {!areas || !areas.length && <FormText className='no-margin'>Ei vuokra-alueita</FormText>}
        {areas && !!areas.length && areas.map(area => <ConstructabilityItem key={area.id} area={area} constructabilityReportInvestigationStateOptions={constructabilityReportInvestigationStateOptions} constructabilityStateOptions={constructabilityStateOptions} locationOptions={locationOptions} pollutedLandRentConditionStateOptions={pollutedLandRentConditionStateOptions} typeOptions={typeOptions} />)}
      </Fragment>;
  }

}

export default connect(state => {
  return {
    attributes: getAttributes(state),
    currentLease: getCurrentLease(state)
  };
})(Constructability);