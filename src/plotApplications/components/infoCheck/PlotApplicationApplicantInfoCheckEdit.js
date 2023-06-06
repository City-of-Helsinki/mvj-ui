// @flow
import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import {change} from 'redux-form';

import type {Attributes} from '$src/types';
import PlotApplicationInfoCheckCollapse from '$src/plotApplications/components/infoCheck/PlotApplicationInfoCheckCollapse';
import {
  getApplicantInfoCheckSubmissionErrors, getApplicationApplicantInfoCheckData,
} from '$src/plotApplications/selectors';
import {getApplicantInfoCheckAttributes} from '$src/application/selectors';
import ApplicantInfoCheckEdit from '$src/application/components/infoCheck/ApplicantInfoCheckEdit';
import {getApplicantInfoCheckFormName} from '$src/application/helpers';

type OwnProps = {
  section: Object,
  identifier: string,
  answer: Object
};

type Props = {
  ...OwnProps,
  infoCheckAttributes: Attributes,
  infoCheckIds: Array<number>,
  submissionErrors: Array<{
    id: number,
    kind: ?Object,
    error: ?Object | ?Array<Object>,
  }>,
  change: typeof change,
};

class PlotApplicationApplicantInfoCheck extends PureComponent<Props> {
  render(): React$Node {
    const {
      infoCheckIds,
      answer,
      submissionErrors,
    } = this.props;

    return (
      <PlotApplicationInfoCheckCollapse className="PlotApplicationApplicantInfoCheckEdit" headerTitle="Hakijan käsittelytiedot">
        <h4>Tarkistettavat dokumentit</h4>
        <ApplicantInfoCheckEdit
          infoCheckIds={infoCheckIds}
          answer={answer}
          submissionErrors={submissionErrors}
        />
      </PlotApplicationInfoCheckCollapse>
    );
  }
}

export default (connect((state, props) => {
  const formName = getApplicantInfoCheckFormName(props.identifier);
  const infoCheckIds = getApplicationApplicantInfoCheckData(state).filter((item) => item.entry === props.identifier).map((item) => item.id);

  return {
    infoCheckAttributes: getApplicantInfoCheckAttributes(state),
    infoCheckIds,
    formName,
    submissionErrors: getApplicantInfoCheckSubmissionErrors(state, infoCheckIds),
  };
}, {
  change,
})(PlotApplicationApplicantInfoCheck): React$ComponentType<OwnProps>);
