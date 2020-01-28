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

    const targetPropertyOptions = getFieldOptions(attributes, 'application_base.child.children.target.child.children.target_property');
    const fundingOptions = getFieldOptions(attributes, 'application_base.child.children.target.child.children.funding');
    const specialOptions = getFieldOptions(attributes, 'application_base.child.children.target.child.children.special');
    const otherOptions = getFieldOptions(attributes, 'application_base.child.children.target.child.children.other');

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
            <FormText>{getLabelOfOption(targetPropertyOptions, target.target_property) || '-'}</FormText>
          </Column>
          <Column small={6} medium={4} large={2}>
            <FormTextTitle>{'%-perusteinen'}</FormTextTitle>
            <FormText>{target.percentage || '-'}</FormText>
          </Column>
          {'€/k-m2'}
        </Row>
        <Row>
          <Column small={12} medium={6} large={4}>
            <FormTextTitle>{'Hankkeen pääsuunnittelija'}</FormTextTitle>
            <FormText>{target.head_planner || '-'}</FormText>
          </Column>
          <Column small={12} medium={6} large={4}>
            <FormTextTitle>{'Hannkeen arvioitu aikataulu'}</FormTextTitle>
            <FormText>{target.estimated_schedule || '-'}</FormText>
          </Column>
          <Column small={12} medium={6} large={4}>
            <FormTextTitle>{'Hankkeen toivottu laajuus (rakennusoikeus ja asuntojen lkm)'}</FormTextTitle>
            <FormText>{target.desired_size || '-'}</FormText>
          </Column>
          <Column small={12} medium={6} large={4}>
            <FormTextTitle>{'Rahoitus- ja hallintamuoto'}</FormTextTitle>
            {target.funding && target.funding.map((fund, index) =>
              <FormText key={index}>{getLabelOfOption(fundingOptions, fund) || '-'}</FormText>
            )}
          </Column>
          <Column small={12} medium={6} large={4}>
            <FormTextTitle>{'Rahoitus- ja hallintamuoto'}</FormTextTitle>
            {target.special && target.special.map((special, index) =>
              <FormText key={index}>{getLabelOfOption(specialOptions, special) || '-'}</FormText>
            )}
          </Column>
          <Column small={12} medium={6} large={4}>
            <FormTextTitle>{'Hankkeen toivottu laajuus (rakennusoikeus ja asuntojen lkm)'}</FormTextTitle>
            {target.other && target.other.map((other, index) =>
              <FormText key={index}>{getLabelOfOption(otherOptions, other) || '-'}</FormText>
            )}
          </Column>
          <Column small={12}>
            <FormTextTitle>{'Hankkeen yleiskuvaus'}</FormTextTitle>
            <FormText>{target.overal_picture || '-'}</FormText>
          </Column>
          <Column small={12}>
            <FormTextTitle>{'Hankkeen mahdolliset eristyispiirteet ja mahdolliset kehittämisteemat'}</FormTextTitle>
            <FormText>{target.peculiarities || '-'}</FormText>
          </Column>
          <Column small={12}>
            <FormTextTitle>{'Lyhyt kuvaus hankkeen suunnilusta ja toteutustavasta ja -organisaatiosta sekä hajikjan käytössä olevista taloudellisista ja muista resursseista'}</FormTextTitle>
            <FormText>{target.descriptions || '-'}</FormText>
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
)(Target);
