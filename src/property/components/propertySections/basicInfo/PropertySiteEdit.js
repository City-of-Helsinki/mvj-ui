// @flow
import React from 'react';
import {connect} from 'react-redux';
import {formValueSelector} from 'redux-form';
import {Row, Column} from 'react-foundation';

import Collapse from '$components/collapse/Collapse';
import Authorization from '$components/authorization/Authorization';
import FormField from '$components/form/FormField';
import RemoveButton from '$components/form/RemoveButton';
import {PropertyFieldTitles} from '$src/property/enums';
import FormText from '$components/form/FormText';
import FormTextTitle from '$components/form/FormTextTitle';
import ExternalLink from '$components/links/ExternalLink';
// import {UsersPermissions} from '$src/usersPermissions/enums';
// import {formatNumber, hasPermissions, isFieldAllowedToRead, getFieldAttributes} from '$util/helpers';
import {getUsersPermissions} from '$src/usersPermissions/selectors';

// import type {Attributes} from '$src/types';
import type {UsersPermissions as UsersPermissionsType} from '$src/usersPermissions/types';

type Props = {
  currentAmountPerArea: number,
  disabled: boolean,
  field: any,
  formName: string,
  initialYearRent: number,
  isSaveClicked: boolean,
  // leaseAttributes: Attributes,
  onRemove: Function,
  usersPermissions: UsersPermissionsType,
}

const PropertySiteEdit = ({
  disabled,
  field,
  //  isSaveClicked,
  //  leaseAttributes,
  onRemove,
  //  usersPermissions,
}: Props) => {

  return (
    <Collapse
      className='collapse__secondary greenCollapse'
      defaultOpen={true}
      headerTitle={'10658/1'}
    >
      <Row>
        <Column small={6} medium={4} large={2}>
          <FormTextTitle uiDataKey={''}>{/* required={false} enableUiDataEdit */}
            {'Kohteen tunnus'}
          </FormTextTitle>
          <FormText>
            <ExternalLink
              className='no-margin'
              href={`/`}
              text={'10658/1'}
            />
          </FormText>
        </Column>
        <Column small={3} medium={2} large={1}>
          <FormTextTitle uiDataKey={''}>
            {'Vuokraustunnus'}
          </FormTextTitle>
          <FormText>
            <ExternalLink
              className='no-margin'
              href={`/`}
              text={'TY1234-5'}
            />
          </FormText>
        </Column>
        <Column small={3} medium={2} large={1}>
          <FormTextTitle uiDataKey={''}>
            {'Hitas'}
          </FormTextTitle>
          <FormText>{'Hitas 1'}</FormText>
        </Column>
        <Column small={6} medium={4} large={2}>
          <FormTextTitle uiDataKey={''}>
            {'Osoite'}
          </FormTextTitle>
          <FormText>{'Verkkosaarenranta'}</FormText>
        </Column>
        <Column small={6} medium={4} large={2}>
          <FormField
            disableTouched={false} // isSaveClicked} // TODO
            fieldAttributes={{
              label: 'Kaavayksikön vaihe',
              read_only: false,
              required: false,
              type: 'string',
            }} // TODO
            name={`${field}.type`}
            overrideValues={{
              fieldType: 'choice',
              label: 'Kaavayksikön vaihe',
              options: [{value: 1, label: 'Suunniteltu'}],
            }}
            enableUiDataEdit
          />
        </Column>
        <Column small={6} medium={4} large={2}>
          <FormTextTitle uiDataKey={''}>
            {'Asemakaavan ja käsittelyvaihe'}
          </FormTextTitle>
          <FormText>
            <ExternalLink
              className='no-margin'
              href={`/`}
              text={'12375'}
            />
          </FormText>
        </Column>
        <Column small={6} medium={4} large={2}>
          <FormTextTitle uiDataKey={''}>
            {'Hakemukset'}
          </FormTextTitle>
          <FormText>
            <ExternalLink
              className='no-margin'
              href={`/`}
              text={'Hakemukset (25)'}
            />
          </FormText>
        </Column>
        <Column small={6} medium={4} large={2}>
          <FormTextTitle uiDataKey={''}>
            {'Käyttötarkoitus'}
          </FormTextTitle>
          <FormText>{'AK'}</FormText>
        </Column>
        <Column small={3} medium={2} large={1}>
          <FormTextTitle uiDataKey={''}>
            {'Rak. oikeus'}
          </FormTextTitle>
          <FormText>{'3500 k-m2'}</FormText>
        </Column>
        <Column small={3} medium={2} large={1}>
          <FormTextTitle uiDataKey={''}>
            {'Rak. oikeus'}
          </FormTextTitle>
          <FormText>{'12/2022'}</FormText>
        </Column>
        <Column small={6} medium={4} large={2}>
          <FormTextTitle uiDataKey={''}>
            {'Rahoitusmuoto'}
          </FormTextTitle>
          <FormText>{'Vapaarahoitteinen'}</FormText>
        </Column>
        <Column small={6} medium={4} large={2}>
          <FormTextTitle uiDataKey={''}>
            {'Hallintamuoto'}
          </FormTextTitle>
          <FormText>{'Omistus'}</FormText>
        </Column>
        <Column small={6} medium={4} large={2}>
          <FormTextTitle uiDataKey={''}>
            {'Ehdotettu varauksensaaja'}
          </FormTextTitle>
          <FormText>{'Oy Firma Ab'}</FormText>
          <FormText>{'As. Oy Asuntosunto'}</FormText>
          <FormText>{'Puuha Pete'}</FormText>
        </Column>
        <Column small={3} medium={2} large={1}>
          <FormTextTitle uiDataKey={''}>
            {'Osuus'}
          </FormTextTitle>
          <FormText>{'1/1'}</FormText>
          <FormText>{'1/1'}</FormText>
          <FormText>{'1/1'}</FormText>
        </Column>
        <Column large={1}>
          <Authorization allow={true}>
            {!disabled &&
              <RemoveButton
                className='third-level'
                onClick={onRemove}
                style={{height: 'unset'}}
                title='Poista päätös'
              />
            }
          </Authorization>
        </Column>
      </Row>
    </Collapse>
  );
};

export default connect(
  (state, props: Props) => {
    const formName = props.formName;
    const selector = formValueSelector(formName);

    return {
      // isSaveClicked: getIsSaveClicked(state),
      // leaseAttributes: getLeaseAttributes(state),
      type: selector(state, `${props.field}.type`),
      decisionToList: selector(state, `${props.field}.decision_to_list`),
      usersPermissions: getUsersPermissions(state),
    };
  },
)(PropertySiteEdit);
