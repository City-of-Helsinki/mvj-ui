// @flow
import React, {Fragment, PureComponent, type Element} from 'react';
import {connect} from 'react-redux';
import {Row, Column} from 'react-foundation';
import {formValueSelector, FieldArray, reduxForm} from 'redux-form';
import flowRight from 'lodash/flowRight';
import isEmpty from 'lodash/isEmpty';
import get from 'lodash/get';

import Authorization from '$components/authorization/Authorization';
import {ConfirmationModalTexts, FieldTypes, FormNames, ViewModes} from '$src/enums';
import {ActionTypes, AppConsumer} from '$src/app/AppContext';
import AddButtonThird from '$components/form/AddButtonThird';
import BasicInfoDecisionEdit from './BasicInfoDecisionEdit';
import {ButtonColors} from '$components/enums';
import Collapse from '$components/collapse/Collapse';
import FormTextTitle from '$components/form/FormTextTitle';
import Divider from '$components/content/Divider';
import {getUiDataLeaseKey} from '$src/uiData/helpers';
import {FieldTypes as FieldTypeOptions} from '$src/enums';
import {
  isFieldAllowedToRead,
} from '$util/helpers';
import {getUsersPermissions} from '$src/usersPermissions/selectors';
import {PlotSearchFieldTitles, PlotSearchFieldPaths} from '$src/plotSearch/enums';
import WhiteBox from '$components/content/WhiteBox';
import SubTitle from '$components/content/SubTitle';
import Title from '$components/content/Title';
import type {UsersPermissions as UsersPermissionsType} from '$src/usersPermissions/types';
import FormField from '$components/form/FormField';
import {
  receiveCollapseStates,
  receiveIsSaveClicked,
} from '$src/plotSearch/actions';
import {
  getAttributes,
  getCollapseStateByKey,
  getIsSaveClicked,
  getErrorsByFormName,
} from '$src/plotSearch/selectors';

import PlotSearchSiteEdit from './PlotSearchSiteEdit';

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
                      uiDataKey={getUiDataLeaseKey(PlotSearchFieldPaths.DECISION)}
                    >
                      {PlotSearchFieldTitles.DECISION}
                    </FormTextTitle>
                  </Column>
                  <Column large={3}>
                    <FormTextTitle
                      required={false}
                      uiDataKey={getUiDataLeaseKey(PlotSearchFieldPaths.DECISION_TO_LIST)}
                    >
                      {PlotSearchFieldTitles.DECISION_TO_LIST}
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

type PlotSearchSitesProps = {
  disabled: boolean,
  fields: any,
  formName: string,
  // leaseAttrobites
  usersPermissions: UsersPermissionsType,
}

const renderPlotSearchSites = ({
  disabled,
  fields,
  formName,
  // usersPermissions,
}: PlotSearchSitesProps): Element<*> => {
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
              return <PlotSearchSiteEdit
                key={index}
                index={index}
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
          {PlotSearchFieldTitles.BASIC_INFO}
        </Title>
        <Divider />
        <Row className='summary__content-wrapper'>
          <Column small={12}>
            <Collapse
              defaultOpen={collapseStateBasic !== undefined ? collapseStateBasic : true}
              hasErrors={isSaveClicked && !isEmpty(errors)}
              headerTitle={PlotSearchFieldTitles.BASIC_INFO}
              onToggle={this.handleBasicInfoCollapseToggle}
            >
              <Row>
                <Authorization allow={isFieldAllowedToRead(attributes, 'name')}>
                  <Column small={12} large={8}>
                    <FormField
                      disableTouched={isSaveClicked}
                      fieldAttributes={get(attributes, 'name')}
                      name='name'
                      overrideValues={{label: PlotSearchFieldTitles.NAME}}
                    />
                  </Column>
                </Authorization>
                <Column small={12} medium={6} large={4}>
                  <FormField
                    disableTouched={isSaveClicked}
                    fieldAttributes={get(attributes, 'preparer')}
                    name='preparer'
                    overrideValues={{
                      fieldType: FieldTypes.USER,
                      label: PlotSearchFieldTitles.PREPARER,
                    }}
                  />
                </Column>
                <Column small={12} medium={6} large={3}>
                  <FormField
                    disableTouched={isSaveClicked}
                    fieldAttributes={get(attributes, PlotSearchFieldPaths.TYPE)}
                    name='type'
                    overrideValues={{
                      label: PlotSearchFieldTitles.TYPE,
                    }}
                  />
                </Column>
                <Column small={12} medium={6} large={3}>
                  <FormField
                    disableTouched={isSaveClicked}
                    fieldAttributes={get(attributes, PlotSearchFieldPaths.SUBTYPE)}
                    name='subtype'
                    overrideValues={{
                      label: PlotSearchFieldTitles.SUBTYPE,
                    }}
                  />
                </Column>
                <Column small={6} medium={6} large={2}>
                  <FormField
                    disableTouched={isSaveClicked}
                    fieldAttributes={get(attributes, 'begin_at')}
                    name='begin_at'
                    overrideValues={{
                      label: 'Alkupvm ja Klo',
                      fieldType: FieldTypeOptions.TIME,
                    }}
                  />
                </Column>
                <Column small={6} medium={6} large={2}>
                  <FormField
                    disableTouched={isSaveClicked}
                    fieldAttributes={get(attributes, 'end_at')}
                    name='end_at'
                    overrideValues={{
                      label: 'Loppupvm ja Klo',
                      fieldType: FieldTypeOptions.TIME,
                    }}
                  />
                </Column>
                <FieldArray
                  component={renderDecisions}
                  attributes={attributes}
                  disabled={false}
                  formName={FormNames.PLOT_SEARCH_SUMMARY}
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
                      label: PlotSearchFieldTitles.STEP,
                    }}
                  />
                </Column>
              </Row>
              <WhiteBox>
                <SubTitle>
                  {'HAETTAVAT KOHTEET'}
                </SubTitle>
                <FieldArray
                  component={renderPlotSearchSites}
                  attributes={attributes}
                  isClicked={isSaveClicked}
                  disabled={false}
                  formName={FormNames.PLOT_SEARCH_BASIC_INFORMATION}
                  name={'targets'}
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

const formName = FormNames.PLOT_SEARCH_BASIC_INFORMATION;
const selector = formValueSelector(formName);

export default flowRight(
  connect(
    (state) => {
      return {
        attributes: getAttributes(state),
        usersPermissions: getUsersPermissions(state),
        collapseStateBasic: getCollapseStateByKey(state, `${ViewModes.EDIT}.${FormNames.PLOT_SEARCH_BASIC_INFORMATION}.basic`),
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
