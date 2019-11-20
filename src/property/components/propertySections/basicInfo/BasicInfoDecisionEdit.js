// @flow
import React from 'react';
import {connect} from 'react-redux';
import {formValueSelector} from 'redux-form';
import {Row, Column} from 'react-foundation';

import Authorization from '$components/authorization/Authorization';
import FormField from '$components/form/FormField';
import RemoveButton from '$components/form/RemoveButton';
import {PropertyFieldTitles} from '$src/property/enums';
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
  subventionAmount: string,
  usersPermissions: UsersPermissionsType,
}

const BasicInfoDecisionEdit = ({
  disabled,
  field,
  //  isSaveClicked,
  //  leaseAttributes,
  onRemove,
  //  usersPermissions,
}: Props) => {

  return (
    <Row>
      <Column large={8}>
        <FormField
          disableTouched={false} // isSaveClicked} // TODO
          fieldAttributes={{
            label: 'Päätös',
            read_only: false,
            required: false,
            type: 'string',
          }} // TODO
          name={`${field}.type`}
          overrideValues={{
            fieldType: 'decision',
            label: PropertyFieldTitles.DECISION,
            options: [{value: 1, label: 'Kiinteistölautakunta 15.12.2016 503 § Varausajan jatkaminen HEL 2018-123456'}],
          }}
          enableUiDataEdit
          invisibleLabel
        />
      </Column>
      <Column large={3}>
        <FormField
          disableTouched={false} // isSaveClicked} // TODO
          fieldAttributes={{
            label: 'Hakutyyppi',
            read_only: false,
            required: false,
            type: 'string',
          }} // TODO
          name={`${field}.decision_to_list`}
          overrideValues={{
            fieldType: 'checkbox',
            label: PropertyFieldTitles.DECISION_TO_LIST,
          }}
          enableUiDataEdit
          invisibleLabel
        />
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
)(BasicInfoDecisionEdit);
