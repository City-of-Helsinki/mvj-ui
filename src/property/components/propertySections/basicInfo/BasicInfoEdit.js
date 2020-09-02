// @flow
import React, {Fragment, PureComponent, type Element} from 'react';
import {connect} from 'react-redux';
import {Row, Column} from 'react-foundation';
import {formValueSelector, FieldArray, reduxForm} from 'redux-form';
import flowRight from 'lodash/flowRight';
import isEmpty from 'lodash/isEmpty';
import get from 'lodash/get';

import {ConfirmationModalTexts, FieldTypes, FormNames, ViewModes} from '$src/enums';
import {ActionTypes, AppConsumer} from '$src/app/AppContext';
import AddButtonThird from '$components/form/AddButtonThird';
import BasicInfoDecisionEdit from './BasicInfoDecisionEdit';
import {ButtonColors} from '$components/enums';
import Collapse from '$components/collapse/Collapse';
import FormTextTitle from '$components/form/FormTextTitle';
import Divider from '$components/content/Divider';
import {getUiDataLeaseKey} from '$src/uiData/helpers';
import {getUsersPermissions} from '$src/usersPermissions/selectors';
import {PropertyFieldTitles, PropertyFieldPaths} from '$src/property/enums';
import WhiteBox from '$components/content/WhiteBox';
import SubTitle from '$components/content/SubTitle';
import Title from '$components/content/Title';
import type {UsersPermissions as UsersPermissionsType} from '$src/usersPermissions/types';
import FormField from '$components/form/FormField';
import {
  receiveCollapseStates,
  receiveIsSaveClicked,
} from '$src/property/actions';
import {
  getAttributes,
  getCollapseStateByKey,
  getIsSaveClicked,
  getErrorsByFormName,
} from '$src/property/selectors';

import PropertySiteEdit from './PropertySiteEdit';

import type {Attributes} from '$src/types';

type DecisionsProps = {
  attributes: Attributes,
  disabled: boolean,
  fields: any,
  formName: string,
  isSaveClicked: Boolean,
  usersPermissions: UsersPermissionsType,
}

const renderDecisions = ({
  disabled,
  fields,
  formName,
  attributes,
  isSaveClicked,
  // usersPermissions,
}: DecisionsProps): Element<*> => {
  const handleAdd = () => {
    fields.push({});
  };

  return (
    <AppConsumer>
      {({dispatch}) => {
        return(
          <Fragment>
            <Column small={12} large={10}>
              {fields && !!fields.length &&
                <Row>
                  <Column small={4} large={8}>
                    <FormTextTitle
                      required={false}
                      uiDataKey={getUiDataLeaseKey(PropertyFieldPaths.DECISION)}
                    >
                      {PropertyFieldTitles.DECISION}
                    </FormTextTitle>
                  </Column>
                  <Column large={3}>
                    <FormTextTitle
                      required={false}
                      uiDataKey={getUiDataLeaseKey(PropertyFieldPaths.DECISION_TO_LIST)}
                    >
                      {PropertyFieldTitles.DECISION_TO_LIST}
                    </FormTextTitle>
                  </Column>
                </Row>
              }

              {!!fields.length && fields.map((field, index) => {
                const handleRemove = () => {
                  dispatch({
                    type: ActionTypes.SHOW_CONFIRMATION_MODAL,
                    confirmationFunction: () => {
                      fields.remove(index);
                    },
                    confirmationModalButtonClassName: ButtonColors.ALERT,
                    confirmationModalButtonText: ConfirmationModalTexts.DELETE_DECISION.BUTTON,
                    confirmationModalLabel: ConfirmationModalTexts.DELETE_DECISION.LABEL,
                    confirmationModalTitle: ConfirmationModalTexts.DELETE_DECISION.TITLE,
                  });
                };

                return <BasicInfoDecisionEdit
                  key={index}
                  disabled={disabled}
                  field={field}
                  formName={formName}
                  onRemove={handleRemove}
                  attributes={attributes}
                  isSaveClicked={isSaveClicked}
                />;
              })}

              {!disabled &&
                <Row>
                  <Column>
                    <AddButtonThird
                      label='Lisää päätös'
                      onClick={handleAdd}
                    />
                  </Column>
                </Row>
              }
            </Column>
          </Fragment>
        );
      }}
    </AppConsumer>
  );
};

type PropertySitesProps = {
  disabled: boolean,
  fields: any,
  formName: string,
  // leaseAttrobites
  usersPermissions: UsersPermissionsType,
}

const renderPropertySites = ({
  disabled,
  fields,
  formName,
  // usersPermissions,
}: PropertySitesProps): Element<*> => {
  const handleAdd = () => {
    fields.push({});
  };

  return (
    <AppConsumer>
      {({dispatch}) => {
        return(
          <Fragment>
            {!!fields.length && fields.map((field, index) => {
              const handleRemove = () => {
                dispatch({
                  type: ActionTypes.SHOW_CONFIRMATION_MODAL,
                  confirmationFunction: () => {
                    fields.remove(index);
                  },
                  confirmationModalButtonClassName: ButtonColors.ALERT,
                  confirmationModalButtonText: ConfirmationModalTexts.DELETE_DECISION.BUTTON,
                  confirmationModalLabel: ConfirmationModalTexts.DELETE_DECISION.LABEL,
                  confirmationModalTitle: ConfirmationModalTexts.DELETE_DECISION.TITLE,
                });
              };
              return <PropertySiteEdit
                key={index}
                disabled={disabled}
                field={field}
                formName={formName}
                onRemove={handleRemove}
              />;
            })}
            <Column small={12} large={6}>
              {!disabled &&
                <Row>
                  <Column>
                    <AddButtonThird
                      label='Lisää kohde'
                      onClick={handleAdd}
                    />
                  </Column>
                </Row>
              }
            </Column>
          </Fragment>
        );
      }}
    </AppConsumer>
  );
};

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
      usersPermissions,
      isSaveClicked,
      attributes,
      errors,
    } = this.props;

    return (
      <form>
        <Title>
          {PropertyFieldTitles.BASIC_INFO}
        </Title>
        <Divider />
        <Row className='summary__content-wrapper'>
          <Column small={12}>
            <Collapse
              defaultOpen={collapseStateBasic !== undefined ? collapseStateBasic : true}
              hasErrors={isSaveClicked && !isEmpty(errors)}
              headerTitle={PropertyFieldTitles.BASIC_INFO}
              onToggle={this.handleBasicInfoCollapseToggle}
            >
              <Row>
                <Column small={12} large={8}>
                  <FormField
                    disableTouched={isSaveClicked}
                    fieldAttributes={get(attributes, 'name')}
                    name='name'
                    overrideValues={{label: PropertyFieldTitles.NAME}}
                  />
                </Column>
                <Column small={12} medium={6} large={4}>
                  <FormField
                    disableTouched={isSaveClicked}
                    fieldAttributes={get(attributes, 'preparer')}
                    name='preparer'
                    overrideValues={{
                      fieldType: FieldTypes.USER,
                      label: PropertyFieldTitles.PREPARER,
                    }}
                  />
                </Column>
                <Column small={12} medium={6} large={3}>
                  <FormField
                    disableTouched={isSaveClicked}
                    fieldAttributes={get(attributes, 'type')}
                    name='type'
                    overrideValues={{
                      label: PropertyFieldTitles.TYPE,
                    }}
                  />
                </Column>
                <Column small={12} medium={6} large={3}>
                  <FormField
                    disableTouched={isSaveClicked}
                    fieldAttributes={get(attributes, 'subtype')}
                    name='subtype'
                    overrideValues={{
                      label: PropertyFieldTitles.SUBTYPE,
                    }}
                  />
                </Column>
                <Column small={6} medium={4} large={2}>
                  <FormField
                    disableTouched={isSaveClicked}
                    fieldAttributes={get(attributes, 'begin_at')}
                    name='begin_at'
                    overrideValues={{
                      label: PropertyFieldTitles.START_DATE,
                      fieldType: 'date',
                    }}
                  />
                </Column>
                {/* <Column small={6} medium={4} large={2}>
                  <FormField
                    disableTouched={isSaveClicked}
                    fieldAttributes={get(attributes, 'start_time')}
                    name='start_time'
                    overrideValues={{
                      label: PropertyFieldTitles.CLOCK,
                      fieldType: 'date',
                    }}
                  />  
                </Column> */}
                <Column small={6} medium={4} large={2}>
                  <FormField
                    disableTouched={isSaveClicked}
                    fieldAttributes={get(attributes, 'end_at')}
                    name='end_at'
                    overrideValues={{
                      label: PropertyFieldTitles.END_DATE,
                      fieldType: 'date',
                    }}
                  />
                </Column>
                {/* <Column small={6} medium={4} large={2}>
                  <FormField
                    disableTouched={isSaveClicked}
                    fieldAttributes={get(attributes, 'end_time')}
                    name='end_time'
                    overrideValues={{label: PropertyFieldTitles.CLOCK}}
                  />
                </Column> */}
                <FieldArray
                  component={renderDecisions}
                  attributes={attributes}
                  disabled={false}
                  formName={FormNames.PROPERTY_SUMMARY}
                  name={'decisions'}
                  isSaveClicked={isSaveClicked}
                  usersPermissions={usersPermissions}
                />
                <Column small={12} medium={6} large={2}>
                  <FormField
                    disableTouched={isSaveClicked}
                    fieldAttributes={get(attributes, 'stage')}
                    name='stage'
                    overrideValues={{
                      label: PropertyFieldTitles.STEP,
                    }}
                  />
                </Column>
              </Row>
              <WhiteBox>
                <SubTitle>
                  {'HAETTAVAT KOHTEET'}
                </SubTitle>
                <FieldArray
                  component={renderPropertySites}
                  attributes={attributes}
                  isClicked={isSaveClicked}
                  disabled={false}
                  formName={FormNames.PROPERTY_BASIC_INFORMATION}
                  name={'property_sites'}
                  usersPermissions={usersPermissions}
                />
              </WhiteBox>
            </Collapse>
          </Column>
        </Row>
      </form>
    );
  }
}

const formName = FormNames.PROPERTY_BASIC_INFORMATION;
const selector = formValueSelector(formName);

export default flowRight(
  connect(
    (state) => {
      return {
        attributes: getAttributes(state),
        usersPermissions: getUsersPermissions(state),
        collapseStateBasic: getCollapseStateByKey(state, `${ViewModes.EDIT}.${FormNames.PROPERTY_BASIC_INFORMATION}.basic`),
        preparer: selector(state, 'preparer'),
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
)(BasicInfoEdit);
