// @flow
import React, {PureComponent} from 'react';
import {Column, Row} from 'react-foundation';
import {connect} from 'react-redux';

import {getFieldOptions, getLabelOfOption} from '$util/helpers';
import {getUserFullName} from '$src/users/helpers';
import type {Attributes} from '$src/types';
import PlotApplicationInfoCheckCollapse from '$src/plotApplications/components/infoCheck/PlotApplicationInfoCheckCollapse';
import {
  getApplicationApplicantInfoCheckData,
} from '$src/plotApplications/selectors';
import ApplicantInfoCheck from '$src/application/components/infoCheck/ApplicantInfoCheck';
import {getApplicantInfoCheckAttributes} from '$src/application/selectors';
import {getApplicantInfoCheckItems} from '$src/application/helpers';

type OwnProps = {
  section: Object,
  identifier: string,
  answer: Object
};

type Props = {
  ...OwnProps,
  infoCheckAttributes: Attributes,
  infoCheckData: Array<Object>,
};

class PlotApplicationApplicantInfoCheck extends PureComponent<Props> {

  render(): React$Node {
    const {
      infoCheckAttributes,
      infoCheckData,
    } = this.props;

    const infoCheckStateOptions = getFieldOptions(infoCheckAttributes, 'state');

    return (
      <PlotApplicationInfoCheckCollapse className="PlotApplicationApplicantInfoCheck" headerTitle="Hakijan käsittelytiedot">
        <h4>Tarkistettavat dokumentit</h4>
        <ApplicantInfoCheck
          infoChecks={infoCheckData}
          infoCheckStateOptions={infoCheckStateOptions}
        />
      </PlotApplicationInfoCheckCollapse>
    );
  }
}

export default (connect((state, props) => ({
  infoCheckAttributes: getApplicantInfoCheckAttributes(state),
  infoCheckData: getApplicantInfoCheckItems(
    getApplicationApplicantInfoCheckData(state).filter((item) => item.entry === props.identifier)
  ),
}))(PlotApplicationApplicantInfoCheck): React$ComponentType<OwnProps>);
