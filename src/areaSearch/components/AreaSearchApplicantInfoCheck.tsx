import React from "react";
import { connect } from "react-redux";
import { getFieldOptions } from "util/helpers";
import type { Attributes } from "types";
import ApplicantInfoCheck from "application/components/infoCheck/ApplicantInfoCheck";
import { getApplicantInfoCheckAttributes } from "application/selectors";
import { getApplicantInfoCheckItems } from "application/helpers";
type OwnProps = {
  infoCheckData: Array<Record<string, any>>;
};
type Props = OwnProps & {
  infoCheckAttributes: Attributes;
};

const AreaSearchApplicantInfoCheck = ({
  infoCheckAttributes,
  infoCheckData
}: Props) => {
  const infoCheckStateOptions = getFieldOptions(infoCheckAttributes, 'state');
  const infoChecks = getApplicantInfoCheckItems(infoCheckData);
  return <ApplicantInfoCheck infoChecks={infoChecks} infoCheckStateOptions={infoCheckStateOptions} />;
}

export default (connect(state => ({
  infoCheckAttributes: getApplicantInfoCheckAttributes(state)
}))(AreaSearchApplicantInfoCheck) as React.ComponentType<OwnProps>);