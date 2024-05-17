import React, { PureComponent } from "react";
import { connect } from "react-redux";
import flowRight from "lodash/flowRight";
import BoxItem from "src/components/content/BoxItem";
import BoxItemContainer from "src/components/content/BoxItemContainer";
import FormText from "src/components/form/FormText";
import GreenBox from "src/components/content/GreenBox";
import InspectionItem from "./InspectionItem";
import { getContentInspections } from "src/leases/helpers";
import { getAttributes as getLeaseAttributes, getCurrentLease } from "src/leases/selectors";
import type { Attributes } from "src/types";
import type { Lease } from "src/leases/types";
type Props = {
  currentLease: Lease;
  leaseAttributes: Attributes;
};
type State = {
  currentLease: Lease;
  inspections: Array<Record<string, any>>;
};

class Inspections extends PureComponent<Props, State> {
  state = {
    currentLease: {},
    inspections: []
  };

  static getDerivedStateFromProps(props: Props, state: State) {
    const newState = {};

    if (props.currentLease !== state.currentLease) {
      newState.currentLease = props.currentLease;
      newState.inspections = getContentInspections(props.currentLease);
    }

    return newState;
  }

  render() {
    const {
      leaseAttributes
    } = this.props;
    const {
      inspections
    } = this.state;

    if (!inspections || !inspections.length) {
      return <FormText className='no-margin'>Ei tarkastuksia tai huomautuksia</FormText>;
    }

    return <GreenBox>
        {inspections && !!inspections.length && <BoxItemContainer>
            {inspections.map(inspection => {
          return <BoxItem key={inspection.id} className='no-border-on-first-child no-border-on-last-child'>
                  <InspectionItem inspection={inspection} leaseAttributes={leaseAttributes} />
                </BoxItem>;
        })}
          </BoxItemContainer>}
      </GreenBox>;
  }

}

export default flowRight(connect(state => {
  return {
    currentLease: getCurrentLease(state),
    leaseAttributes: getLeaseAttributes(state)
  };
}))(Inspections);