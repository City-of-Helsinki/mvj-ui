import React, { PureComponent } from "react";
import { connect } from "react-redux";
import flowRight from "lodash/flowRight";
import BoxItem from "@/components/content/BoxItem";
import BoxItemContainer from "@/components/content/BoxItemContainer";
import FormText from "@/components/form/FormText";
import GreenBox from "@/components/content/GreenBox";
import InspectionItem from "./InspectionItem";
import { getContentInspections } from "@/leases/helpers";
import { getAttributes as getLeaseAttributes, getCurrentLease } from "@/leases/selectors";
import type { Attributes } from "types";
import type { Lease } from "@/leases/types";
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
    const newState: any = {};

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