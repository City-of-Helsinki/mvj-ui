import React, { Fragment } from "react";
import { connect } from "react-redux";
import Authorization from "components/authorization/Authorization";
import Contracts from "./Contracts";
import Decisions from "./Decisions";
import Divider from "components/content/Divider";
import Inspections from "./Inspections";
import Title from "components/content/Title";
import { LeaseContractsFieldPaths, LeaseContractsFieldTitles, LeaseDecisionsFieldPaths, LeaseDecisionsFieldTitles, LeaseInspectionsFieldPaths, LeaseInspectionsFieldTitles } from "leases/enums";
import { getUiDataLeaseKey } from "uiData/helpers";
import { isFieldAllowedToRead } from "util/helpers";
import { getAttributes } from "leases/selectors";
import type { Attributes } from "types";
type Props = {
  attributes: Attributes;
};

const DecisionsMain = ({
  attributes
}: Props) => {
  return <Fragment>
      <Authorization allow={isFieldAllowedToRead(attributes, LeaseDecisionsFieldPaths.DECISIONS)}>
        <Title uiDataKey={getUiDataLeaseKey(LeaseDecisionsFieldPaths.DECISIONS)}>
          {LeaseDecisionsFieldTitles.DECISIONS}
        </Title>
        <Divider />
        <Decisions />
      </Authorization>

      <Authorization allow={isFieldAllowedToRead(attributes, LeaseContractsFieldPaths.CONTRACTS)}>
        <Title uiDataKey={getUiDataLeaseKey(LeaseContractsFieldPaths.CONTRACTS)}>
          {LeaseContractsFieldTitles.CONTRACTS}
        </Title>
        <Divider />
        <Contracts />
      </Authorization>

      <Authorization allow={isFieldAllowedToRead(attributes, LeaseInspectionsFieldPaths.INSPECTIONS)}>
        <Title uiDataKey={getUiDataLeaseKey(LeaseInspectionsFieldPaths.INSPECTIONS)}>
          {LeaseInspectionsFieldTitles.INSPECTIONS}
        </Title>
        <Divider />
        <Inspections />
      </Authorization>
    </Fragment>;
};

export default connect(state => {
  return {
    attributes: getAttributes(state)
  };
})(DecisionsMain);