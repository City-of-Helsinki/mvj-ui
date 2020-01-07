// @flow
import React, {Fragment, PureComponent, type Element} from 'react';
import {connect} from 'react-redux';
import {Row, Column} from 'react-foundation';
import {formValueSelector, FieldArray, reduxForm} from 'redux-form';
import flowRight from 'lodash/flowRight';
import get from 'lodash/get';

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
  getAttributes,
  getCollapseStateByKey,
  getIsSaveClicked,
} from '$src/property/selectors';
import {
  getFieldOptions,
} from '$util/helpers';

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
            <Column small={12} large={6}>
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
              console.log(field);
              console.log(formName);
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
  preparer: ?string,
  formName: string,
  isSaveClicked: boolean,
}

type State = {

}

class BasicInfoEdit extends PureComponent<Props, State> {
/*   componentDidUpdate(prevProps) {
    const {receiveFormValidFlags} = this.props;

    if(prevProps.valid !== this.props.valid) {
      receiveFormValidFlags({
        [formName]: this.props.valid,
      });
    }
  } */ // TODO 

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
    } = this.props;
  
    const preparerOptions = getFieldOptions(attributes, 'preparer');
    const typeOptions = getFieldOptions(attributes, 'type');
    const subtypeOptions = getFieldOptions(attributes, 'subtype');

    return (
      <form>
        <Title>
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
            >
              <Row>
                <Column small={12} large={8}>
                  <FormField
                    disableTouched={isSaveClicked}
                    fieldAttributes={get(attributes, 'search_name')}
                    name='search_name'
                    overrideValues={{label: PropertyFieldTitles.NAME}}
                  />
                </Column>
                <Column small={12} medium={6} large={4}>
                  <FormField
                    disableTouched={isSaveClicked}
                    fieldAttributes={get(attributes, 'preparer')}
                    name='preparer'
                    overrideValues={{
                      fieldType: 'choice',
                      label: PropertyFieldTitles.PREPARER,
                      options: preparerOptions,
                    }}
                  />
                </Column>
                <Column small={12} medium={6} large={2}>
                  <FormField
                    disableTouched={isSaveClicked}
                    fieldAttributes={get(attributes, 'type')}
                    name='type'
                    overrideValues={{
                      fieldType: 'choice',
                      label: PropertyFieldTitles.TYPE,
                      options: typeOptions,
                    }}
                  />
                </Column>
                <Column small={12} medium={6} large={2}>
                  <FormField
                    disableTouched={isSaveClicked}
                    fieldAttributes={get(attributes, 'subtype')}
                    name='subtype'
                    overrideValues={{
                      fieldType: 'choice',
                      label: PropertyFieldTitles.SUBTYPE,
                      options: subtypeOptions,
                    }}
                  />
                </Column>
                <Column small={6} medium={4} large={2}>
                  <FormField
                    disableTouched={isSaveClicked}
                    fieldAttributes={get(attributes, 'start_date')}
                    name='start_date'
                    overrideValues={{label: PropertyFieldTitles.START_DATE}}
                  />
                </Column>
                <Column small={6} medium={4} large={2}>
                  <FormField
                    disableTouched={isSaveClicked}
                    fieldAttributes={get(attributes, 'start_time')}
                    name='start_time'
                    overrideValues={{label: PropertyFieldTitles.CLOCK}}
                  />
                </Column>
                <Column small={6} medium={4} large={2}>
                  <FormField
                    disableTouched={isSaveClicked}
                    fieldAttributes={get(attributes, 'end_date')}
                    name='end_date'
                    overrideValues={{label: PropertyFieldTitles.END_DATE}}
                  />
                </Column>
                <Column small={6} medium={4} large={2}>
                  <FormField
                    disableTouched={isSaveClicked}
                    fieldAttributes={get(attributes, 'end_time')}
                    name='end_time'
                    overrideValues={{label: PropertyFieldTitles.CLOCK}}
                  />
                </Column>
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
                  />
                </Column>
              </Row>
              <WhiteBox> {/* TODO  : make light green */}
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
      };
    },
    {
      receiveCollapseStates,
    }
  ),
  reduxForm({
    form: formName,
    destroyOnUnmount: false,
  }),
)(BasicInfoEdit);
