// @flow
import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import {change} from 'redux-form';

import PlotApplicationInfoCheckCollapse from '$src/plotApplications/components/infoCheck/PlotApplicationInfoCheckCollapse';
import {
  getApplicantInfoCheckSubmissionErrors, getApplicationApplicantInfoCheckData,
} from '$src/areaSearch/selectors';
import ApplicantInfoCheckEdit from '$src/application/components/infoCheck/ApplicantInfoCheckEdit';
import {getApplicantInfoCheckFormName} from '$src/application/helpers';

type OwnProps = {
  section: Object,
  identifier: string,
  answer: Object
};

type Props = {
  ...OwnProps,
  infoCheckIds: Array<number>,
  change: typeof change,
  submissionErrors: Array<{
    id: number,
    kind: ?Object,
    error: ?Object | ?Array<Object>,
  }>,
};

class PlotApplicationApplicantInfoCheck extends PureComponent<Props> {
  render(): React$Node {
    const {
      infoCheckIds,
      answer,
      submissionErrors,
    } = this.props;

    return <ApplicantInfoCheckEdit
      answer={answer}
      infoCheckIds={infoCheckIds}
      submissionErrors={submissionErrors}
      showMarkAll={false}
    />;
  }
}

export default (connect((state, props) => {
  const formName = getApplicantInfoCheckFormName(props.identifier);

  const infoCheckIds = getApplicationApplicantInfoCheckData(state).filter((item) => item.entry === props.identifier).map((item) => item.id);

  return {
    infoCheckIds,
    formName,
    submissionErrors: getApplicantInfoCheckSubmissionErrors(state, infoCheckIds),
  };
}, {
  change,
})(PlotApplicationApplicantInfoCheck): React$ComponentType<OwnProps>);
