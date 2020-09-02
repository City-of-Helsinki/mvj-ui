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
import {getAttributes} from '$src/plotSearch/selectors';
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
          <Column small={6} medium={4} large={2}>
            <FormTextTitle>{'Y-tunnus'}</FormTextTitle>
            <FormText>{applicant.company_y_identifier || '-'}</FormText>
          </Column>
          <Column small={6} medium={4} large={2}>
            <FormTextTitle>{'Hakijayrityksen perustmisvuosi'}</FormTextTitle>
            <FormText>{applicant.company_founding_year || '-'}</FormText>
          </Column>
          <Column small={6} medium={4} large={2}>
            <FormTextTitle>{'Liikevaihto (edellinen vuosi)'}</FormTextTitle>
            <FormText>{applicant.company_revenue || '-'}</FormText>
          </Column>
          <Column small={6} medium={4} large={2}>
            <FormTextTitle>{'Katuosoite'}</FormTextTitle>
            <FormText>{applicant.company_address || '-'}</FormText>
          </Column>
          <Column small={6} medium={4} large={2}>
            <FormTextTitle>{'Postinumero'}</FormTextTitle>
            <FormText>{applicant.company_postal_code || '-'}</FormText>
          </Column>
          <Column small={6} medium={4} large={2}>
            <FormTextTitle>{'Kaupunki'}</FormTextTitle>
            <FormText>{applicant.company_city || '-'}</FormText>
          </Column>
          <Column small={6} medium={4} large={2}>
            <FormTextTitle>{'Sähköposti'}</FormTextTitle>
            <FormText>{applicant.company_email || '-'}</FormText>
          </Column>
          <Column small={6} medium={4} large={2}>
            <FormTextTitle>{'Puhelinnumero'}</FormTextTitle>
            <FormText>{applicant.company_phonenumber || '-'}</FormText>
          </Column>
        </Row>
        <SubTitle>
          {'Yrityksen tiedot'}
        </SubTitle>
        <Row>
          <Column small={6} medium={4} large={2}>
            <FormTextTitle>{'Nimi'}</FormTextTitle>
            <FormText>{applicant.contact_name || '-'}</FormText>
          </Column>
          <Column small={6} medium={4} large={2}>
            <FormTextTitle>{'Katuosoite'}</FormTextTitle>
            <FormText>{applicant.contact_address || '-'}</FormText>
          </Column>
          <Column small={6} medium={4} large={2}>
            <FormTextTitle>{'Postinumero'}</FormTextTitle>
            <FormText>{applicant.contact_postalcode || '-'}</FormText>
          </Column>
          <Column small={6} medium={4} large={2}>
            <FormTextTitle>{'Kaupunki'}</FormTextTitle>
            <FormText>{applicant.contact_city || '-'}</FormText>
          </Column>
          <Column small={6} medium={4} large={2}>
            <FormTextTitle>{'Puhelinnumero'}</FormTextTitle>
            <FormText>{applicant.contact_phonenumber || '-'}</FormText>
          </Column>
        </Row>
        <SubTitle>
          {'Henkilön tiedot'}
        </SubTitle>
        <Row>
          <Column small={6} medium={4} large={2}>
            <FormTextTitle>{'Nimi'}</FormTextTitle>
            <FormText>{applicant.person_name || '-'}</FormText>
          </Column>
          <Column small={6} medium={4} large={2}>
            <FormTextTitle>{'Hetu'}</FormTextTitle>
            <FormText>{applicant.person_hetu || '-'}</FormText>
          </Column>
          <Column small={6} medium={4} large={2}>
            <FormTextTitle>{'Sähköposti'}</FormTextTitle>
            <FormText>{applicant.person_email || '-'}</FormText>
          </Column>
          <Column small={6} medium={4} large={2}>
            <FormTextTitle>{'Puhelinnumero'}</FormTextTitle>
            <FormText>{applicant.person_phonenumber || '-'}</FormText>
          </Column>
        </Row>
        <Row>
          <Column small={6} medium={4} large={2}>
            <FormTextTitle>{'Katuosoite'}</FormTextTitle>
            <FormText>{applicant.person_address || '-'}</FormText>
          </Column>
          <Column small={6} medium={4} large={2}>
            <FormTextTitle>{'Postinumero'}</FormTextTitle>
            <FormText>{applicant.person_postalcode || '-'}</FormText>
          </Column>
          <Column small={6} medium={4} large={2}>
            <FormTextTitle>{'Kaupunki'}</FormTextTitle>
            <FormText>{applicant.person_city || '-'}</FormText>
          </Column>
        </Row>
        <SubTitle>
          {'Pöytäkirjaotteiden lähetysosoite (jos eri kuin edellä)'}
        </SubTitle>
        <Row>
          <Column small={6} medium={4} large={2}>
            <FormTextTitle>{'Katuosoite'}</FormTextTitle>
            <FormText>{applicant.transcript_address || '-'}</FormText>
          </Column>
          <Column small={6} medium={4} large={2}>
            <FormTextTitle>{'Postinumero'}</FormTextTitle>
            <FormText>{applicant.transcript_postalcode || '-'}</FormText>
          </Column>
          <Column small={6} medium={4} large={2}>
            <FormTextTitle>{'Kaupunki'}</FormTextTitle>
            <FormText>{applicant.transcript_city || '-'}</FormText>
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
