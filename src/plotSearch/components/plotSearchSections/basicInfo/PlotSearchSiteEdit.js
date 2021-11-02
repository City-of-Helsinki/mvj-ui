// @flow
import React, {Fragment, type Element, Component} from 'react';
import {connect} from 'react-redux';
import {change, reduxForm, FieldArray, formValueSelector} from 'redux-form';
import {Row, Column} from 'react-foundation';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import flowRight from 'lodash/flowRight';

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
  fetchPlanUnitAttributes,
} from '$src/plotSearch/actions';
import {
  formatDate,
  getFieldOptions,
  getLabelOfOption,
} from '$util/helpers';
import {
  getPlanUnitFromObjectKeys,
} from '$src/plotSearch/helpers';
import {
  getAttributes,
  getIsSaveClicked,
  getCollapseStateByKey,
  getErrorsByFormName,
  getPlanUnitAttributes,
  getPlanUnit,
  getIsFetchingPlanUnit,
  getIsFetchingPlanUnitAttributes,
  getCurrentPlotSearch,
} from '$src/plotSearch/selectors';
import type {Attributes} from '$src/types';
import type {UsersPermissions as UsersPermissionsType} from '$src/usersPermissions/types';
import SuggestedEdit from './SuggestedEdit';

type SuggestedProps = {
  attributes: Attributes,
  disabled: boolean,
  fields: any,
  formName: string,
  isSaveClicked: Boolean,
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

type Props = {
  currentAmountPerArea: number,
  field: any,
  index: any,
  formName: string,
  initialYearRent: number,
  errors: ?Object,
  plotSearchSiteId: number,
  receiveCollapseStates: Function,
  isSaveClicked: boolean,
  attributes: Attributes,
  onRemove: Function,
  onReplace: Function,
  usersPermissions: UsersPermissionsType,
  targetIdentifier: string,
  collapseState: boolean,
  fetchPlanUnitAttributes: Function,
  fetchPlanUnit: Function,
  isFetchingPlanUnitAttributes: boolean,
  isFetchingPlanUnit: boolean,
  planUnitAttributes: Attributes,
  planUnitMap: Object,
  change: Function,
  currentPlotSearch: Object,
}

type State = {
  planUnitNew: Object,
}

class PlotSearchSiteEdit extends Component<Props, State> {

  state = {
    planUnitNew: null,
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
      fetchPlanUnitAttributes,
      fetchPlanUnit
    } = this.props;

    const id = plotSearchSite.plan_unit_id;
    if (!id) {
      // If there's no id, the entry should be a fresh item with no plan unit selected yet
      // (either by the user just clicking the new button, or from loading previously unsaved changes)
      return;
    }

    const payload = {
      value: plotSearchSite.plan_unit_id,
      label: plotSearchSite.plan_unit?.identifier || ''
    };

    this.setState({
      planUnitNew: payload
    });

    if (!planUnitMap[plotSearchSite.plan_unit_id]) {
      fetchPlanUnitAttributes(payload);
      fetchPlanUnit(payload);
    }
  }

  componentDidUpdate(prevProps: Object){
    if (
      [
        'plotSearchSite',
        'planUnitMap',
        'isFetchingPlanUnit',
        'isFetchingPlanUnitAttributes'
      ].some((key) => this.props[key] !== prevProps[key])
    ) {
      this.getPlanUnitData();
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

    const planUnit = planUnitMap[plotSearchSite.plan_unit_id];

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
        value: plotSearchSite.plan_unit_id
      };

      fetchPlanUnitAttributes(payload);
      fetchPlanUnit(payload);
    }
  }

  handleNew = (toPlotSearch: Object) => {
    const {
      fetchPlanUnitAttributes,
      fetchPlanUnit,
    } = this.props;

    this.setState({
      planUnitNew: toPlotSearch,
    });
    this.changePlanUnitValue(toPlotSearch);
    fetchPlanUnitAttributes(toPlotSearch);
    fetchPlanUnit(toPlotSearch);
  }

  changePlanUnitValue = (toPlotSearch: Object) => {
    const {
      change,
      field,
      plotSearchSite,
      planUnitMap,
      onReplace
    } = this.props;

    const planUnitOldValue = plotSearchSite?.plan_unit?.id;
    const planUnitNewValue = get(toPlotSearch, 'value');

    if (planUnitOldValue !== planUnitNewValue) {
      const plan_unit = planUnitMap[planUnitNewValue];

      change(`${field}.plan_unit`, plan_unit);
      change(`${field}.plan_unit_id`, planUnitNewValue);
      onReplace(planUnitOldValue, planUnitNewValue);
    }
  }

  updatePlanUnit = () => {
    const {
      currentPlotSearch,
      index,
      fetchPlanUnitAttributes,
      fetchPlanUnit,
      planUnitMap,
      field,
      change,
    } = this.props;

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
    fetchPlanUnitAttributes(payload);
    fetchPlanUnit(payload);

    const planUnitNewValue = get(toPlotSearch, 'value');
    if (masterPlanUnitId?.value && masterPlanUnitId.value !== planUnitNewValue) {
      onReplace(planUnitNew.value, planUnitNewValue);
    }
    change(`${field}.plan_unit_id`, masterPlanUnitId);
  }

  render(){
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
      planUnitAttributes,
      currentPlotSearch,
      index,
      disabled
    } = this.props;
    const {
      planUnitNew,
    } = this.state;

    const plotSearchSiteErrors = get(errors, field);
    const planUnitNewValue = get(planUnitNew, 'value');
    const planUnitByValue = get(planUnitMap, planUnitNewValue);
    const planUnitAttributesByValue = get(planUnitAttributes, planUnitNewValue);
    const planUnitIntendedUseOptions = getFieldOptions(planUnitAttributesByValue, 'plan_unit_intended_use');
    const planUnitStateOptions = getFieldOptions(planUnitAttributesByValue, 'plan_unit_state');
    const planUnitTypeOptions = getFieldOptions(planUnitAttributesByValue, 'plan_unit_type');
    const plotDivisionStateOptions = getFieldOptions(planUnitAttributesByValue, 'plot_division_state');

    const currentTarget = currentPlotSearch.plot_search_targets[index];
    const isDeleted = get(currentTarget, 'is_master_plan_unit_deleted');
    const isNewer = get(currentTarget, 'is_master_plan_unit_newer');
    const label = get(currentTarget, 'message_label');

    const planUnitTitle = !!get(planUnitNew, 'label') ? `${get(planUnitNew, 'label') || ''} ${get(planUnitByValue, 'plan_unit_status') || ''}` : 'Uusi kohde';

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
            <a onClick={this.updatePlanUnit}>
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
          <Column small={6} medium={3} large={3}>
            <FormTextTitle>
              {'Kohteen tunnus'}
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
            </div>
            <FormTextTitle>
              {'Kohteen tyyppi'}
            </FormTextTitle>
            <FormField
              disableTouched={isSaveClicked}
              invisibleLabel={true}
              fieldAttributes={get(attributes, 'plot_search_targets.child.children.target_type')}
              name={`${field}.target_type`}
              disabled={disabled}
            />
            {(isFetchingPlanUnitAttributes || isFetchingPlanUnit) &&
              <LoaderWrapper className='relative-overlay-wrapper'><Loader isLoading={true} /></LoaderWrapper>
            }
          </Column>
          {(planUnitByValue) && <Fragment>
            <Column small={6} medium={4} large={2}>
              <FormTextTitle>
                {'Kaavayksikön käyttötarkoitus'}
              </FormTextTitle>
              <FormText>{planUnitByValue && getLabelOfOption(planUnitIntendedUseOptions, planUnitByValue.plan_unit_intended_use) || '-'}</FormText>
            </Column>
            <Column small={6} medium={3} large={2}>
              <FormTextTitle>
                {'Kokonaisala neliömetreissä'}
              </FormTextTitle>
              <FormText>
                {`${get(planUnitByValue, 'area')} m²` || '-'}
              </FormText>
            </Column>
            <Column small={6} medium={3} large={2}>
              <FormTextTitle>
                {'Asemakaava'}
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
                {'Asemakaavan viimeisin käsittelypvm'}
              </FormTextTitle>
              <FormText>
                {formatDate(get(planUnitByValue, 'detailed_plan_latest_processing_date')) || '-'}
              </FormText>
            </Column>
            <Column small={6} medium={4} large={3}>
              <FormTextTitle>
                {'Asemakaavan viimeisin käsittelypvm. selite'}
              </FormTextTitle>
              <FormText>
                {get(planUnitByValue, 'detailed_plan_latest_processing_date_note') || '-'}
              </FormText>
            </Column>
            <Column small={6} medium={4} large={2}>
              <FormTextTitle>
                {'Sopimushetkellä'}
              </FormTextTitle>
              <FormText>
                {get(planUnitByValue, 'in_contract') || '-'}
              </FormText>
            </Column>
            <Column small={6} medium={4} large={2}>
              <FormTextTitle>
                {'Kaavayksikön olotila'}
              </FormTextTitle>
              <FormText>{planUnitByValue && getLabelOfOption(planUnitStateOptions, planUnitByValue.plan_unit_state) || '-'}</FormText>
            </Column>
            <Column small={6} medium={4} large={2}>
              <FormTextTitle>
                {'Kaavayksikön laji'}
              </FormTextTitle>
              <FormText>{planUnitByValue && getLabelOfOption(planUnitTypeOptions, planUnitByValue.plan_unit_type) || '-'}</FormText>
            </Column>
            <Column small={6} medium={4} large={2}>
              <FormTextTitle>
                {'Tonttijaon hyväksymispvm'}
              </FormTextTitle>
              <FormText>
                {formatDate(get(planUnitByValue, 'plot_division_date_of_approval')) || '-'}
              </FormText>
            </Column>
            <Column small={6} medium={4} large={3}>
              <FormTextTitle>
                {'Tonttijaon voimaantulopvm'}
              </FormTextTitle>
              <FormText>
                {formatDate(get(planUnitByValue, 'plot_division_effective_date')) || '-'}
              </FormText>
            </Column>
            <Column small={6} medium={4} large={2}>
              <FormTextTitle>
                {'Tonttijaon tunnus'}
              </FormTextTitle>
              <FormText>
                {get(planUnitByValue, 'plot_division_identifier') || '-'}
              </FormText>
            </Column>
            <Column small={6} medium={4} large={2}>
              <FormTextTitle>
                {'Tonttijaon olotila'}
              </FormTextTitle>
              <FormText>{planUnitByValue && getLabelOfOption(plotDivisionStateOptions, planUnitByValue.plot_division_state) || '-'}</FormText>
            </Column>
            <Column small={6} medium={4} large={2}>
              <FormTextTitle>
                {'Leikkausala'}
              </FormTextTitle>
              <FormText>
                {`${get(planUnitByValue, 'section_area')} m²` || '-'}
              </FormText>
            </Column>
            <FieldArray
              component={renderSuggested}
              attributes={attributes}
              isClicked={isSaveClicked}
              disabled={true}
              formName={FormNames.PLOT_SEARCH_BASIC_INFORMATION}
              name={`${field}.suggested`}
            />
          </Fragment>}
        </Row>
      </Collapse>
    );
  }
}


export default flowRight(
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
        planUnitAttributes: getPlanUnitAttributes(state),
        planUnitMap: planUnitMap,
        isFetchingPlanUnit: getIsFetchingPlanUnit(state, planUnitId),
        isFetchingPlanUnitAttributes: getIsFetchingPlanUnitAttributes(state, planUnitId),
        currentPlotSearch: getCurrentPlotSearch(state),
      };
    },
    {
      receiveCollapseStates,
      receiveIsSaveClicked,
      fetchPlanUnit,
      fetchPlanUnitAttributes,
    }
  ),
)(PlotSearchSiteEdit);
