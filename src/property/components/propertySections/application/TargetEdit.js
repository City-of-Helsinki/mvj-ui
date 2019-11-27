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

const TargetEdit = ({
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
        <Column large={3}>
          <FormField
            disableTouched={false} // isSaveClicked} // TODO
            fieldAttributes={{
              label: 'Tontti, jota hakemus koskee',
              read_only: false,
              required: false,
              type: 'string',
            }} // TODO
            name={`${field}.target_property`}
            overrideValues={{
              fieldType: 'choice',
              label: 'Tontti, jota hakemus koskee',
              options: [{value: '1', label: 'Mäntylä'}, {value: '2', label: 'Kuusamo'}],
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
      // isSaveClicked: getIsSaveClicked(state),
      // leaseAttributes: getLeaseAttributes(state),
      name: selector(state, `${props.field}.name`),
      usersPermissions: getUsersPermissions(state),
    };
  },
)(TargetEdit);
