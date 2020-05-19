// @flow
import React from 'react';
import {connect} from 'react-redux';
import {formValueSelector} from 'redux-form';
import {Row, Column} from 'react-foundation';
import get from 'lodash/get';

import Authorization from '$components/authorization/Authorization';
import FormField from '$components/form/FormField';
import RemoveButton from '$components/form/RemoveButton';
import {getUsersPermissions} from '$src/usersPermissions/selectors';
import type {Attributes} from '$src/types';
import type {UsersPermissions as UsersPermissionsType} from '$src/usersPermissions/types';

type Props = {
  attributes: Attributes,
  disabled: boolean,
  field: any,
  formName: string,
  isSaveClicked: boolean,
  onRemove: Function,
  usersPermissions: UsersPermissionsType,
}

const AddressItemEdit = ({
  disabled,
  field,
  isSaveClicked,
  attributes,
  onRemove,
}: Props) => {

  return (
    <Row>
      <Column small={6} medium={4} large={2}>
        <FormField
          disableTouched={isSaveClicked}
          fieldAttributes={get(attributes, 'addresses.child.children.address')}
          name={`${field}.address`}
          invisibleLabel
        />
      </Column>
      <Column small={6} medium={4} large={2}> 
        <FormField
          disableTouched={isSaveClicked}
          fieldAttributes={get(attributes, 'addresses.child.children.postal_code')}
          name={`${field}.postal_code`}
          invisibleLabel
        />
      </Column>
      <Column small={6} medium={4} large={2}>
        <FormField
          disableTouched={isSaveClicked}
          fieldAttributes={get(attributes, 'addresses.child.children.city')}
          name={`${field}.city`}
          invisibleLabel
        />
      </Column>
      <Column small={6} medium={4} large={2}>
        <FormField
          disableTouched={isSaveClicked}
          fieldAttributes={get(attributes, 'addresses.child.children.isPrimary')}
          name={`${field}.isPrimary`}
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
      type: selector(state, `${props.field}.type`),
      usersPermissions: getUsersPermissions(state),
    };
  },
)(AddressItemEdit);
