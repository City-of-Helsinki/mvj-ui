// @flow
import React, {Fragment} from 'react';
import {connect} from 'react-redux';
import {formValueSelector} from 'redux-form';
import {Row, Column} from 'react-foundation';
import {reduxForm} from 'redux-form';
import get from 'lodash/get';

import Authorization from '$components/authorization/Authorization';
import FormField from '$components/form/FormField';
import RemoveButton from '$components/form/RemoveButton';
import {FormNames} from '$src/enums';
import {
  getAttributes,
  getIsSaveClicked,
} from '$src/property/selectors';

// import {UsersPermissions} from '$src/usersPermissions/enums';
// import {formatNumber, hasPermissions, isFieldAllowedToRead, getFieldAttributes} from '$util/helpers';
import {getUsersPermissions} from '$src/usersPermissions/selectors';
import SubTitle from '$components/content/SubTitle';

import type {Attributes} from '$src/types';
import type {UsersPermissions as UsersPermissionsType} from '$src/usersPermissions/types';

type Props = {
  disabled: boolean,
  field: any,
  formName: string,
  isSaveClicked: boolean,
  attributes: Attributes,
  onRemove: Function,
  usersPermissions: UsersPermissionsType,
}

const ApplicantEdit = ({
  disabled,
  field,
  isSaveClicked,
  attributes,
  onRemove,
  //  usersPermissions,
}: Props) => {
  return (
    <Fragment>
      <Row>
        <Column large={11} style={{marginTop: 15}}>
          <SubTitle>
            {'HAKIJAN TIEDOT'}
          </SubTitle>
        </Column>
        <Column large={1}>
          <Authorization allow={true}>
            {!disabled &&
              <RemoveButton
                className='third-level'
                onClick={onRemove}
                style={{height: 'unset'}}
                title='Poista Hakija'
              />
            }
          </Authorization>
        </Column>
      </Row>
      <Row>
        <Column large={3}>
          <FormField
            disableTouched={isSaveClicked}
            fieldAttributes={get(attributes, 'application_base.child.children.applicants.child.children.client_type')} // TODO: remove empty bullet
            name={`${field}.client_type`}
            overrideValues={{
              label: 'Asiakastyyppi',
            }}
          />
        </Column>
      </Row>
      <SubTitle>
        {'Yrityksen tiedot'}
      </SubTitle>
      <Row>
        <Column small={6} medium={4} large={2}>
          <FormField
            className={'application__input'}
            disableTouched={isSaveClicked}
            fieldAttributes={get(attributes, 'application_base.child.children.applicants.child.children.company_organization')}
            name={`${field}.company_organization`}
            overrideValues={{
              label: 'Organisaatio',
            }}
          />
        </Column>
        <Column small={6} medium={4} large={2}>
          <FormField
            className={'application__input'}
            disableTouched={isSaveClicked}
            fieldAttributes={get(attributes, 'application_base.child.children.applicants.child.children.company_y_identifier')}
            name={`${field}.company_y_identifier`}
            overrideValues={{
              label: 'Y-tunnus',
            }}
          />
        </Column>
        <Column small={6} medium={4} large={2}>
          <FormField
            className={'application__input'}
            disableTouched={isSaveClicked}
            fieldAttributes={get(attributes, 'application_base.child.children.applicants.child.children.company_founding_year')}
            name={`${field}.company_founding_year`}
            overrideValues={{
              label: 'Hakijayrityksen perustmisvuosi',
            }}
          />
        </Column>
        <Column small={6} medium={4} large={2}>
          <FormField
            className={'application__input'}
            disableTouched={isSaveClicked}
            fieldAttributes={get(attributes, 'application_base.child.children.applicants.child.children.company_revenue')}
            name={`${field}.company_revenue`}
            overrideValues={{
              label: 'Liikevaihto (edellinen vuosi)',
            }}
          />
        </Column>
      </Row>
      <Row>
        <Column small={6} medium={4} large={2}>
          <FormField
            className={'application__input'}
            disableTouched={isSaveClicked}
            fieldAttributes={get(attributes, 'application_base.child.children.applicants.child.children.company_address')}
            name={`${field}.company_address`}
            overrideValues={{
              label: 'Katuosoite',
            }}
          />
        </Column>
        <Column small={6} medium={4} large={2}>
          <FormField
            className={'application__input'}
            disableTouched={isSaveClicked}
            fieldAttributes={get(attributes, 'application_base.child.children.applicants.child.children.company_postal_code')}
            name={`${field}.company_postal_code`}
            overrideValues={{
              label: 'Postinumero',
            }}
          />
        </Column>
        <Column small={6} medium={4} large={2}>
          <FormField
            className={'application__input'}
            disableTouched={isSaveClicked}
            fieldAttributes={get(attributes, 'application_base.child.children.applicants.child.children.company_city')}
            name={`${field}.company_city`}
            overrideValues={{
              label: 'Kaupunki',
            }}
          />
        </Column>
        <Column small={6} medium={4} large={2}>
          <FormField
            className={'application__input'}
            disableTouched={isSaveClicked}
            fieldAttributes={get(attributes, 'application_base.child.children.applicants.child.children.company_email')}
            name={`${field}.company_email`}
            overrideValues={{
              label: 'Sähköposti',
            }}
          />
        </Column>
        <Column small={6} medium={4} large={2}>
          <FormField
            className={'application__input'}
            disableTouched={isSaveClicked}
            fieldAttributes={get(attributes, 'application_base.child.children.applicants.child.children.company_phonenumber')}
            name={`${field}.company_phonenumber`}
            overrideValues={{
              label: 'Puhelinnumero',
            }}
          />
        </Column>
      </Row>
      <SubTitle>
        {'Yhteyshenkilö'}
      </SubTitle>
      <Row>
        <Column small={6} medium={4} large={2}>
          <FormField
            className={'application__input'}
            disableTouched={isSaveClicked}
            fieldAttributes={get(attributes, 'application_base.child.children.applicants.child.children.contact_name')}
            name={`${field}.contact_name`}
            overrideValues={{
              label: 'Nimi',
            }}
          />
        </Column>
        <Column small={6} medium={4} large={2}>
          <FormField
            className={'application__input'}
            disableTouched={isSaveClicked}
            fieldAttributes={get(attributes, 'application_base.child.children.applicants.child.children.contact_address')}
            name={`${field}.contact_address`}
            overrideValues={{
              label: 'Katuosoite',
            }}
          />
        </Column>
        <Column small={6} medium={4} large={2}>
          <FormField
            className={'application__input'}
            disableTouched={isSaveClicked}
            fieldAttributes={get(attributes, 'application_base.child.children.applicants.child.children.contact_postalcode')}
            name={`${field}.contact_postalcode`}
            overrideValues={{
              label: 'Postinumero',
            }}
          />
        </Column>
        <Column small={6} medium={4} large={2}>
          <FormField
            className={'application__input'}
            disableTouched={isSaveClicked}
            fieldAttributes={get(attributes, 'application_base.child.children.applicants.child.children.contact_city')}
            name={`${field}.contact_city`}
            overrideValues={{
              label: 'Kaupunki',
            }}
          />
        </Column>
        <Column small={6} medium={4} large={2}>
          <FormField
            className={'application__input'}
            disableTouched={isSaveClicked}
            fieldAttributes={get(attributes, 'application_base.child.children.applicants.child.children.contact_phonenumber')}
            name={`${field}.contact_phonenumber`}
            overrideValues={{
              label: 'Puhelinnumero',
            }}
          />
        </Column>
      </Row>
      <SubTitle>
        {'Henkilön tiedot'}
      </SubTitle>
      <Row>
        <Column small={6} medium={4} large={2}>
          <FormField
            className={'application__input'}
            disableTouched={isSaveClicked}
            fieldAttributes={get(attributes, 'application_base.child.children.applicants.child.children.person_name')}
            name={`${field}.person_name`}
            overrideValues={{
              label: 'Nimi',
            }}
          />
        </Column>
        <Column small={6} medium={4} large={2}>
          <FormField
            className={'application__input'}
            disableTouched={isSaveClicked}
            fieldAttributes={get(attributes, 'application_base.child.children.applicants.child.children.person_hetu')}
            name={`${field}.person_hetu`}
            overrideValues={{
              label: 'Hetu',
            }}
          />
        </Column>
        <Column small={6} medium={4} large={2}>
          <FormField
            className={'application__input'}
            disableTouched={isSaveClicked}
            fieldAttributes={get(attributes, 'application_base.child.children.applicants.child.children.person_email')}
            name={`${field}.person_email`}
            overrideValues={{
              label: 'Sähköposti',
            }}
          />
        </Column>
        <Column small={6} medium={4} large={2}>
          <FormField
            className={'application__input'}
            disableTouched={isSaveClicked}
            fieldAttributes={get(attributes, 'application_base.child.children.applicants.child.children.person_phonenumber')}
            name={`${field}.person_phonenumber`}
            overrideValues={{
              label: 'Puhelinnumero',
            }}
          />
        </Column>
      </Row>
      <Row>
        <Column small={6} medium={4} large={2}>
          <FormField
            className={'application__input'}
            disableTouched={isSaveClicked}
            fieldAttributes={get(attributes, 'application_base.child.children.applicants.child.children.person_address')}
            name={`${field}.person_address`}
            overrideValues={{
              label: 'Katuosoite',
            }}
          />
        </Column>
        <Column small={6} medium={4} large={2}>
          <FormField
            className={'application__input'}
            disableTouched={isSaveClicked}
            fieldAttributes={get(attributes, 'application_base.child.children.applicants.child.children.person_postalcode')}
            name={`${field}.person_postalcode`}
            overrideValues={{
              label: 'Postinumero',
            }}
          />
        </Column>
        <Column small={6} medium={4} large={2}>
          <FormField
            className={'application__input'}
            disableTouched={isSaveClicked}
            fieldAttributes={get(attributes, 'application_base.child.children.applicants.child.children.person_city')}
            name={`${field}.person_city`}
            overrideValues={{
              label: 'Kaupunki',
            }}
          />
        </Column>
      </Row>
      <SubTitle>
        {'Pöytäkirjaotteiden lähetysosoite (jos eri kuin edellä)'}
      </SubTitle>
      <Row>
        <Column small={6} medium={4} large={2}>
          <FormField
            className={'application__input'}
            disableTouched={isSaveClicked}
            fieldAttributes={get(attributes, 'application_base.child.children.applicants.child.children.transcript_address')}
            name={`${field}.transcript_address`}
            overrideValues={{
              label: 'Katuosoite',
            }}
          />
        </Column>
        <Column small={6} medium={4} large={2}>
          <FormField
            className={'application__input'}
            disableTouched={isSaveClicked}
            fieldAttributes={get(attributes, 'application_base.child.children.applicants.child.children.transcript_postalcode')}
            name={`${field}.transcript_postalcode`}
            overrideValues={{
              label: 'Postinumero',
            }}
          />
        </Column>
        <Column small={6} medium={4} large={2}>
          <FormField
            className={'application__input'}
            disableTouched={isSaveClicked}
            fieldAttributes={get(attributes, 'application_base.child.children.applicants.child.children.transcript_city')}
            name={`${field}.transcript_city`}
            overrideValues={{
              label: 'Kaupunki',
            }}
          />
        </Column>
      </Row>
    </Fragment>
  );
};

const formName = FormNames.PROPERTY_APPLICATION;

export default connect(
  (state, props: Props) => {
    const formName = props.formName;
    const selector = formValueSelector(formName);

    return {
      name: selector(state, `${props.field}.name`),
      usersPermissions: getUsersPermissions(state),
      attributes: getAttributes(state),
      // errors: getErrorsByFormName(state, formName), // TODO TODO:
      isSaveClicked: getIsSaveClicked(state),
    };
  },
  reduxForm({
    form: formName,
    destroyOnUnmount: false,
  }),
)(ApplicantEdit);
