import React, { Fragment } from "react";
import classnames from "classnames";
import { ConstructabilityStatus } from "/src/leases/enums";
import { getLabelOfOption } from "util/helpers";
type StatusIndicatorProps = {
  researchState: string;
  stateOptions: Array<Record<string, any>>;
};

const StatusIndicator = ({
  researchState,
  stateOptions
}: StatusIndicatorProps) => <Fragment>
    <div className={classnames({
    'collapse__header_icon collapse__header_icon--neutral': !researchState || researchState === ConstructabilityStatus.UNVERIFIED
  }, {
    'collapse__header_icon collapse__header_icon--alert': researchState === ConstructabilityStatus.REQUIRES_MEASURES
  }, {
    'collapse__header_icon collapse__header_icon--success': researchState === ConstructabilityStatus.COMPLETE
  }, {
    'collapse__header_icon collapse__header_icon--enquiry-sent': researchState === ConstructabilityStatus.ENQUIRY_SENT
  })}>
      <i />
      <span>
        {getLabelOfOption(stateOptions, researchState || ConstructabilityStatus.UNVERIFIED)}
      </span>
    </div>
  </Fragment>;

export default StatusIndicator;