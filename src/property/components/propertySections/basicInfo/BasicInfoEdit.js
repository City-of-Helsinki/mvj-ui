// @flow
import React, {Fragment, PureComponent, type Element} from 'react';
import {connect} from 'react-redux';
import {Row, Column} from 'react-foundation';
import {formValueSelector, FieldArray, reduxForm} from 'redux-form';
import flowRight from 'lodash/flowRight';

import {ActionTypes, AppConsumer} from '$src/app/AppContext';
import AddButtonThird from '$components/form/AddButtonThird';
import BasicInfoDecisionEdit from './BasicInfoDecisionEdit';
import {ButtonColors} from '$components/enums';
import {ConfirmationModalTexts} from '$src/enums';
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
import {FormNames, ViewModes} from '$src/enums';
import FormField from '$components/form/FormField';
import {
  receiveCollapseStates,
} from '$src/property/actions';
import {
  getCollapseStateByKey,
} from '$src/property/selectors';
import PropertySiteEdit from './PropertySiteEdit';

type DecisionsProps = {
  disabled: boolean,
  fields: any,
  formName: string,
  // leaseAttrobites
  usersPermissions: UsersPermissionsType,
}

const renderDecisions = ({
  disabled,
  fields,
  formName,
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
            <Column small={12} large={6}>
              {fields && !!fields.length &&
                <Row>
                  <Column small={4} large={8}>
                    <FormTextTitle
                      required={false}
                      enableUiDataEdit
                      uiDataKey={getUiDataLeaseKey(PropertyFieldPaths.DECISION)}
                    >
                      {PropertyFieldTitles.DECISION}
                    </FormTextTitle>
                  </Column>
                  <Column large={3}>
                    <FormTextTitle
                      required={false}
                      enableUiDataEdit
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
  collapseStateBasic: boolean,
  receiveCollapseStates: Function,
  usersPermissions: UsersPermissionsType,
  preparer: ?string,
    formName: string,

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
    } = this.props;
  
    return (
      <form>
        <Title uiDataKey={getUiDataLeaseKey(PropertyFieldPaths.BASIC_INFO)}>
          {PropertyFieldTitles.BASIC_INFO}
        </Title>
        <Divider />
        <Row className='summary__content-wrapper'> {/* TODO wrap columns around authorization */}
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
                <Column small={12} large={8}>
                  {/* // TODO HOW TO GET DATA TO FIELDS */}
                  <FormField
                    disableTouched={false} // isSaveClicked} // TODO
                    fieldAttributes={{
                      label: 'Haun nimi',
                      read_only: false,
                      required: false,
                      type: 'string',
                    }} // TODO
                    name='property_search'
                    overrideValues={{label: PropertyFieldTitles.NAME}}
                    enableUiDataEdit
                    uiDataKey={getUiDataLeaseKey(PropertyFieldPaths.NAME)}
                  />
                </Column>
                <Column small={12} medium={6} large={4}>
                  <FormField
                    disableTouched={false} // isSaveClicked} // TODO
                    fieldAttributes={{
                      label: 'Valmistelija',
                      read_only: false,
                      required: false,
                      type: 'string',
                    }} // TODO
                    name='preparer'
                    overrideValues={{
                      fieldType: 'choice',
                      label: PropertyFieldTitles.PREPARER,
                      options: [{value: 1, label: 'Virve Virkailija'}, {value: 2, label: 'Teuvo Kuusela'}, {value: 3, label: 'Jussi Mannisto'}],
                    }}
                    enableUiDataEdit
                    uiDataKey={getUiDataLeaseKey(PropertyFieldPaths.PREPARER)}
                  />
                </Column>
                <Column small={12} medium={6} large={2}>
                  <FormField
                    disableTouched={false} // isSaveClicked} // TODO
                    fieldAttributes={{
                      label: 'Hakutyyppi',
                      read_only: false,
                      required: false,
                      type: 'string',
                    }} // TODO
                    name='type'
                    overrideValues={{
                      fieldType: 'choice',
                      label: PropertyFieldTitles.TYPE,
                      options: [{value: 1, label: 'Asuntorakentaminen'}],
                    }}
                    enableUiDataEdit
                    uiDataKey={getUiDataLeaseKey(PropertyFieldPaths.TYPE)}
                  />
                </Column>
                <Column small={12} medium={6} large={2}>
                  <FormField
                    disableTouched={false} // isSaveClicked} // TODO
                    fieldAttributes={{
                      label: 'Haun alatyyppi',
                      read_only: false,
                      required: false,
                      type: 'string',
                    }} // TODO
                    name='subtype'
                    overrideValues={{
                      fieldType: 'choice',
                      label: PropertyFieldTitles.SUBTYPE,
                      options: [{value: 1, label: 'Hinta- ja laatukilpailu'}],
                    }}
                    enableUiDataEdit
                    uiDataKey={getUiDataLeaseKey(PropertyFieldPaths.SUBTYPE)}
                  />
                </Column>
                <Column small={6} medium={4} large={2}>
                  <FormField
                    disableTouched={false} // isSaveClicked} // TODO
                    fieldAttributes={{
                      label: 'Alkupvm',
                      read_only: false,
                      required: false,
                      type: 'date',
                    }} // TODO
                    name='start_date'
                    overrideValues={{label: PropertyFieldTitles.START_DATE}}
                    enableUiDataEdit
                    uiDataKey={getUiDataLeaseKey(PropertyFieldPaths.START_DATE)}
                  />
                </Column>
                <Column small={6} medium={4} large={2}>
                  <FormField
                    disableTouched={false} // isSaveClicked} // TODO
                    fieldAttributes={{
                      label: 'Alkupvm',
                      read_only: false,
                      required: false,
                      type: 'time',
                    }} // TODO
                    name='start_time'
                    overrideValues={{label: PropertyFieldTitles.CLOCK}}
                    enableUiDataEdit
                    uiDataKey={getUiDataLeaseKey(PropertyFieldPaths.CLOCK)}
                  />
                </Column>
                <Column small={6} medium={4} large={2}>
                  <FormField
                    disableTouched={false} // isSaveClicked} // TODO
                    fieldAttributes={{
                      label: 'Alkupvm',
                      read_only: false,
                      required: false,
                      type: 'date',
                    }} // TODO
                    name='end_date'
                    overrideValues={{label: PropertyFieldTitles.END_DATE}}
                    enableUiDataEdit
                    uiDataKey={getUiDataLeaseKey(PropertyFieldPaths.END_DATE)}
                  />
                </Column>
                <Column small={6} medium={4} large={2}>
                  <FormField
                    disableTouched={false} // isSaveClicked} // TODO
                    fieldAttributes={{
                      label: 'Alkupvm',
                      read_only: false,
                      required: false,
                      type: 'time',
                    }} // TODO
                    name='end_time'
                    overrideValues={{label: PropertyFieldTitles.CLOCK}}
                    enableUiDataEdit
                    uiDataKey={getUiDataLeaseKey(PropertyFieldPaths.CLOCK)}
                  />
                </Column>
                <FieldArray
                  component={renderDecisions}
                  // attributes
                  disabled={false}
                  formName={FormNames.PROPERTY_SUMMARY}
                  name={'decisions'}
                  usersPermissions={usersPermissions}
                />
                <Column small={12} medium={6} large={2}>
                  <FormField
                    disableTouched={false} // isSaveClicked} // TODO
                    fieldAttributes={{
                      label: 'Haun vaihe',
                      read_only: false,
                      required: false,
                      type: 'string',
                    }} // TODO
                    name='step'
                    overrideValues={{
                      fieldType: 'choice',
                      label: PropertyFieldTitles.STEP,
                      options: [{value: 1, label: 'Valmisteilla'}],
                    }}
                    enableUiDataEdit
                    uiDataKey={getUiDataLeaseKey(PropertyFieldPaths.STEP)}
                  />
                </Column>
              </Row>
              <WhiteBox> {/* TODO  : make light green */}
                <SubTitle>
                  {'HAETTAVAT KOHTEET'}
                </SubTitle>
                <FieldArray
                  component={renderPropertySites}
                  // attributes
                  disabled={false}
                  formName={FormNames.PROPERTY_SUMMARY}
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

const formName = FormNames.PROPERTY_SUMMARY;
const selector = formValueSelector(formName);

export default flowRight(
  connect(
    (state) => {
      return {
        usersPermissions: getUsersPermissions(state),
        collapseStateBasic: getCollapseStateByKey(state, `${ViewModes.EDIT}.${FormNames.PROPERTY_SUMMARY}.basic`),
        preparer: selector(state, 'preparer'),
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
