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
  planUnit: Object,
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

  componentDidMount(){
    this.getPlanUnitData();
  }

  componentDidUpdate(prevProps: Object){
    if(this.props.planUnit !== prevProps.planUnit){
      this.getPlanUnitData();
    }
  }

  getPlanUnitData(){
    const {
      planUnit,
      index,
    } = this.props;
    const plan_unit = getPlanUnitFromObjectKeys(planUnit, index);
    if(plan_unit){
      const payload = {
        value: plan_unit.id,
        label: plan_unit.identifier,
      };
      this.setState({
        planUnitNew: payload,
      });
      this.changePlanUnitValue(payload);
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
      onReplace
    } = this.props;

    const {
      planUnitNew
    } = this.state;

    const planUnitNewValue = get(toPlotSearch, 'value');
    if (planUnitNew?.value && planUnitNew.value !== planUnitNewValue) {
      onReplace(planUnitNew.value, planUnitNewValue);
    }
    change(`${field}.plan_unit_id`, planUnitNewValue);
  }

  updatePlanUnit = () => {
    const {
      currentPlotSearch,
      index,
      fetchPlanUnitAttributes,
      fetchPlanUnit,
      planUnit,
      field,
      change,
    } = this.props;
    const currentTarget = currentPlotSearch.targets[index];
    const masterPlanUnitId = get(currentTarget, 'master_plan_unit_id');
    const plan_unit = getPlanUnitFromObjectKeys(planUnit, index);
    const payload = {
      value: masterPlanUnitId,
      label: (plan_unit) ? plan_unit.identifier : '',
    };
    this.setState({
      planUnitNew: payload,
    });
    fetchPlanUnitAttributes(payload);
    fetchPlanUnit(payload);
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
      planUnit,
      planUnitAttributes,
      currentPlotSearch,
      index,
    } = this.props;
    const {
      planUnitNew,
    } = this.state;
    const identifierOptions = getFieldOptions(attributes, 'plotSearch_sites.child.children.target_identifier');
    const plotSearchSiteErrors = get(errors, field);
    const planUnitNewValue = get(planUnitNew, 'value');
    const planUnitByValue = get(planUnit, planUnitNewValue);
    const planUnitAttributesByValue = get(planUnitAttributes, planUnitNewValue);
    const planUnitIntendedUseOptions = getFieldOptions(planUnitAttributesByValue, 'plan_unit_intended_use');
    const planUnitStateOptions = getFieldOptions(planUnitAttributesByValue, 'plan_unit_state');
    const planUnitTypeOptions = getFieldOptions(planUnitAttributesByValue, 'plan_unit_type');
    const plotDivisionStateOptions = getFieldOptions(planUnitAttributesByValue, 'plot_division_state');
    const currentTarget = currentPlotSearch.targets[index];
    const isDeleted = get(currentTarget, 'is_master_plan_unit_deleted');
    const isNewer = get(currentTarget, 'is_master_plan_unit_newer');
    const label = get(currentTarget, 'message_label');
    const plan_unit = getPlanUnitFromObjectKeys(planUnit, index);

    return (
      <Collapse
        className='collapse__secondary greenCollapse'
        defaultOpen={collapseState !== undefined ? collapseState : true}
        headerTitle={!!get(planUnitNew, 'label') ? `${get(planUnitNew, 'label')} ${get(plan_unit, 'plan_unit_status')}` : 'Uusi kohde'}
        onRemove={onRemove}
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
              {'Kohteentunnus'}
            </FormTextTitle>
            <PlanUnitSelectInput
              value={planUnitNew}
              onChange={this.handleNew}
              disabled={false}
              name={`plan-unit`}
            />
            <div style={{display: 'none'}}>
              <FormField
                disableTouched={isSaveClicked}
                fieldAttributes={get(attributes, 'targets.child.children.plan_unit_id')}
                name={`${field}.plan_unit_id`}
              />
            </div>
            <FormTextTitle>
              {'Kohteen tyyppi'}
            </FormTextTitle>
            <FormField
              disableTouched={isSaveClicked}
              invisibleLabel={true}
              fieldAttributes={get(attributes, 'targets.child.children.target_type')}
              name={`${field}.target_type`}
            />
            {((isFetchingPlanUnitAttributes || isFetchingPlanUnit) && (!planUnitAttributesByValue || !planUnitAttributesByValue)) &&
              <LoaderWrapper className='relative-overlay-wrapper'><Loader isLoading={true} /></LoaderWrapper>
            }
            <FormField
              disableTouched={isSaveClicked}
              fieldAttributes={get(attributes, 'plotSearch_sites.child.children.target_identifier')}
              name={`${field}.target_identifier`}
              overrideValues={{
                fieldType: 'choice',
                label: 'Kohteen tunnus',
                options: identifierOptions,
              }}
            />
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

const formName = FormNames.PLOT_SEARCH_BASIC_INFORMATION;

export default flowRight(
  connect(
    (state, props: Props) => {
      const formName = props.formName;
      const selector = formValueSelector(formName);
      const id = selector(state, `${props.field}.id`);
      return {
        attributes: getAttributes(state),
        isSaveClicked: getIsSaveClicked(state),
        collapseState: getCollapseStateByKey(state, `${ViewModes.EDIT}.${FormNames.PLOT_SEARCH_BASIC_INFORMATION}.target.${id}`),
        type: selector(state, `${props.field}.type`),
        targetIdentifier: selector(state, `${props.field}.target_identifier`),
        decisionToList: selector(state, `${props.field}.decision_to_list`),
        usersPermissions: getUsersPermissions(state),
        errors: getErrorsByFormName(state, formName),
        plotSearchSiteId: id,
        planUnitAttributes: getPlanUnitAttributes(state),
        planUnit: getPlanUnit(state),
        isFetchingPlanUnit: getIsFetchingPlanUnit(state, id),
        isFetchingPlanUnitAttributes: getIsFetchingPlanUnitAttributes(state, id),
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
  reduxForm({
    form: formName,
    destroyOnUnmount: false,
    change,
  }),
)(PlotSearchSiteEdit);
