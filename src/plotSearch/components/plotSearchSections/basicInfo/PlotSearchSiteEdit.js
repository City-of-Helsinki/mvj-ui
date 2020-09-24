// @flow
import React, {Fragment, type Element, Component} from 'react';
import {connect} from 'react-redux';
import {reduxForm, FieldArray, formValueSelector} from 'redux-form';
import {Row, Column} from 'react-foundation';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import flowRight from 'lodash/flowRight';

import Loader from '$components/loader/Loader';
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
import ExternalLink from '$components/links/ExternalLink';
import {getUsersPermissions} from '$src/usersPermissions/selectors';
import {
  receiveCollapseStates,
  receiveIsSaveClicked,
  fetchPlanUnit,
  fetchPlanUnitAttributes,
} from '$src/plotSearch/actions';
import {
  getFieldOptions,
  getLabelOfOption,
} from '$util/helpers';
import {
  getlabel,
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
  formName: string,
  initialYearRent: number,
  errors: ?Object,
  plotSearchSiteId: number,
  receiveCollapseStates: Function,
  isSaveClicked: boolean,
  attributes: Attributes,
  onRemove: Function,
  usersPermissions: UsersPermissionsType,
  targetIdentifier: string,
  collapseState: boolean,
  fetchPlanUnitAttributes: Function,
  fetchPlanUnit: Function,
  isFetchingPlanUnitAttributes: boolean,
  isFetchingPlanUnit: boolean,
  planUnitAttributes: Attributes,
  planUnit: Object,
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

  handleNew = (toPlotSearch: Object) => {
    const {
      fetchPlanUnitAttributes,
      fetchPlanUnit,  
    } = this.props;
    this.setState({
      planUnitNew: toPlotSearch,
    });
    fetchPlanUnitAttributes(toPlotSearch);
    fetchPlanUnit(toPlotSearch);
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
    
    return (
      <Collapse
        className='collapse__secondary greenCollapse'
        defaultOpen={collapseState !== undefined ? collapseState : true}
        headerTitle={getlabel(planUnitNew) || '-'}
        onRemove={onRemove}
        hasErrors={isSaveClicked && !isEmpty(plotSearchSiteErrors)}
        onToggle={this.handleCollapseToggle}
      >
        <Row>
          <Column small={6} medium={6} large={6} style={{paddingBottom: 10}}>
            <PlanUnitSelectInput
              value={planUnitNew}
              onChange={this.handleNew}
              disabled={false}
              name='plan-units'
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
          {(planUnitAttributesByValue && planUnitAttributesByValue) && <Fragment>
            <Column small={6} medium={3} large={2}>
              <FormTextTitle>
                {'Vuokraustunnus'}
              </FormTextTitle>
              <FormText>
                <ExternalLink
                  className='no-margin'
                  href={`/`}
                  text={get(planUnitByValue, 'identifier') || '-'}
                />
              </FormText>
            </Column>
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
                {get(planUnitByValue, 'area') || '-'}
              </FormText>
            </Column>
            <Column small={6} medium={3} large={2}>
              <FormTextTitle>
                {'Asemakaava'}
              </FormTextTitle>
              <FormText>
                {get(planUnitByValue, 'detailed_plan_identifier') || '-'}
              </FormText>
            </Column>
            <Column small={6} medium={4} large={3}>
              <FormTextTitle>
                {'Asemakaavan viimeisin käsittelypvm'}
              </FormTextTitle>
              <FormText>
                {get(planUnitByValue, 'detailed_plan_latest_processing_date') || '-'}
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
            <Column small={6} medium={3} large={2}>
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
            <Column small={6} medium={3} large={2}>
              <FormTextTitle>
                {'Tonttijaon hyväksymispvm'}
              </FormTextTitle>
              <FormText>
                {get(planUnitByValue, 'plot_division_date_of_approval') || '-'}
              </FormText>
            </Column>
            <Column small={6} medium={3} large={3}>
              <FormTextTitle>
                {'Tonttijaon voimaantulopvm'}
              </FormTextTitle>
              <FormText>
                {get(planUnitByValue, 'plot_division_effective_date') || '-'}
              </FormText>
            </Column>
            <Column small={6} medium={3} large={2}>
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
            <Column small={6} medium={3} large={2}>
              <FormTextTitle>
                {'Leikkausala'}
              </FormTextTitle>
              <FormText>
                {get(planUnitByValue, 'section_area') || '-'}
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
        collapseState: getCollapseStateByKey(state, `${ViewModes.EDIT}.${FormNames.PLOT_SEARCH_BASIC_INFORMATION}.plotSearch_site.${id}`),
        type: selector(state, `${props.field}.type`),
        targetIdentifier: selector(state, `${props.field}.target_identifier`),
        decisionToList: selector(state, `${props.field}.decision_to_list`),
        usersPermissions: getUsersPermissions(state),
        errors: getErrorsByFormName(state, formName),
        plotSearchSiteId: id,
        planUnitAttributes: getPlanUnitAttributes(state),
        planUnit: getPlanUnit(state),
        isFetchingPlanUnit: getIsFetchingPlanUnit(state),
        isFetchingPlanUnitAttributes: getIsFetchingPlanUnitAttributes(state),
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
  }),
)(PlotSearchSiteEdit);
