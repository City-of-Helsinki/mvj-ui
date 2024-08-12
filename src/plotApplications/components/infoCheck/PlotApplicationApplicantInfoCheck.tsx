import React, { PureComponent } from "react";
import { Column, Row } from "react-foundation";
import { connect } from "react-redux";
import { getFieldOptions, getLabelOfOption } from "@/util/helpers";
import { getUserFullName } from "@/users/helpers";
import type { Attributes } from "types";
import PlotApplicationInfoCheckCollapse from "@/plotApplications/components/infoCheck/PlotApplicationInfoCheckCollapse";
import { getApplicationApplicantInfoCheckData } from "@/plotApplications/selectors";
import ApplicantInfoCheck from "@/application/components/infoCheck/ApplicantInfoCheck";
import { getApplicantInfoCheckAttributes } from "@/application/selectors";
import { getApplicantInfoCheckItems } from "@/application/helpers";
type OwnProps = {
  section: Record<string, any>;
  identifier: string;
  answer: Record<string, any>;
};
type Props = OwnProps & {
  infoCheckAttributes: Attributes;
  infoCheckData: Array<Record<string, any>>;
};

class PlotApplicationApplicantInfoCheck extends PureComponent<Props> {
  render(): React.ReactNode {
    const {
      infoCheckAttributes,
      infoCheckData
    } = this.props;
    const infoCheckStateOptions = getFieldOptions(infoCheckAttributes, 'state');
    return <PlotApplicationInfoCheckCollapse className="PlotApplicationApplicantInfoCheck" headerTitle="Hakijan käsittelytiedot">
        <h4>Tarkistettavat dokumentit</h4>
        <ApplicantInfoCheck infoChecks={infoCheckData} infoCheckStateOptions={infoCheckStateOptions} />
      </PlotApplicationInfoCheckCollapse>;
  }

}

export default (connect((state, props) => ({
  infoCheckAttributes: getApplicantInfoCheckAttributes(state),
  infoCheckData: getApplicantInfoCheckItems(getApplicationApplicantInfoCheckData(state).filter(item => item.entry === props.identifier))
}))(PlotApplicationApplicantInfoCheck) as React.ComponentType<OwnProps>);