// @flow
import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import {Row, Column} from 'react-foundation';
import {reduxForm} from 'redux-form';
import flowRight from 'lodash/flowRight';
import isEmpty from 'lodash/isEmpty';
import get from 'lodash/get';

import Authorization from '$components/authorization/Authorization';
import {FormNames, ViewModes} from '$src/enums';
import Collapse from '$components/collapse/Collapse';
import Divider from '$components/content/Divider';
import {
  isFieldAllowedToRead,
} from '$util/helpers';
import {getUsersPermissions} from '$src/usersPermissions/selectors';
import Title from '$components/content/Title';
import type {UsersPermissions as UsersPermissionsType} from '$src/usersPermissions/types';
import FormField from '$components/form/FormField';
import {
  receiveCollapseStates,
  receiveIsSaveClicked,
} from '$src/plotApplications/actions';
import {
  getAttributes,
  getCollapseStateByKey,
  getIsSaveClicked,
  getErrorsByFormName,
} from '$src/plotApplications/selectors';

import type {Attributes} from '$src/types';

type Props = {
  attributes: Attributes,
  collapseStateBasic: boolean,
  receiveCollapseStates: Function,
  usersPermissions: UsersPermissionsType,
  errors: ?Object,
  preparer: ?string,
  formName: string,
  isSaveClicked: boolean,
}

type State = {

}

class PlotApplicationEdit extends PureComponent<Props, State> {
  state = {
  }

  handleCollapseToggle = (key: string, val: boolean) => {
    const {receiveCollapseStates} = this.props;

    receiveCollapseStates({
      [ViewModes.EDIT]: {
        [FormNames.PLOT_APPLICATION]: {
          plot_application: val,
        },
      },
    });
  }

  handleBasicInfoCollapseToggle = (val: boolean) => {
    this.handleCollapseToggle('basic', val);
  }

  render (){
    const {
      collapseStateBasic,
      isSaveClicked,
      attributes,
      errors,
    } = this.props;

    return (
      <form>
        <Title>
          {'Hakemus'}
        </Title>
        <Divider />
        <Row className='summary__content-wrapper'>
          <Column small={12}>
            <Collapse
              defaultOpen={collapseStateBasic !== undefined ? collapseStateBasic : true}
              hasErrors={isSaveClicked && !isEmpty(errors)}
              headerTitle={'Hakemus'}
              onToggle={this.handleBasicInfoCollapseToggle}
            >
              <Row>
                <Authorization allow={isFieldAllowedToRead(attributes, 'name')}>
                  <Column small={12} large={8}>
                    <FormField
                      disableTouched={isSaveClicked}
                      fieldAttributes={get(attributes, 'name')}
                      name='name'
                    />
                  </Column>
                </Authorization>
              </Row>
            </Collapse>
          </Column>
        </Row>
      </form>
    );
  }
}

const formName = FormNames.PLOT_APPLICATION;

export default flowRight(
  connect(
    (state) => {
      return {
        attributes: getAttributes(state),
        usersPermissions: getUsersPermissions(state),
        collapseStateBasic: getCollapseStateByKey(state, `${ViewModes.EDIT}.${FormNames.PLOT_APPLICATION}.basic`),
        isSaveClicked: getIsSaveClicked(state),
        errors: getErrorsByFormName(state, formName),
      };
    },
    {
      receiveCollapseStates,
      receiveIsSaveClicked,
    }
  ),
  reduxForm({
    form: formName,
    destroyOnUnmount: false,
  }),
)(PlotApplicationEdit);
