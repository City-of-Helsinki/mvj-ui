// @flow
import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import {Row, Column} from 'react-foundation';
import {formValueSelector, reduxForm} from 'redux-form';
import flowRight from 'lodash/flowRight';

import Collapse from '$components/collapse/Collapse';
import Divider from '$components/content/Divider';
import {getUiDataLeaseKey} from '$src/uiData/helpers';
import {getUsersPermissions} from '$src/usersPermissions/selectors';
import {PropertyFieldTitles, PropertyFieldPaths} from '$src/property/enums';
import Title from '$components/content/Title';
import type {UsersPermissions as UsersPermissionsType} from '$src/usersPermissions/types';
import {FormNames, ViewModes} from '$src/enums';
import {
  receiveCollapseStates,
} from '$src/property/actions';
import {
  getCollapseStateByKey,
} from '$src/property/selectors';

type Props = {
  collapseStateBasic: boolean,
  receiveCollapseStates: Function,
  usersPermissions: UsersPermissionsType,
}

type State = {

}

class BasicInfoEdit extends PureComponent<Props, State> {
  state = {
  }

  handleCollapseToggle = (key: string, val: boolean) => {
    const {receiveCollapseStates} = this.props;

    receiveCollapseStates({
      [ViewModes.EDIT]: {
        [formName]: {
          [key]: val,
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
      // usersPermissions,
    } = this.props;
    console.log(collapseStateBasic);
    return (
      <form>
        <Title uiDataKey={getUiDataLeaseKey(PropertyFieldPaths.BASIC_INFO)}>
          {PropertyFieldTitles.BASIC_INFO}
        </Title>
        <Divider />
        <Row className='summary__content-wrapper'>
          <Column small={12}>
            <Collapse
              defaultOpen={collapseStateBasic !== undefined ? collapseStateBasic : true}
              hasErrors={false} // {isSaveClicked && !isEmpty(errors)} // TODO
              headerTitle={PropertyFieldTitles.BASIC_INFO}
              onToggle={this.handleBasicInfoCollapseToggle}
              enableUiDataEdit
              uiDataKey={getUiDataLeaseKey(PropertyFieldPaths.BASIC_INFO)}
            >
              <Row>
                {'TÄMÄ ON MUOKKAUSTILA'}
              </Row>
            </Collapse>
          </Column>
        </Row>
      </form>
    );
  }
}

const formName = FormNames.PROPERTY_SUMMARY;
const selector = formValueSelector(formName);

export default flowRight(
  connect(
    (state) => {
      return {
        usersPermissions: getUsersPermissions(state),
        collapseStateBasic: getCollapseStateByKey(state, `${ViewModes.EDIT}.${FormNames.PROPERTY_SUMMARY}.basic`),
      };
    },
    {
      receiveCollapseStates,
    }
  ),
  reduxForm({
    form: formName,
  }),
)(BasicInfoEdit);
