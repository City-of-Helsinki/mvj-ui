// @flow
import React, {Fragment} from 'react';
import {connect} from 'react-redux';
import {formValueSelector} from 'redux-form';
import {Row, Column} from 'react-foundation';
import get from 'lodash/get';

import Authorization from '$components/authorization/Authorization';
import FormField from '$components/form/FormField';
import FormText from '$components/form/FormText';
import RemoveButton from '$components/form/RemoveButton';
// import {UsersPermissions} from '$src/usersPermissions/enums';
// import {formatNumber, hasPermissions, isFieldAllowedToRead, getFieldAttributes} from '$util/helpers';
import {
  getAttributes,
  getIsSaveClicked,
} from '$src/property/selectors';

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

const TargetEdit = ({
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
            {'HAETTAVA KOHDE'}
          </SubTitle>
        </Column>
        <Column large={1}>
          <Authorization allow={true}>
            {!disabled &&
              <RemoveButton
                className='third-level'
                onClick={onRemove}
                style={{height: 'unset'}}
                title='Poista kohde'
              />
            }
          </Authorization>
        </Column>
      </Row>
      <Row>
        {/* 
        Onko aiemmin saanut tonttia kaupungin haussa?
        Ei
        Kyllä, vuonna
        Lisää vuosi
        */}
      </Row>
      <Row>
        <Column large={3}>
          <FormField
            className={'application__input'}
            disableTouched={isSaveClicked}
            fieldAttributes={get(attributes, 'application_base.child.children.target.child.children.target_property')}
            name={`${field}.target_property`}
            overrideValues={{
              label: 'Tontti, jota hakemus koskee',
            }}
            enableUiDataEdit
          />
        </Column>
        <Column large={1}>
          <FormField
            className={'application__input'}
            disableTouched={isSaveClicked}
            fieldAttributes={get(attributes, 'application_base.child.children.target.child.children.percentage')}
            name={`${field}.percentage`}
            overrideValues={{
              label: '%-perusteinen',
            }}
            enableUiDataEdit
          />
        </Column>
        <FormText style={{marginTop: 15}}>€/k-m2</FormText>
      </Row>
      <Row>
        <Column large={4} small={12}>
          <FormField
            className={'application__input'}
            disableTouched={isSaveClicked}
            fieldAttributes={get(attributes, 'application_base.child.children.target.child.children.head_planner')}
            name={`${field}.head_planner`}
            overrideValues={{
              label: 'Hankkeen pääsuunnittelija',
            }}
            enableUiDataEdit
          />
        </Column>
        <Column large={4} small={12}>
          <FormField
            className={'application__input'}
            disableTouched={isSaveClicked}
            fieldAttributes={get(attributes, 'application_base.child.children.target.child.children.estimated_schedule')}
            name={`${field}.estimated_schedule`}
            overrideValues={{
              label: 'Hannkeen arvioitu aikataulu',
            }}
            enableUiDataEdit
          />
        </Column>
        <Column large={4} small={12}>
          <FormField
            className={'application__input'}
            disableTouched={isSaveClicked}
            fieldAttributes={get(attributes, 'application_base.child.children.target.child.children.desired_size')}
            name={`${field}.desired_size`}
            overrideValues={{
              label: 'Hankkeen toivottu laajuus (rakennusoikeus ja asuntojen lkm)',
            }}
            enableUiDataEdit
          />
        </Column>
      </Row>
      <Row>
        <Column large={4} small={12}>
          <FormField
            className={'application__input'}
            disableTouched={isSaveClicked}
            fieldAttributes={get(attributes, 'application_base.child.children.target.child.children.funding')}
            name={`${field}.funding`}
            overrideValues={{
              fieldType: 'checkbox',
              label: 'Rahoitus- ja hallintamuoto',
            }}
            enableUiDataEdit
          />
        </Column>
        <Column large={4} small={12}>
          <FormField
            className={'application__input'}
            disableTouched={isSaveClicked}
            fieldAttributes={get(attributes, 'application_base.child.children.target.child.children.special')}
            name={`${field}.special`}
            overrideValues={{
              fieldType: 'checkbox',
              label: 'Erityisryhmät',
            }}
            enableUiDataEdit
          />
        </Column>
        <Column large={4} small={12}>
          <FormField
            className={'application__input'}
            disableTouched={isSaveClicked}
            fieldAttributes={get(attributes, 'application_base.child.children.target.child.children.other')}
            name={`${field}.other`}
            overrideValues={{
              fieldType: 'checkbox',
              label: 'Muut hankkeen mahdolliset kehitysteemat',
            }}
            enableUiDataEdit
          />
        </Column>
      </Row>
      <Row>
        <Column large={12}>
          <FormField
            className={'application__input'}
            disableTouched={isSaveClicked}
            fieldAttributes={get(attributes, 'application_base.child.children.target.child.children.overal_picture')}
            name={`${field}.overal_picture`}
            overrideValues={{
              fieldType: 'textarea',
              label: 'Hankkeen yleiskuvaus',
            }}
            enableUiDataEdit
          />
        </Column>
        <Column large={12}>
          <FormField
            className={'application__input'}
            disableTouched={isSaveClicked}
            fieldAttributes={get(attributes, 'application_base.child.children.target.child.children.peculiarities')}
            name={`${field}.peculiarities`}
            overrideValues={{
              fieldType: 'textarea',
              label: 'Hankkeen mahdolliset eristyispiirteet ja mahdolliset kehittämisteemat',
            }}
            enableUiDataEdit
          />
        </Column>
        <Column large={12}>
          <FormField
            className={'application__input'}
            disableTouched={isSaveClicked}
            fieldAttributes={get(attributes, 'application_base.child.children.target.child.children.descriptions')}
            name={`${field}.descriptions`}
            overrideValues={{
              fieldType: 'textarea',
              label: 'Lyhyt kuvaus hankkeen suunnilusta ja toteutustavasta ja -organisaatiosta sekä hajikjan käytössä olevista taloudellisista ja muista resursseista',
            }}
            enableUiDataEdit
          />
        </Column>
      </Row>
      <SubTitle>
        {'REFERENSSIT'}
      </SubTitle>
    </Fragment>
  );
};

export default connect(
  (state, props: Props) => {
    const formName = props.formName;
    const selector = formValueSelector(formName);

    return {
      attributes: getAttributes(state),
      isSaveClicked: getIsSaveClicked(state),
      name: selector(state, `${props.field}.name`),
      usersPermissions: getUsersPermissions(state),
    };
  },
)(TargetEdit);
