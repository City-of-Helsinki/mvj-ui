// @flow
import React, {PureComponent} from 'react';
import {Column, Row} from 'react-foundation';
import {connect} from 'react-redux';

import {getFieldOptions, getLabelOfOption} from '$util/helpers';
import {getUserFullName} from '$src/users/helpers';
import type {Attributes} from '$src/types';
import {getApplicantInfoCheckItems} from '$src/plotApplications/helpers';
import PlotApplicationInfoCheckCollapse from '$src/plotApplications/components/infoCheck/PlotApplicationInfoCheckCollapse';
import {
  getApplicantInfoCheckAttributes, getApplicationApplicantInfoCheckData,
} from '$src/plotApplications/selectors';

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

    const infoCheckStatusOptions = getFieldOptions(infoCheckAttributes, 'state');

    return (
      <PlotApplicationInfoCheckCollapse className="PlotApplicationApplicantInfoCheck" headerTitle="Hakijan käsittelytiedot">
        <h4>Tarkistettavat dokumentit</h4>
        <Row>
          {infoCheckData.map((item) => {
            const statusText = getLabelOfOption(infoCheckStatusOptions, item.data.state);

            return <Column small={6} key={item.kind.type}>
              <Row>
                <Column small={8}>
                  <span>{item.kind.label}</span>
                </Column>
                <Column small={4}>
                  {statusText}
                  {item.data.preparer && <>, {getUserFullName(item.data.preparer)}</>}
                </Column>
              </Row>
            </Column>;
          })}
        </Row>
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
