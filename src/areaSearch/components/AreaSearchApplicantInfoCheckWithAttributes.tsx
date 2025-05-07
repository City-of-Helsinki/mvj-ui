import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { getFieldOptions } from "@/util/helpers";
import type { Attributes } from "types";
import AreaSearchApplicantInfoCheck from "@/areaSearch/components/infoCheck/AreaSearchApplicantInfoCheck";
import { getApplicantInfoCheckAttributes } from "@/application/selectors";
import { getApplicantInfoCheckItems } from "@/application/helpers";

type OwnProps = {
  infoCheckData: Array<Record<string, any>>;
};

type Props = OwnProps & {
  infoCheckAttributes: Attributes;
};

class AreaSearchApplicantInfoCheckWithAttributes extends PureComponent<Props> {
  render(): JSX.Element {
    const { infoCheckAttributes, infoCheckData } = this.props;
    const infoCheckStateOptions = getFieldOptions(infoCheckAttributes, "state");
    const infoChecks = getApplicantInfoCheckItems(infoCheckData);
    return (
      <AreaSearchApplicantInfoCheck
        infoChecks={infoChecks}
        infoCheckStateOptions={infoCheckStateOptions}
      />
    );
  }
}

export default connect((state) => ({
  infoCheckAttributes: getApplicantInfoCheckAttributes(state),
}))(AreaSearchApplicantInfoCheckWithAttributes) as React.ComponentType<OwnProps>;
