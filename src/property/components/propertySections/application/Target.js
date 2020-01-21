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
  target: Object,
}

type State = {

}

class Target extends PureComponent<Props, State> {
  state = {
  }

  render (){
    
    const {
      target,
      attributes,
    } = this.props;

    const clientTypeOptions = getFieldOptions(attributes, 'application_base.child.children.applicants.child.children.client_type');

    return (
      <Fragment>
        <Row>
          <Column large={12} style={{marginTop: 15}}>
            <SubTitle>
              {'HAETTAVA KOHDE'}
            </SubTitle>
          </Column>
        </Row>
        <Row>
          <Column small={6} medium={4} large={2}>
            <FormTextTitle>{'Tontti, jota hakemus koskee'}</FormTextTitle>
            <FormText>{target.transcript_address || '-'}</FormText>
            <FormText>{getLabelOfOption(clientTypeOptions, target.client_type) || '-'}</FormText>
          </Column>
          <Column small={6} medium={4} large={2}>
            <FormTextTitle>{'%-perusteinen'}</FormTextTitle>
            <FormText>{target.transcript_postalcode || '-'}</FormText>
          </Column>
          {'€/k-m2'}
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
)(Target);