// @flow
import React, {Fragment} from 'react';
import {connect} from 'react-redux';
import {formValueSelector} from 'redux-form';
import {Row, Column} from 'react-foundation';
import {reduxForm} from 'redux-form';


import Authorization from '$components/authorization/Authorization';
import FormField from '$components/form/FormField';
import RemoveButton from '$components/form/RemoveButton';
import {FormNames} from '$src/enums';

// import {UsersPermissions} from '$src/usersPermissions/enums';
// import {formatNumber, hasPermissions, isFieldAllowedToRead, getFieldAttributes} from '$util/helpers';
import {getUsersPermissions} from '$src/usersPermissions/selectors';
import SubTitle from '$components/content/SubTitle';

// import type {Attributes} from '$src/types';
import type {UsersPermissions as UsersPermissionsType} from '$src/usersPermissions/types';

type Props = {
  disabled: boolean,
  field: any,
  formName: string,
  isSaveClicked: boolean,
  // leaseAttributes: Attributes,
  onRemove: Function,
  usersPermissions: UsersPermissionsType,
}

const ApplicantEdit = ({
  disabled,
  field,
  //  isSaveClicked,
  //  leaseAttributes,
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
            disableTouched={false} // isSaveClicked} // TODO
            fieldAttributes={{
              label: 'Asiakastyyppi',
              read_only: false,
              required: false,
              type: 'radio-with-field',
            }} // TODO
            name={`${field}.client_type`}
            overrideValues={{
              label: 'Asiakastyyppi',
              options: [{value: '1', label: 'Yritys'}, {value: '2', label: 'Henkilö'}],
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
            disableTouched={false} // isSaveClicked} // TODO
            fieldAttributes={{
              label: 'Organisaatio',
              read_only: false,
              required: false,
              type: 'string',
            }} // TODO
            name={`${field}.company_organization`}
            overrideValues={{
              label: 'Organisaatio',
            }}
          />
        </Column>
        <Column small={6} medium={4} large={2}>
          <FormField
            className={'application__input'}
            disableTouched={false} // isSaveClicked} // TODO
            fieldAttributes={{
              label: 'Y-tunnus',
              read_only: false,
              required: false,
              type: 'string',
            }} // TODO
            name={`${field}.company_y_identifier`}
            overrideValues={{
              label: 'Y-tunnus',
            }}
          />
        </Column>
        <Column small={6} medium={4} large={2}>
          <FormField
            className={'application__input'}
            disableTouched={false} // isSaveClicked} // TODO
            fieldAttributes={{
              label: 'Hakijayrityksen perustmisvuosi',
              read_only: false,
              required: false,
              type: 'string',
            }} // TODO
            name={`${field}.company_founding_year`}
            overrideValues={{
              label: 'Hakijayrityksen perustmisvuosi',
            }}
          />
        </Column>
        <Column small={6} medium={4} large={2}>
          <FormField
            className={'application__input'}
            disableTouched={false} // isSaveClicked} // TODO
            fieldAttributes={{
              label: 'Liikevaihto (edellinen vuosi)',
              read_only: false,
              required: false,
              type: 'string',
            }} // TODO
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
            disableTouched={false} // isSaveClicked} // TODO
            fieldAttributes={{
              label: 'Katuosoite',
              read_only: false,
              required: false,
              type: 'string',
            }} // TODO
            name={`${field}.company_address`}
            overrideValues={{
              label: 'Katuosoite',
            }}
          />
        </Column>
        <Column small={6} medium={4} large={2}>
          <FormField
            className={'application__input'}
            disableTouched={false} // isSaveClicked} // TODO
            fieldAttributes={{
              label: 'Postinumero',
              read_only: false,
              required: false,
              type: 'string',
            }} // TODO
            name={`${field}.company_postal_code`}
            overrideValues={{
              label: 'Postinumero',
            }}
          />
        </Column>
        <Column small={6} medium={4} large={2}>
          <FormField
            className={'application__input'}
            disableTouched={false} // isSaveClicked} // TODO
            fieldAttributes={{
              label: 'Kaupunki',
              read_only: false,
              required: false,
              type: 'string',
            }} // TODO
            name={`${field}.company_city`}
            overrideValues={{
              label: 'Kaupunki',
            }}
          />
        </Column>
        <Column small={6} medium={4} large={2}>
          <FormField
            className={'application__input'}
            disableTouched={false} // isSaveClicked} // TODO
            fieldAttributes={{
              label: 'Sähköposti',
              read_only: false,
              required: false,
              type: 'string',
            }} // TODO
            name={`${field}.company_email`}
            overrideValues={{
              label: 'Sähköposti',
            }}
          />
        </Column>
        <Column small={6} medium={4} large={2}>
          <FormField
            className={'application__input'}
            disableTouched={false} // isSaveClicked} // TODO
            fieldAttributes={{
              label: 'Puhelinnumero',
              read_only: false,
              required: false,
              type: 'string',
            }} // TODO
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
            disableTouched={false} // isSaveClicked} // TODO
            fieldAttributes={{
              label: 'Nimi',
              read_only: false,
              required: false,
              type: 'string',
            }} // TODO
            name={`${field}.contact_name`}
            overrideValues={{
              label: 'Nimi',
            }}
          />
        </Column>
        <Column small={6} medium={4} large={2}>
          <FormField
            className={'application__input'}
            disableTouched={false} // isSaveClicked} // TODO
            fieldAttributes={{
              label: 'Katuosoite',
              read_only: false,
              required: false,
              type: 'string',
            }} // TODO
            name={`${field}.contact_address`}
            overrideValues={{
              label: 'Katuosoite',
            }}
          />
        </Column>
        <Column small={6} medium={4} large={2}>
          <FormField
            className={'application__input'}
            disableTouched={false} // isSaveClicked} // TODO
            fieldAttributes={{
              label: 'Postinumero',
              read_only: false,
              required: false,
              type: 'string',
            }} // TODO
            name={`${field}.contact_postalcode`}
            overrideValues={{
              label: 'Postinumero',
            }}
          />
        </Column>
        <Column small={6} medium={4} large={2}>
          <FormField
            className={'application__input'}
            disableTouched={false} // isSaveClicked} // TODO
            fieldAttributes={{
              label: 'Kaupunki',
              read_only: false,
              required: false,
              type: 'string',
            }} // TODO
            name={`${field}.contact_city`}
            overrideValues={{
              label: 'Kaupunki',
            }}
          />
        </Column>
        <Column small={6} medium={4} large={2}>
          <FormField
            className={'application__input'}
            disableTouched={false} // isSaveClicked} // TODO
            fieldAttributes={{
              label: 'Puhelinnumero',
              read_only: false,
              required: false,
              type: 'string',
            }} // TODO
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
            disableTouched={false} // isSaveClicked} // TODO
            fieldAttributes={{
              label: 'Nimi',
              read_only: false,
              required: false,
              type: 'string',
            }} // TODO
            name={`${field}.person_name`}
            overrideValues={{
              label: 'Nimi',
            }}
          />
        </Column>
        <Column small={6} medium={4} large={2}>
          <FormField
            className={'application__input'}
            disableTouched={false} // isSaveClicked} // TODO
            fieldAttributes={{
              label: 'Hetu',
              read_only: false,
              required: false,
              type: 'string',
            }} // TODO
            name={`${field}.person_hetu`}
            overrideValues={{
              label: 'Hetu',
            }}
          />
        </Column>
        <Column small={6} medium={4} large={2}>
          <FormField
            className={'application__input'}
            disableTouched={false} // isSaveClicked} // TODO
            fieldAttributes={{
              label: 'Sähköposti',
              read_only: false,
              required: false,
              type: 'string',
            }} // TODO
            name={`${field}.person_email`}
            overrideValues={{
              label: 'Sähköposti',
            }}
          />
        </Column>
        <Column small={6} medium={4} large={2}>
          <FormField
            className={'application__input'}
            disableTouched={false} // isSaveClicked} // TODO
            fieldAttributes={{
              label: 'Puhelinnumero',
              read_only: false,
              required: false,
              type: 'string',
            }} // TODO
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
            disableTouched={false} // isSaveClicked} // TODO
            fieldAttributes={{
              label: 'Puhelinnumero',
              read_only: false,
              required: false,
              type: 'string',
            }} // TODO
            name={`${field}.person_phonenumber`}
            overrideValues={{
              label: 'Puhelinnumero',
            }}
          />
        </Column>
        <Column small={6} medium={4} large={2}>
          <FormField
            className={'application__input'}
            disableTouched={false} // isSaveClicked} // TODO
            fieldAttributes={{
              label: 'Katuosoite',
              read_only: false,
              required: false,
              type: 'string',
            }} // TODO
            name={`${field}.person_address`}
            overrideValues={{
              label: 'Katuosoite',
            }}
          />
        </Column>
        <Column small={6} medium={4} large={2}>
          <FormField
            className={'application__input'}
            disableTouched={false} // isSaveClicked} // TODO
            fieldAttributes={{
              label: 'Postinumero',
              read_only: false,
              required: false,
              type: 'string',
            }} // TODO
            name={`${field}.person_postalcode`}
            overrideValues={{
              label: 'Postinumero',
            }}
          />
        </Column>
        <Column small={6} medium={4} large={2}>
          <FormField
            className={'application__input'}
            disableTouched={false} // isSaveClicked} // TODO
            fieldAttributes={{
              label: 'Kaupunki',
              read_only: false,
              required: false,
              type: 'string',
            }} // TODO
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
            disableTouched={false} // isSaveClicked} // TODO
            fieldAttributes={{
              label: 'Katuosoite',
              read_only: false,
              required: false,
              type: 'string',
            }} // TODO
            name={`${field}.transcript_address`}
            overrideValues={{
              label: 'Katuosoite',
            }}
          />
        </Column>
        <Column small={6} medium={4} large={2}>
          <FormField
            className={'application__input'}
            disableTouched={false} // isSaveClicked} // TODO
            fieldAttributes={{
              label: 'Postinumero',
              read_only: false,
              required: false,
              type: 'string',
            }} // TODO
            name={`${field}.transcript_postalcode`}
            overrideValues={{
              label: 'Postinumero',
            }}
          />
        </Column>
        <Column small={6} medium={4} large={2}>
          <FormField
            className={'application__input'}
            disableTouched={false} // isSaveClicked} // TODO
            fieldAttributes={{
              label: 'Kaupunki',
              read_only: false,
              required: false,
              type: 'string',
            }} // TODO
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
    /*  attributes: getAttributes(state),
      currentLandUseContract: getCurrentLandUseContract(state),
      errors: getErrorsByFormName(state, formName),
      isSaveClicked: getIsSaveClicked(state), */
    };
  },
  reduxForm({
    form: formName,
    destroyOnUnmount: false,
  }),
)(ApplicantEdit);
