import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { change } from "redux-form";
import {
  getApplicantInfoCheckSubmissionErrors,
  getApplicationApplicantInfoCheckData,
} from "@/areaSearch/selectors";
import AreaSearchApplicantInfoCheckEdit from "@/areaSearch/components/infoCheck/AreaSearchApplicantInfoCheckEdit";
import { getApplicantInfoCheckFormName } from "@/application/helpers";

type OwnProps = {
  section: Record<string, any>;
  identifier: string;
  answer: Record<string, any>;
};

type Props = OwnProps & {
  infoCheckIds: Array<number>;
  change: typeof change;
  submissionErrors: Array<{
    id: number;
    kind: Record<string, any> | null | undefined;
    error:
      | (Record<string, any> | null | undefined)
      | (Array<Record<string, any>> | null | undefined);
  }>;
};

class AreaSearchApplicantInfoCheckWithAttributesEdit extends PureComponent<Props> {
  render(): JSX.Element {
    const { infoCheckIds, answer, submissionErrors } = this.props;
    return (
      <AreaSearchApplicantInfoCheckEdit
        answer={answer}
        infoCheckIds={infoCheckIds}
        submissionErrors={submissionErrors}
        showMarkAll={false}
      />
    );
  }
}

export default connect(
  (state, props) => {
    const formName = getApplicantInfoCheckFormName(props.identifier);
    const infoCheckIds = getApplicationApplicantInfoCheckData(state)
      .filter((item) => item.entry === props.identifier)
      .map((item) => item.id);
    return {
      infoCheckIds,
      formName,
      submissionErrors: getApplicantInfoCheckSubmissionErrors(
        state,
        infoCheckIds,
      ),
    };
  },
  {
    change,
  },
)(
  AreaSearchApplicantInfoCheckWithAttributesEdit,
) as React.ComponentType<OwnProps>;
