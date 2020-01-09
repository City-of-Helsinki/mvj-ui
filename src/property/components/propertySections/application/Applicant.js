// @flow
import React, {Fragment, PureComponent} from 'react';
import {connect} from 'react-redux';
import {Row, Column} from 'react-foundation';

import SubTitle from '$components/content/SubTitle';
import FormText from '$components/form/FormText';
import FormTextTitle from '$components/form/FormTextTitle';
import {
  getFieldOptions,
  getLabelOfOption,
} from '$util/helpers';
import {getAttributes} from '$src/property/selectors';
import type {Attributes} from '$src/types';

type Props = {
  attributes: Attributes,
  applicant: Object,
}

type State = {

}

class Applicant extends PureComponent<Props, State> {
  state = {
  }

  render (){
    
    const {
      applicant,
      attributes,
    } = this.props;

    const clientTypeOptions = getFieldOptions(attributes, 'application_base.child.children.applicants.child.children.client_type');
    console.log(applicant);
    console.log(attributes);
    return (
      <Fragment>
        <Row>
          <Column large={12} style={{marginTop: 15}}>
            <SubTitle>
              {'HAKIJAN TIEDOT'}
            </SubTitle>
          </Column>
        </Row>
        <Row>
          <Column large={3}>
            <FormTextTitle>{'Asiakastyyppi'}</FormTextTitle>
            {console.log(attributes)}
            <FormText>{getLabelOfOption(clientTypeOptions, applicant.client_type) || '-'}</FormText>
          </Column>
        </Row>
        <SubTitle>
          {'Yrityksen tiedot'}
        </SubTitle>
        <Row>
          <Column small={6} medium={4} large={2}>
            <FormTextTitle>{'Organisaatio'}</FormTextTitle>
            <FormText>{applicant.company_organization || '-'}</FormText>
          </Column>
        </Row>
      </Fragment>
    );
  }
}

export default connect(
  (state) => {
    return {
      attributes: getAttributes(state),
    };
  },
)(Applicant);
