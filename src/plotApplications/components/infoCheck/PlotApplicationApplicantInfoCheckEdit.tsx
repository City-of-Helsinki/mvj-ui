import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { change } from "redux-form";
import type { Attributes } from "types";
import PlotApplicationInfoCheckCollapse from "@/plotApplications/components/infoCheck/PlotApplicationInfoCheckCollapse";
import { getApplicantInfoCheckSubmissionErrors, getApplicationApplicantInfoCheckData } from "@/plotApplications/selectors";
import { getApplicantInfoCheckAttributes } from "@/application/selectors";
import ApplicantInfoCheckEdit from "@/application/components/infoCheck/ApplicantInfoCheckEdit";
import { getApplicantInfoCheckFormName } from "@/application/helpers";
type OwnProps = {
  section: Record<string, any>;
  identifier: string;
  answer: Record<string, any>;
};
type Props = OwnProps & {
  infoCheckAttributes: Attributes;
  infoCheckIds: Array<number>;
  submissionErrors: Array<{
    id: number;
    kind: Record<string, any> | null | undefined;
    error: (Record<string, any> | null | undefined) | (Array<Record<string, any>> | null | undefined);
  }>;
  change: typeof change;
};

class PlotApplicationApplicantInfoCheck extends PureComponent<Props> {
  render(): JSX.Element {
    const {
      infoCheckIds,
      answer,
      submissionErrors
    } = this.props;
    return <PlotApplicationInfoCheckCollapse className="PlotApplicationApplicantInfoCheckEdit" headerTitle="Hakijan käsittelytiedot">
        <>
        <h4>Tarkistettavat dokumentit</h4>
        <ApplicantInfoCheckEdit infoCheckIds={infoCheckIds} answer={answer} submissionErrors={submissionErrors} />
        </>
      </PlotApplicationInfoCheckCollapse>;
  }

}

export default (connect((state, props: Props) => {
  const formName = getApplicantInfoCheckFormName(props.identifier);
  const infoCheckIds = getApplicationApplicantInfoCheckData(state).filter(item => item.entry === props.identifier).map(item => item.id);
  return {
    infoCheckAttributes: getApplicantInfoCheckAttributes(state),
    infoCheckIds,
    formName,
    submissionErrors: getApplicantInfoCheckSubmissionErrors(state, infoCheckIds)
  };
}, {
  change
})(PlotApplicationApplicantInfoCheck) as React.ComponentType<OwnProps>);