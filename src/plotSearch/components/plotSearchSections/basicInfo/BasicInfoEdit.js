// @flow
import React, {Fragment, PureComponent, type Element} from 'react';
import {connect} from 'react-redux';
import {Row, Column} from 'react-foundation';
import {formValueSelector, FieldArray, reduxForm, change} from 'redux-form';
import flowRight from 'lodash/flowRight';
import isEmpty from 'lodash/isEmpty';
import get from 'lodash/get';

import Authorization from '$components/authorization/Authorization';
import {ConfirmationModalTexts, FieldTypes, FormNames, ViewModes} from '$src/enums';
import {ActionTypes, AppConsumer} from '$src/app/AppContext';
import AddButtonThird from '$components/form/AddButtonThird';
import ErrorField from "../../../../components/form/ErrorField";
import BasicInfoDecisionEdit from './BasicInfoDecisionEdit';
import {ButtonColors} from '$components/enums';
import Collapse from '$components/collapse/Collapse';
import FormTextTitle from '$components/form/FormTextTitle';
import Divider from '$components/content/Divider';
import {getUiDataPlotSearchKey} from '$src/uiData/helpers';
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
  receiveFormValidFlags,
  removePlanUnitDecisions
} from '$src/plotSearch/actions';
import {
  getAttributes,
  getCollapseStateByKey,
  getIsSaveClicked,
  getErrorsByFormName,
  getPlotSearchSubTypes,
  getDecisionCandidates
} from '$src/plotSearch/selectors';
import {
  filterSubTypes,
} from '$src/plotSearch/helpers';

import PlotSearchSiteEdit from './PlotSearchSiteEdit';

import type {Attributes} from '$src/types';
import {hasMinimumRequiredFieldsFilled} from "../../../helpers";
import WarningField from "../../../../components/form/WarningField";
import {getCurrentPlotSearch, getCurrentPlotSearchStage, getStages, isLockedForModifications} from "../../../selectors";
import PlotSearchTargetListing from "./PlotSearchTargetListing";
import {AUTOMATIC_PLOT_SEARCH_STAGES} from "../../../constants";
import {PlotSearchStageTypes} from "../../../enums";

type DecisionsProps = {
  attributes: Attributes,
  disabled: boolean,
  fields: any,
  formName: string,
  isSaveClicked: boolean,
  usersPermissions: UsersPermissionsType,
  decisionCandidates: Array<Object>,
  hasUnidentifiedDecisions: boolean
}
const renderDecisions = ({
  disabled,
  fields,
  formName,
  attributes,
  decisionCandidates,
  hasUnidentifiedDecisions,
  // usersPermissions,
}: DecisionsProps): Element<*> => {
  const handleAdd = () => {
    fields.push({});
  };

  const getPlotUnitDecisions = async (input) => {
    const lcInput = input.toLowerCase();

    return decisionCandidates.filter((item) => {
      if (item.relatedPlotUnitIdentifier?.toLowerCase()?.includes(lcInput)) {
        return true;
      }
      if (item.reference_number?.toLowerCase()?.includes(lcInput)) {
        return true;
      }
      if (item.decision_maker?.name?.toLowerCase()?.includes(lcInput)) {
        return true;
      }
      if (item.type?.name?.toLowerCase()?.includes(lcInput)) {
        return true;
      }
      if (item.description?.toLowerCase()?.includes(lcInput)) {
        return true;
      }

      return false;
    });
  }

  const cacheKey = decisionCandidates.map((item) => item.id).join(',');

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
                    >
                      {PlotSearchFieldTitles.DECISION}
                    </FormTextTitle>
                  </Column>
                  {/*<Column large={3}>
                    <FormTextTitle
                      required={false}
                    >
                      {PlotSearchFieldTitles.DECISION_TO_LIST}
                    </FormTextTitle>
                  </Column>*/}
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

                const handleChange = (item) => {
                  fields.splice(index, 1, item.data);
                };

                return <BasicInfoDecisionEdit
                  key={`${fields.get(index)?.id}_${index}`}
                  disabled={disabled}
                  field={field}
                  formName={formName}
                  onRemove={handleRemove}
                  onChange={handleChange}
                  attributes={attributes}
                  getPlotUnitDecisions={getPlotUnitDecisions}
                  cacheKey={cacheKey}
                />;
              })}

              <ErrorField showError={hasUnidentifiedDecisions} meta={{
                error: 'Kunkin päätöksen on liityttävä johonkin valituista kohteista. Kohteiden ulkopuoliset päätökset poistetaan tallennettaessa.'
              }} />

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
  usersPermissions: UsersPermissionsType,
  onRemove: Function,
  change: Function,
  form: string
}

const renderPlotSearchSites = ({
  disabled,
  fields,
  formName,
  form,
  change,
  onRemove
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
                    const id = fields.get(index)?.plan_unit?.id;
                    fields.remove(index);

                    if (id) {
                      onRemove(id);
                    }
                  },
                  confirmationModalButtonClassName: ButtonColors.ALERT,
                  confirmationModalButtonText: ConfirmationModalTexts.DELETE_DECISION.BUTTON,
                  confirmationModalLabel: ConfirmationModalTexts.DELETE_DECISION.LABEL,
                  confirmationModalTitle: ConfirmationModalTexts.DELETE_DECISION.TITLE,
                });
              };

              const handleChange = (oldId, newId) => {
                if (oldId) {
                  onRemove(oldId);
                }
              };

              return <PlotSearchSiteEdit
                key={`${fields.get(index)?.id}_${index}`}
                index={index}
                disabled={disabled}
                field={field}
                form={form}
                formName={formName}
                change={change}
                onRemove={handleRemove}
                onReplace={handleChange}
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

type OwnProps = {

};

type Props = {
  attributes: Attributes,
  collapseStateBasic: boolean,
  receiveCollapseStates: Function,
  usersPermissions: UsersPermissionsType,
  errors: ?Object,
  formName: string,
  isSaveClicked: boolean,
  plotSearchSubTypes: Object,
  type: string,
  receiveFormValidFlags: Function,
  valid: boolean,
  hasMinimumRequiredFieldsFilled: boolean,
  change: Function,
  currentPlotSearch: Object,
  decisionCandidates: Array<Object>,
  selectedDecisions: Array<Object>,
  targets: Array<Object>,
  removeTargetDecisions: Function,
  isLockedForModifications: boolean,
  stages: Array<Object>,
  currentStage: string | null
}

type State = {

}

class BasicInfoEdit extends PureComponent<Props, State> {
  state = {
  }

  componentDidMount() {
    const { currentStage, change, stages } = this.props;
    if (!currentStage) {
      const initialStage = stages.find((stage) => stage.stage === PlotSearchStageTypes.IN_PREPARATION);
      if (initialStage) {
        change('stage', initialStage.id);
      }
    }
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

  componentDidUpdate(prevProps) {
    const {receiveFormValidFlags, selectedDecisions} = this.props;

    if(prevProps.valid !== this.props.valid) {
      receiveFormValidFlags({
        [FormNames.PLOT_SEARCH_BASIC_INFORMATION]: this.props.valid,
      });
    }

    if (prevProps.decisionCandidates !== this.props.decisionCandidates) {
      const selectedMissingIds = {};
      const currentCandidateIds = this.props.decisionCandidates.map((candidate) => candidate.id);

      selectedDecisions.forEach((decision) => {
        if (decision.relatedPlanUnitId) {
          if (!currentCandidateIds.includes(decision.id)) {
            selectedMissingIds[decision.id] = decision;
            decision.relatedPlanUnitIdentifier = null;
            decision.relatedPlanUnitId = null;
          }
        } else {
          selectedMissingIds[decision.id] = decision;
        }
      });

      this.props.decisionCandidates.forEach((candidate) => {
        if (selectedMissingIds[candidate.id]) {
          selectedMissingIds[candidate.id].relatedPlanUnitIdentifier = candidate.relatedPlanUnitIdentifier;
          selectedMissingIds[candidate.id].relatedPlanUnitId = candidate.relatedPlanUnitId;
        }
      })
    }
  }

  onTargetRemoved = (id) => {
    const { targets, removeTargetDecisions } = this.props;

    // If there's more than one target with the same plan unit, the decisions should not be removed
    // from the candidate list.
    if (targets.filter((target) => target.plan_unit?.id === id).length > 1) {
      return;
    }

    removeTargetDecisions(id);
  }

  render (){
    const {
      collapseStateBasic,
      usersPermissions,
      isSaveClicked,
      attributes,
      errors,
      plotSearchSubTypes,
      type,
      decisionCandidates,
      selectedDecisions,
      hasMinimumRequiredFieldsFilled,
      change,
      currentPlotSearch,
      isLockedForModifications,
      stages
    } = this.props;
    const subTypeOptions = filterSubTypes(plotSearchSubTypes, type);

    const hasUnidentifiedDecisions = selectedDecisions.some((decision) => decision?.id && !decision?.relatedPlanUnitId);

    const canEditStage = currentPlotSearch?.stage && !AUTOMATIC_PLOT_SEARCH_STAGES.includes(currentPlotSearch.stage.stage);
    let stageAttributes = get(attributes, 'stage');
    if (stageAttributes && canEditStage) {
      stageAttributes = {
        ...stageAttributes,
        choices: stages.filter((stage) => !AUTOMATIC_PLOT_SEARCH_STAGES.includes(stage.stage)
        ).map((stage) => ({
          display_name: stage.name,
          value: stage.id
        }))
      };
    }

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
                  <Column small={12} medium={12} large={5}>
                    <FormField
                      disableTouched={isSaveClicked}
                      fieldAttributes={get(attributes, 'name')}
                      name='name'
                      overrideValues={{label: PlotSearchFieldTitles.NAME}}
                      enableUiDataEdit
                      uiDataKey={getUiDataPlotSearchKey('name')}
                    />
                  </Column>
                </Authorization>
                <Authorization allow={isFieldAllowedToRead(attributes, 'preparers')}>
                  <Column small={12} medium={6} large={4}>
                    <FormField
                      disableTouched={isSaveClicked}
                      fieldAttributes={get(attributes, 'preparers')}
                      name='preparers'
                      overrideValues={{
                        fieldType: FieldTypes.USER,
                        label: PlotSearchFieldTitles.PREPARERS,
                        required: true,
                        multiSelect: true
                      }}
                      enableUiDataEdit
                      uiDataKey={getUiDataPlotSearchKey('preparers')}
                    />
                  </Column>
                </Authorization>
                <Authorization allow={isFieldAllowedToRead(attributes, 'search_class')}>
                  <Column small={12} medium={6} large={3}>
                    <FormField
                      disableTouched={isSaveClicked}
                      fieldAttributes={get(attributes, PlotSearchFieldPaths.SEARCH_CLASS)}
                      name='search_class'
                      overrideValues={{
                        label: PlotSearchFieldTitles.SEARCH_CLASS,
                        required: true,
                        allowEdit: !isLockedForModifications
                      }}
                      enableUiDataEdit
                      uiDataKey={getUiDataPlotSearchKey('search_class')}
                    />
                  </Column>
                </Authorization>
                <Authorization allow={isFieldAllowedToRead(attributes, 'type')}>
                  <Column small={12} medium={6} large={3}>
                    <FormField
                      disableTouched={isSaveClicked}
                      fieldAttributes={get(attributes, PlotSearchFieldPaths.TYPE)}
                      name='type'
                      overrideValues={{
                        label: PlotSearchFieldTitles.TYPE,
                        required: true,
                        allowEdit: !isLockedForModifications
                      }}
                      enableUiDataEdit
                      uiDataKey={getUiDataPlotSearchKey('type')}
                    />
                  </Column>
                </Authorization>
                <Authorization allow={isFieldAllowedToRead(attributes, 'subtype')}>
                  <Column small={12} medium={6} large={3}>
                    <FormField
                      disableTouched={isSaveClicked}
                      fieldAttributes={get(attributes, PlotSearchFieldPaths.SUBTYPE)}
                      name='subtype'
                      overrideValues={{
                        label: PlotSearchFieldTitles.SUBTYPE,
                        options: subTypeOptions,
                        required: true,
                        allowEdit: !isLockedForModifications
                      }}
                      enableUiDataEdit
                      uiDataKey={getUiDataPlotSearchKey('subtype')}
                    />
                  </Column>
                </Authorization>
                <Authorization allow={isFieldAllowedToRead(attributes, 'begin_at')}>
                  <Column small={6} medium={6} large={2}>
                    <FormField
                      disableTouched={isSaveClicked}
                      fieldAttributes={get(attributes, 'begin_at')}
                      name='begin_at'
                      overrideValues={{
                        label: 'Alkupvm ja klo',
                        fieldType: FieldTypeOptions.TIME,
                        allowEdit: !isLockedForModifications
                      }}
                      enableUiDataEdit
                      uiDataKey={getUiDataPlotSearchKey('begin_at')}
                    />
                  </Column>
                </Authorization>
                <Authorization allow={isFieldAllowedToRead(attributes, 'end_at')}>
                  <Column small={6} medium={6} large={2}>
                    <FormField
                      disableTouched={isSaveClicked}
                      fieldAttributes={get(attributes, 'end_at')}
                      name='end_at'
                      overrideValues={{
                        label: 'Loppupvm ja klo',
                        fieldType: FieldTypeOptions.TIME,
                        allowEdit: !isLockedForModifications
                      }}
                      enableUiDataEdit
                      uiDataKey={getUiDataPlotSearchKey('end_at')}
                    />
                  </Column>
                </Authorization>
                <Authorization allow={isFieldAllowedToRead(attributes, 'stage')}>
                  <Column small={12} medium={6} large={2}>
                    <FormField
                      disableTouched={isSaveClicked}
                      fieldAttributes={stageAttributes}
                      name='stage'
                      overrideValues={{
                        label: PlotSearchFieldTitles.STAGE,
                        required: true,
                        allowEdit: canEditStage
                      }}
                    />
                  </Column>
                </Authorization>
                <Authorization allow={isFieldAllowedToRead(attributes, 'decisions')}>
                  <FieldArray
                    component={renderDecisions}
                    attributes={attributes}
                    disabled={false}
                    formName={FormNames.PLOT_SEARCH_BASIC_INFORMATION}
                    name={'decisions'}
                    isSaveClicked={isSaveClicked}
                    usersPermissions={usersPermissions}
                    decisionCandidates={decisionCandidates}
                    hasUnidentifiedDecisions={hasUnidentifiedDecisions}
                  />
                </Authorization>
              </Row>
              {!isLockedForModifications && <WhiteBox>
                <SubTitle>
                  KOHTEET
                </SubTitle>
                <WarningField showWarning={!hasMinimumRequiredFieldsFilled} meta={{
                  warning: "Ole hyvä ja täytä ensin pakolliset perustiedot."
                }} />
                <FieldArray
                  component={renderPlotSearchSites}
                  attributes={attributes}
                  isClicked={isSaveClicked}
                  disabled={!hasMinimumRequiredFieldsFilled}
                  formName={FormNames.PLOT_SEARCH_BASIC_INFORMATION}
                  name={'plot_search_targets'}
                  usersPermissions={usersPermissions}
                  onRemove={this.onTargetRemoved}
                  change={change}
                />
              </WhiteBox>}
              {isLockedForModifications && <PlotSearchTargetListing />}
            </Collapse>
          </Column>
        </Row>
      </form>
    );
  }
}

const formName = FormNames.PLOT_SEARCH_BASIC_INFORMATION;
const selector = formValueSelector(formName);

export default (flowRight(
  connect(
    (state) => {
      return {
        attributes: getAttributes(state),
        usersPermissions: getUsersPermissions(state),
        collapseStateBasic: getCollapseStateByKey(state, `${ViewModes.EDIT}.${formName}.basic`),
        type: selector(state, 'type'),
        isSaveClicked: getIsSaveClicked(state),
        errors: getErrorsByFormName(state, formName),
        plotSearchSubTypes: getPlotSearchSubTypes(state),
        decisionCandidates: getDecisionCandidates(state),
        selectedDecisions: selector(state, 'decisions'),
        targets: selector(state, 'plot_search_targets'),
        hasMinimumRequiredFieldsFilled: hasMinimumRequiredFieldsFilled(state),
        currentPlotSearch: getCurrentPlotSearch(state),
        isLockedForModifications: isLockedForModifications(state),
        stages: getStages(state),
        currentStage: getCurrentPlotSearchStage(state)
      };
    },
    {
      receiveCollapseStates,
      receiveIsSaveClicked,
      receiveFormValidFlags,
      removeTargetDecisions: removePlanUnitDecisions
    }
  ),
  reduxForm({
    form: formName,
    destroyOnUnmount: false,
    change
  }),
)(BasicInfoEdit) : React$AbstractComponent<OwnProps, mixed>);
