// @flow
import React, {Fragment} from 'react';
import {connect} from 'react-redux';
import {formValueSelector} from 'redux-form';
import {Row, Column} from 'react-foundation';

import Authorization from '$components/authorization/Authorization';
import FormField from '$components/form/FormField';
import RemoveButton from '$components/form/RemoveButton';
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
              label: 'Hakutyyppi',
              read_only: false,
              required: false,
              type: 'string',
            }} // TODO
            name={`${field}.client_type`}
            overrideValues={{
              fieldType: 'radio-with-field',
              label: 'Asiakastyyppi',
              options: [{value: '1', label: 'Yritys'}, {value: '2', label: 'Henkilö'}],
            }}
            enableUiDataEdit
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
            name={`${field}.comppany_organization`}
            overrideValues={{
              label: 'Organisaatio',
            }}
            enableUiDataEdit
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
            name={`${field}.comppany_y-value`}
            overrideValues={{
              label: 'Y-tunnus',
            }}
            enableUiDataEdit
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
            name={`${field}.comppany_founding_year`}
            overrideValues={{
              label: 'Hakijayrityksen perustmisvuosi',
            }}
            enableUiDataEdit
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
            name={`${field}.comppany_revenue_last_year`}
            overrideValues={{
              label: 'Liikevaihto (edellinen vuosi)',
            }}
            enableUiDataEdit
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
            name={`${field}.comppany_address`}
            overrideValues={{
              label: 'Katuosoite',
            }}
            enableUiDataEdit
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
            name={`${field}.comppany_postal_code`}
            overrideValues={{
              label: 'Postinumero',
            }}
            enableUiDataEdit
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
            name={`${field}.comppany_city`}
            overrideValues={{
              label: 'Kaupunki',
            }}
            enableUiDataEdit
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
            name={`${field}.comppany_email`}
            overrideValues={{
              label: 'Sähköposti',
            }}
            enableUiDataEdit
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
            name={`${field}.comppany_phonenumber`}
            overrideValues={{
              label: 'Puhelinnumero',
            }}
            enableUiDataEdit
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
            name={`${field}.contact_phonenumber`}
            overrideValues={{
              label: 'Nimi',
            }}
            enableUiDataEdit
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
            name={`${field}.contact_street_address`}
            overrideValues={{
              label: 'Katuosoite',
            }}
            enableUiDataEdit
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
            enableUiDataEdit
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
            enableUiDataEdit
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
            enableUiDataEdit
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
            enableUiDataEdit
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
            name={`${field}.person_social_security_number`}
            overrideValues={{
              label: 'Hetu',
            }}
            enableUiDataEdit
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
            enableUiDataEdit
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
            enableUiDataEdit
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
            name={`${field}.contact_phonenumber`}
            overrideValues={{
              label: 'Puhelinnumero',
            }}
            enableUiDataEdit
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
            enableUiDataEdit
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
            enableUiDataEdit
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
            name={`${field}.transcript_phonenumber`}
            overrideValues={{
              label: 'Katuosoite',
            }}
            enableUiDataEdit
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
            name={`${field}.transcript_phonenumber`}
            overrideValues={{
              label: 'Postinumero',
            }}
            enableUiDataEdit
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
            name={`${field}.transcript_phonenumber`}
            overrideValues={{
              label: 'Kaupunki',
            }}
            enableUiDataEdit
          />
        </Column>
      </Row>
    </Fragment>
  );
};

export default connect(
  (state, props: Props) => {
    const formName = props.formName;
    const selector = formValueSelector(formName);

    return {
      // isSaveClicked: getIsSaveClicked(state),
      // leaseAttributes: getLeaseAttributes(state),
      name: selector(state, `${props.field}.name`),
      usersPermissions: getUsersPermissions(state),
    };
  },
)(ApplicantEdit);
