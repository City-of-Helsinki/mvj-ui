// @flow
import React, {Fragment, type Element, Component} from 'react';
import {connect} from 'react-redux';
import {FieldArray, formValueSelector} from 'redux-form';
import {Row, Column} from 'react-foundation';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import flowRight from 'lodash/flowRight';
import type {Fields} from 'redux-form/lib/FieldArrayProps.types';

import Loader from '$components/loader/Loader';
import ExternalLink from '$components/links/ExternalLink';
import LoaderWrapper from '$components/loader/LoaderWrapper';
import PlanUnitSelectInput from '$components/inputs/PlanUnitSelectInput';
import {ActionTypes, AppConsumer} from '$src/app/AppContext';
import AddButtonThird from '$components/form/AddButtonThird';
import {ButtonColors} from '$components/enums';
import {ConfirmationModalTexts} from '$src/enums';
import Collapse from '$components/collapse/Collapse';
import FormField from '$components/form/FormField';
import {FormNames, ViewModes} from '$src/enums';
import FormText from '$components/form/FormText';
import FormTextTitle from '$components/form/FormTextTitle';
import {getUsersPermissions} from '$src/usersPermissions/selectors';
import WarningContainer from '$components/content/WarningContainer';
import WarningField from '$components/form/WarningField';
import {createPaikkatietovipunenUrl} from '$util/helpers';
import {
  receiveCollapseStates,
  receiveIsSaveClicked,
  fetchPlanUnit,
  fetchCustomDetailedPlan,
} from '$src/plotSearch/actions';
import {
  PlotSearchFieldTitles,
  TargetIdentifierTypes,
} from '$src/plotSearch/enums';
import {
  formatDate,
  getFieldOptions,
  getLabelOfOption,
} from '$util/helpers';
import {
  areTargetsAllowedToHaveType,
  getAttributes,
  getIsSaveClicked,
  getCollapseStateByKey,
  getErrorsByFormName,
  getPlanUnitAttributes,
  getPlanUnit,
  getCustomDetailedPlan,
  getCustomDetailedPlanAttributes,
  getIsFetchingCustomDetailedPlanAttributes,
  getIsFetchingCustomDetailedPlan,
  getIsFetchingPlanUnit,
  getIsFetchingPlanUnitAttributes,
  getCurrentPlotSearch,
} from '$src/plotSearch/selectors';
import type {Attributes} from '$src/types';
import type {UsersPermissions as UsersPermissionsType} from '$src/usersPermissions/types';
import SuggestedEdit from '$src/plotSearch/components/plotSearchSections/basicInfo/SuggestedEdit';
import RemoveButton from '$src/components/form/RemoveButton';
import PlotSearchSiteEditCustomDetailedPlan from '$src/plotSearch/components/plotSearchSections/basicInfo/PlotSearchSiteEditCustomDetailedPlan';


type SuggestedProps = {
  attributes: Attributes,
  disabled: boolean,
  fields: Fields,
  formName: string,
  isSaveClicked: boolean,
}

const renderSuggested = ({
  disabled,
  fields,
  formName,
  attributes,
  isSaveClicked,
}: SuggestedProps): Element<*> => {
  const handleAdd = () => {
    fields.push({});
  };
  return (
    <AppConsumer>
      {({dispatch}) => {
        return(
          <Fragment>
            <Column>
              {fields && !!fields.length &&
                <Row>
                  <Column large={7}>
                    <FormTextTitle>
                      {'Ehdotettu varauksensaaja'}
                    </FormTextTitle>
                  </Column>
                  <Column large={4}>
                    <FormTextTitle>
                      {'Osuus'}
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
                    confirmationModalButtonText: ConfirmationModalTexts.DELETE_SUGGESTION.BUTTON,
                    confirmationModalLabel: ConfirmationModalTexts.DELETE_SUGGESTION.LABEL,
                    confirmationModalTitle: ConfirmationModalTexts.DELETE_SUGGESTION.TITLE,
                  });
                };
                return <SuggestedEdit
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
                      label='Lisää ehdotus'
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

type InfoLinksProps = {
  disabled: boolean,
  fields: any,
  attributes: Object,
  isSaveClicked: boolean,
}

const renderInfoLinks = ({
  disabled,
  fields,
  attributes,
  isSaveClicked,
}: InfoLinksProps): Element<*> => {
  const handleAdd = () => {
    fields.push({});
  };

  return (
    <AppConsumer>
      {({dispatch}) => {
        return <div>
          <FormTextTitle>
            Lisätietolinkit
          </FormTextTitle>
          <div role="table">
            <Row>
              <Column small={4} medium={4} large={4} role="columnheader">
                <FormTextTitle>
                  {PlotSearchFieldTitles.INFO_LINK_DESCRIPTION}
                </FormTextTitle>
              </Column>
              <Column small={5} medium={5} large={5} role="columnheader">
                <FormTextTitle>
                  {PlotSearchFieldTitles.INFO_LINK_URL}
                </FormTextTitle>
              </Column>
              <Column small={2} medium={2} large={2} role="columnheader">
                <FormTextTitle>
                  {PlotSearchFieldTitles.INFO_LINK_LANGUAGE}
                </FormTextTitle>
              </Column>
              <Column small={1} medium={1} large={1} />
            </Row>
            {!!fields.length && fields.map((field, index) => {
              const handleRemove = () => {
                dispatch({
                  type: ActionTypes.SHOW_CONFIRMATION_MODAL,
                  confirmationFunction: () => {
                    fields.remove(index);
                  },
                  confirmationModalButtonClassName: ButtonColors.ALERT,
                  confirmationModalButtonText: ConfirmationModalTexts.DELETE_INFO_LINK.BUTTON,
                  confirmationModalLabel: ConfirmationModalTexts.DELETE_INFO_LINK.LABEL,
                  confirmationModalTitle: ConfirmationModalTexts.DELETE_INFO_LINK.TITLE,
                });
              };

              return <Row role="row" key={index}>
                <Column role="cell" small={4} medium={4} large={4}>
                  <FormField
                    fieldAttributes={get(attributes, 'plot_search_targets.child.children.info_links.child.children.description')}
                    name={`${field}.description`}
                    invisibleLabel
                    overrideValues={{
                      label: PlotSearchFieldTitles.INFO_LINK_DESCRIPTION,
                    }}
                    disabled={disabled}
                    disableTouched={isSaveClicked}
                  />
                </Column>
                <Column role="cell" small={5} medium={5} large={5}>
                  <FormField
                    fieldAttributes={get(attributes, 'plot_search_targets.child.children.info_links.child.children.url')}
                    name={`${field}.url`}
                    invisibleLabel
                    overrideValues={{
                      label: PlotSearchFieldTitles.INFO_LINK_URL,
                    }}
                    disabled={disabled}
                    disableTouched={isSaveClicked}
                  />
                </Column>
                <Column role="cell" small={2} medium={2} large={2}>
                  <FormField
                    fieldAttributes={get(attributes, 'plot_search_targets.child.children.info_links.child.children.language')}
                    name={`${field}.language`}
                    invisibleLabel
                    overrideValues={{
                      label: PlotSearchFieldTitles.INFO_LINK_LANGUAGE,
                    }}
                    disabled={disabled}
                    disableTouched={isSaveClicked}
                  />
                </Column>
                <Column role="cell" small={1} medium={1} large={1}>
                  <RemoveButton
                    className='third-level'
                    onClick={(...rest) => handleRemove(index, ...rest)}
                    style={{height: 'unset'}}
                    title='Poista lisätietolinkki'
                    disabled={disabled}
                  />
                </Column>
              </Row>;
            })}
            {!disabled &&
            <Row>
              <Column>
                <AddButtonThird
                  label='Lisää lisätietolinkki'
                  onClick={handleAdd}
                />
              </Column>
            </Row>
            }
          </div>
        </div>;
      }}
    </AppConsumer>);
};

type OwnProps = {
  index: any,
  disabled: boolean,
  field: any,
  form: string,
  formName: string,
  change: Function,
  onRemove: Function,
  onReplace: Function,
}

type Props = {
  ...OwnProps,
  currentAmountPerArea: number,
  initialYearRent: number,
  errors: ?Object,
  plotSearchSiteId: number,
  receiveCollapseStates: Function,
  isSaveClicked: boolean,
  attributes: Attributes,
  usersPermissions: UsersPermissionsType,
  targetIdentifier: string,
  collapseState: boolean,
  fetchPlanUnit: Function,
  fetchCustomDetailedPlan: Function,
  isFetchingPlanUnitAttributes: boolean,
  isFetchingPlanUnit: boolean,
  isFetchingCustomDetailedPlan: boolean,
  isFetchingCustomDetailedPlanAttributes: boolean,
  planUnitAttributes: Attributes,
  planUnitMap: Object,
  customDetailedPlanAttributes: Attributes,
  customDetailedPlanMap: Object,
  plotSearchSite: Object,
  currentPlotSearch: Object,
  areTargetsAllowedToHaveType: boolean
}

type State = {
  planUnitNew: Object,
  customDetailedPlanNew: Object,
}

class PlotSearchSiteEdit extends Component<Props, State> {

  state = {
    planUnitNew: null,
    customDetailedPlanNew: null,
  };

  handleCollapseToggle = (val: boolean) => {
    const {
      plotSearchSiteId,
      receiveCollapseStates,
    } = this.props;
    receiveCollapseStates({
      [ViewModes.EDIT]: {
        [FormNames.PLOT_SEARCH_BASIC_INFORMATION]: {
          plotSearch_site: {
            [plotSearchSiteId]: val,
          },
        },
      },
    });
  };

  componentDidMount() {
    this.initializeState();
  }

  initializeState() {
    const {
      plotSearchSite,
      planUnitMap,
      customDetailedPlanMap,
      fetchPlanUnit,
      fetchCustomDetailedPlan,
    } = this.props;

    const planUnitId = plotSearchSite.plan_unit_id;
    const customDetailedPlanId = plotSearchSite.custom_detailed_plan_id;
    if (!planUnitId && !customDetailedPlanId) {
      // If there's no id, the entry should be a fresh item with no plan unit selected yet
      // (either by the user just clicking the new button, or from loading previously unsaved changes)
      return;
    }

    const planUnitPayload = {
      value: planUnitId,
      label: plotSearchSite.plan_unit?.identifier || '',
    };

    const customDetailedPlanPayload = {
      value: customDetailedPlanId,
      label: plotSearchSite.custom_detailed_plan?.identifier || '',
    };

    this.setState({
      planUnitNew: planUnitPayload,
      customDetailedPlanNew: customDetailedPlanPayload,
    });

    if (get(plotSearchSite, 'plan_unit_id') && !get(planUnitMap, planUnitId)) {
      fetchPlanUnit(planUnitPayload);
    }

    if (get(plotSearchSite, 'custom_detailed_plan_id') && !get(customDetailedPlanMap, customDetailedPlanId)) {
      fetchCustomDetailedPlan(customDetailedPlanPayload);
    }
  }

  componentDidUpdate(prevProps: Object){
    if (
      [
        'plotSearchSite',
        'planUnitMap',
        'customDetailedPlanMap',
        'isFetchingPlanUnit',
        'isFetchingPlanUnitAttributes',
        'isFetchingCustomDetailedPlan',
        'isFetchingCustomDetailedPlanAttributes',
      ].some((key) => this.props[key] !== prevProps[key])
    ) {
      this.getPlanUnitData();
      this.getCustomDetailedPlanData();
    }
  }

  getPlanUnitData() {
    const {
      planUnitMap,
      plotSearchSite,
    } = this.props;

    if (!plotSearchSite) {
      return;
    }

    const planUnit = get(planUnitMap, plotSearchSite.plan_unit_id);

    if (planUnit) {
      const payload = {
        value: planUnit.id,
        label: planUnit.identifier,
      };
      this.setState({
        planUnitNew: payload,
      });
      this.changePlanUnitValue(payload);
    } else {
      const payload = {
        value: plotSearchSite.plan_unit_id,
      };

      fetchPlanUnit(payload);
    }
  }

  getCustomDetailedPlanData() {
    const {
      customDetailedPlanMap,
      plotSearchSite,
    } = this.props;

    if (!plotSearchSite) {
      return;
    }

    const customDetailedPlan = get(customDetailedPlanMap, plotSearchSite.custom_detailed_plan_id);

    if (customDetailedPlan) {
      const payload = {
        value: plotSearchSite.custom_detailed_plan_id,
        label: customDetailedPlan.identifier,
      };
      this.setState({
        customDetailedPlanNew: payload,
      });
      this.changeCustomDetailedPlanValue(payload);
    } else {
      const payload = {
        value: plotSearchSite.custom_detailed_plan_id,
        label: 'Oma muu alue',
      };

      fetchCustomDetailedPlan(payload);
    }
  }

  handleNew = (toPlotSearch: Object) => {
    const {
      fetchPlanUnit,
      fetchCustomDetailedPlan,
    } = this.props;

    if (toPlotSearch && toPlotSearch.identifierType === TargetIdentifierTypes.PLAN_UNIT) {
      this.setState({
        planUnitNew: toPlotSearch,
        customDetailedPlanNew: null,
      });

      fetchPlanUnit(toPlotSearch);
      this.changePlanUnitValue(toPlotSearch);
    } else {
      this.setState({
        customDetailedPlanNew: toPlotSearch,
        planUnitNew: null,
      });

      fetchCustomDetailedPlan(toPlotSearch);
      this.changeCustomDetailedPlanValue(toPlotSearch);
    }
  }

  changePlanUnitValue = (toPlotSearch: Object) => {
    const {
      change,
      field,
      plotSearchSite,
      planUnitMap,
      onReplace,
    } = this.props;

    const planUnitOldValue = plotSearchSite?.plan_unit_id;
    const planUnitNewValue = get(toPlotSearch, 'value');

    if (planUnitOldValue !== planUnitNewValue) {
      const plan_unit = planUnitMap[planUnitNewValue];

      change(`${field}.plan_unit`, plan_unit);
      change(`${field}.plan_unit_id`, planUnitNewValue);
      change(`${field}.custom_detailed_plan`, null);
      change(`${field}.custom_detailed_plan_id`, null);
      onReplace(planUnitOldValue);
    }
  }

  changeCustomDetailedPlanValue = (toPlotSearch: Object) => {
    const {
      change,
      field,
      plotSearchSite,
      customDetailedPlanMap,
      onReplace,
    } = this.props;

    const customDetailedPlanOldValue = plotSearchSite?.custom_detailed_plan_id;
    const customDetailedPlanNewValue = get(toPlotSearch, 'value');

    if (customDetailedPlanOldValue !== customDetailedPlanNewValue) {
      const customDetailedPlan = get(customDetailedPlanMap, customDetailedPlanNewValue);

      change(`${field}.custom_detailed_plan`, customDetailedPlan);
      change(`${field}.custom_detailed_plan_id`, customDetailedPlanNewValue);
      change(`${field}.plan_unit`, null);
      change(`${field}.plan_unit_id`, null);
      onReplace(customDetailedPlanOldValue, customDetailedPlanNewValue);
    }
  }

  updatePlanUnit = (toPlotSearch: Object) => {
    const {
      currentPlotSearch,
      index,
      fetchPlanUnit,
      planUnitMap,
      field,
      change,
      onReplace,
    } = this.props;

    const {planUnitNew} = this.state;

    const currentTarget = currentPlotSearch.plot_search_targets[index];
    const masterPlanUnitId = get(currentTarget, 'master_plan_unit_id');
    const planUnit = planUnitMap[masterPlanUnitId];
    const payload = {
      value: masterPlanUnitId,
      label: (planUnit) ? planUnit.identifier : '',
    };
    this.setState({
      planUnitNew: payload,
    });
    fetchPlanUnit(payload);

    const planUnitNewValue = get(toPlotSearch, 'value');
    if (masterPlanUnitId?.value && masterPlanUnitId.value !== planUnitNewValue) {
      onReplace(planUnitNew.value, planUnitNewValue);
    }
    change(`${field}.plan_unit_id`, masterPlanUnitId);
  }

  render() {
    const {
      field,
      isSaveClicked,
      collapseState,
      errors,
      attributes,
      onRemove,
      isFetchingPlanUnitAttributes,
      isFetchingPlanUnit,
      planUnitMap,
      customDetailedPlanMap,
      planUnitAttributes,
      customDetailedPlanAttributes,
      currentPlotSearch,
      index,
      disabled,
      areTargetsAllowedToHaveType,
      isFetchingCustomDetailedPlanAttributes,
      isFetchingCustomDetailedPlan,
    } = this.props;

    const {
      planUnitNew,
      customDetailedPlanNew,
    } = this.state;

    const plotSearchSiteErrors = get(errors, field);
    const planUnitNewValue = get(planUnitNew, 'value');
    const planUnitByValue = get(planUnitMap, planUnitNewValue);
    const planUnitIntendedUseOptions = getFieldOptions(planUnitAttributes, 'plan_unit_intended_use');
    const planUnitStateOptions = getFieldOptions(planUnitAttributes, 'plan_unit_state');
    const planUnitTypeOptions = getFieldOptions(planUnitAttributes, 'plan_unit_type');
    const plotDivisionStateOptions = getFieldOptions(planUnitAttributes, 'plot_division_state');

    const customDetailedPlanNewValue = get(customDetailedPlanNew, 'value');
    const customDetailedPlanByValue = get(customDetailedPlanMap, customDetailedPlanNewValue);

    const currentTarget = currentPlotSearch.plot_search_targets[index];
    const isDeleted = get(currentTarget, 'is_master_plan_unit_deleted');
    const isNewer = get(currentTarget, 'is_master_plan_unit_newer');
    const label = get(currentTarget, 'message_label');

    const planUnitTitle = get(planUnitNew, 'label') ? `${get(planUnitNew, 'label') || ''} ${get(planUnitByValue, 'plan_unit_status') || ''}` : 'Uusi kohde';

    if (customDetailedPlanByValue) {
      return <PlotSearchSiteEditCustomDetailedPlan
        handleNew={this.handleNew}
        field={field}
        isSaveClicked={isSaveClicked}
        areTargetsAllowedToHaveType={areTargetsAllowedToHaveType}
        attributes={attributes}
        collapseState={collapseState}
        onRemove={onRemove}
        currentTarget={customDetailedPlanByValue}
        customDetailedPlanNew={customDetailedPlanNew}
        disabled={disabled}
        handleCollapseToggle={this.handleCollapseToggle}
        plotSearchSiteErrors={plotSearchSiteErrors}
        customDetailedPlanAttributes={customDetailedPlanAttributes}
        isFetchingCustomDetailedPlan={isFetchingCustomDetailedPlan}
        isFetchingCustomDetailedPlanAttributes={isFetchingCustomDetailedPlanAttributes}
      />;
    }
    return (
      <Collapse
        className='collapse__secondary greenCollapse'
        defaultOpen={collapseState !== undefined ? collapseState : true}
        headerTitle={planUnitTitle}
        onRemove={!disabled ? onRemove : null}
        hasErrors={isSaveClicked && !isEmpty(plotSearchSiteErrors)}
        onToggle={this.handleCollapseToggle}
      >
        <Row style={{marginBottom: 10}}>
          {(isNewer) && <WarningContainer style={{marginLeft: 5, marginTop: 1, marginBottom: 1}}> {/* style={{position: 'absolute', right: '35px', top: '-5px'}}> */}
            <a onClick={() => this.updatePlanUnit(currentTarget)}>
              <WarningField
                meta={{warning: label + ' Päivitä tiedot'}}
                showWarning={(isDeleted || isNewer)}
              />
            </a>
          </WarningContainer>}
          {(isDeleted) && <WarningContainer style={{marginLeft: 5, marginTop: 1, marginBottom: 1}}> {/* style={{position: 'absolute', right: '35px', top: '-5px'}}> */}
            <a onClick={onRemove}>
              <WarningField
                meta={{warning: label + ' Poista kohde hausta'}}
                showWarning={(isDeleted || isNewer)}
              />
            </a>
          </WarningContainer>}
          {(isDeleted || isNewer) && <Column small={12} medium={12} large={12} />}
          <Column small={12} medium={12} large={2}>
            <Row>
              <Column small={6} medium={6} large={12}>
                <FormTextTitle>
                  {PlotSearchFieldTitles.TARGET_IDENTIFIER}
                </FormTextTitle>
                <PlanUnitSelectInput
                  value={planUnitNew}
                  onChange={this.handleNew}
                  disabled={disabled}
                  name={`plan-unit`}
                />
                <div style={{display: 'none'}}>
                  <FormField
                    disableTouched={isSaveClicked}
                    fieldAttributes={get(attributes, 'plot_search_targets.child.children.plan_unit_id')}
                    name={`${field}.plan_unit_id`}
                  />
                  <FormField
                    disableTouched={isSaveClicked}
                    fieldAttributes={get(attributes, 'plot_search_targets.child.children.custom_detailed_plan_id')}
                    name={`${field}.custom_detailed_plan_id`}
                  />
                </div>
                {areTargetsAllowedToHaveType && <>
                  <FormTextTitle>
                    {PlotSearchFieldTitles.TARGET_TYPE}
                  </FormTextTitle>
                  <FormField
                    disableTouched={isSaveClicked}
                    invisibleLabel={true}
                    fieldAttributes={get(attributes, 'plot_search_targets.child.children.target_type')}
                    name={`${field}.target_type`}
                    disabled={disabled}
                  />
                </>}
                {(isFetchingPlanUnitAttributes || isFetchingPlanUnit) &&
                  <LoaderWrapper className='relative-overlay-wrapper'><Loader isLoading={true} /></LoaderWrapper>
                }
              </Column>
            </Row>
          </Column>
          <Column small={12} medium={12} large={10}>
            <Row>
              {(planUnitByValue) && <Fragment>
                <Column small={6} medium={4} large={6}>
                  <FormTextTitle>
                    {PlotSearchFieldTitles.PLAN_UNIT_INTENDED_USE}
                  </FormTextTitle>
                  <FormText>{planUnitByValue && getLabelOfOption(planUnitIntendedUseOptions, planUnitByValue.plan_unit_intended_use) || '-'}</FormText>
                </Column>
                <Column small={6} medium={8} large={6} />

                <Column small={6} medium={4} large={3}>
                  <FormTextTitle>
                    {PlotSearchFieldTitles.DETAILED_PLAN}
                  </FormTextTitle>
                  {planUnitByValue
                    ? <ExternalLink
                      href={createPaikkatietovipunenUrl(`helreport/planpdfloader/?id=${get(planUnitByValue, 'detailed_plan_identifier')}`)}
                      text={get(planUnitByValue, 'detailed_plan_identifier')}
                    />
                    : <FormText>-</FormText>
                  }
                </Column>
                <Column small={6} medium={4} large={3}>
                  <FormTextTitle>
                    {PlotSearchFieldTitles.PLAN_UNIT_STATE}
                  </FormTextTitle>
                  <FormText>{planUnitByValue && getLabelOfOption(planUnitStateOptions, planUnitByValue.plan_unit_state) || '-'}</FormText>
                </Column>
                <Column small={6} medium={4} large={3}>
                  <FormTextTitle>
                    {PlotSearchFieldTitles.AREA}
                  </FormTextTitle>
                  <FormText>
                    {get(planUnitByValue, 'area') ? `${get(planUnitByValue, 'area')} m²` : '-'}
                  </FormText>
                </Column>
                <Column small={6} medium={4} large={3}>
                  <FormTextTitle>
                    {PlotSearchFieldTitles.SECTION_AREA}
                  </FormTextTitle>
                  <FormText>
                    {get(planUnitByValue, 'section_area') ? `${get(planUnitByValue, 'section_area')} m²` : '-'}
                  </FormText>
                </Column>
                <Column small={6} medium={4} large={6}>
                  <FormTextTitle>
                    {PlotSearchFieldTitles.DETAILED_PLAN_LATEST_PROCESSING_DATE}
                  </FormTextTitle>
                  <FormText>
                    {formatDate(get(planUnitByValue, 'detailed_plan_latest_processing_date')) || '-'}
                  </FormText>
                </Column>
                <Column small={6} medium={4} large={6}>
                  <FormTextTitle>
                    {PlotSearchFieldTitles.DETAILED_PLAN_LATEST_PROCESSING_DATE_NOTE}
                  </FormTextTitle>
                  <FormText>
                    {get(planUnitByValue, 'detailed_plan_latest_processing_date_note') || '-'}
                  </FormText>
                </Column>
                <Column small={6} medium={4} large={4}>
                  <FormTextTitle>
                    {PlotSearchFieldTitles.IN_CONTRACT}
                  </FormTextTitle>
                  <FormText>
                    {get(planUnitByValue, 'in_contract') || '-'}
                  </FormText>
                </Column>
                <Column small={6} medium={4} large={4}>
                  <FormTextTitle>
                    {PlotSearchFieldTitles.PLAN_UNIT_TYPE}
                  </FormTextTitle>
                  <FormText>{planUnitByValue && getLabelOfOption(planUnitTypeOptions, planUnitByValue.plan_unit_type) || '-'}</FormText>
                </Column>
                <Column small={6} medium={4} large={4}>
                  <FormTextTitle>
                    {PlotSearchFieldTitles.PLOT_DIVISION_DATE_OF_APPROVAL}
                  </FormTextTitle>
                  <FormText>
                    {formatDate(get(planUnitByValue, 'plot_division_date_of_approval')) || '-'}
                  </FormText>
                </Column>
                <Column small={6} medium={4} large={4}>
                  <FormTextTitle>
                    {PlotSearchFieldTitles.PLOT_DIVISION_EFFECTIVE_DATE}
                  </FormTextTitle>
                  <FormText>
                    {formatDate(get(planUnitByValue, 'plot_division_effective_date')) || '-'}
                  </FormText>
                </Column>
                <Column small={6} medium={4} large={4}>
                  <FormTextTitle>
                    {PlotSearchFieldTitles.PLOT_DIVISION_IDENTIFIER}
                  </FormTextTitle>
                  <FormText>
                    {get(planUnitByValue, 'plot_division_identifier') || '-'}
                  </FormText>
                </Column>
                <Column small={6} medium={4} large={4}>
                  <FormTextTitle>
                    {PlotSearchFieldTitles.PLOT_DIVISION_STATE}
                  </FormTextTitle>
                  <FormText>{planUnitByValue && getLabelOfOption(plotDivisionStateOptions, planUnitByValue.plot_division_state) || '-'}</FormText>
                </Column>
                <Column small={12} medium={12} large={12}>
                  <FieldArray
                    component={renderInfoLinks}
                    attributes={attributes}
                    isSaveClicked={isSaveClicked}
                    disabled={disabled}
                    formName={FormNames.PLOT_SEARCH_BASIC_INFORMATION}
                    name={`${field}.info_links`}
                  />
                </Column>
                <FieldArray
                  component={renderSuggested}
                  attributes={attributes}
                  isSaveClicked={isSaveClicked}
                  disabled={true}
                  formName={FormNames.PLOT_SEARCH_BASIC_INFORMATION}
                  name={`${field}.suggested`}
                />
              </Fragment>}
            </Row>
          </Column>
        </Row>
      </Collapse>
    );
  }
}


export default (flowRight(
  connect(
    (state, props: Props) => {
      const formName = props.formName;
      const selector = formValueSelector(formName);

      const plotSearchSite = selector(state, props.field);

      // plotSearchSite can be momentarily undefined after a target has been removed and its corresponding
      // component has not yet been unmounted.
      const id = plotSearchSite?.id;
      const planUnitId = plotSearchSite?.plan_unit_id;

      const planUnitMap = getPlanUnit(state);
      const customDetailedPlanMap = getCustomDetailedPlan(state);
      const customDetailedPlanId = plotSearchSite?.custom_detailed_plan_id;
      return {
        attributes: getAttributes(state),
        isSaveClicked: getIsSaveClicked(state),
        collapseState: getCollapseStateByKey(state, `${ViewModes.EDIT}.${FormNames.PLOT_SEARCH_BASIC_INFORMATION}.target.${id}`),
        plotSearchSite: plotSearchSite,
        type: selector(state, `${props.field}.type`),
        targetIdentifier: selector(state, `${props.field}.target_identifier`),
        decisionToList: selector(state, `${props.field}.decision_to_list`),
        usersPermissions: getUsersPermissions(state),
        errors: getErrorsByFormName(state, formName),
        plotSearchSiteId: id,
        planUnitMap: planUnitMap,
        customDetailedPlanMap: customDetailedPlanMap,
        planUnitAttributes: getPlanUnitAttributes(state),
        customDetailedPlanAttributes: getCustomDetailedPlanAttributes(state),
        isFetchingCustomDetailedPlanAttributes: getIsFetchingCustomDetailedPlanAttributes(state, customDetailedPlanId),
        isFetchingCustomDetailedPlan: getIsFetchingCustomDetailedPlan(state, customDetailedPlanId),
        isFetchingPlanUnit: getIsFetchingPlanUnit(state, planUnitId),
        isFetchingPlanUnitAttributes: getIsFetchingPlanUnitAttributes(state, planUnitId),
        currentPlotSearch: getCurrentPlotSearch(state),
        areTargetsAllowedToHaveType: areTargetsAllowedToHaveType(state),
      };
    },
    {
      receiveCollapseStates,
      receiveIsSaveClicked,
      fetchPlanUnit,
      fetchCustomDetailedPlan,
    }
  ),
)(PlotSearchSiteEdit): React$ComponentType<OwnProps>);
