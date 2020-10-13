// @flow
import React, {PureComponent, Fragment} from 'react';
import {connect} from 'react-redux';
import {Row, Column} from 'react-foundation';

import get from 'lodash/get';
import {receiveCollapseStates} from '$src/plotSearch/actions';
import {FormNames, ViewModes} from '$src/enums';
import Loader from '$components/loader/Loader';
import LoaderWrapper from '$components/loader/LoaderWrapper';
import Collapse from '$components/collapse/Collapse';
import FormText from '$components/form/FormText';
import FormTextTitle from '$components/form/FormTextTitle';
import ExternalLink from '$components/links/ExternalLink';
import {
  formatDate,
  getFieldOptions,
  getLabelOfOption,
} from '$util/helpers';
import {
  getAttributes,
  getCollapseStateByKey, 
  getPlanUnitAttributes,
  getPlanUnit,
  getIsFetchingPlanUnit,
  getIsFetchingPlanUnitAttributes,
} from '$src/plotSearch/selectors';
import type {Attributes} from '$src/types';
import {
  fetchPlanUnit,
  fetchPlanUnitAttributes,
} from '$src/plotSearch/actions';

type Props = {
  attributes: Attributes,
  plotSearchSite: Object,
  receiveCollapseStates: Function,
  fetchPlanUnitAttributes: Function,
  fetchPlanUnit: Function,
  collapseState: Boolean,
  isFetchingPlanUnitAttributes: boolean,
  isFetchingPlanUnit: boolean,
  planUnitAttributes: Attributes,
  planUnit: Object,
}

type State = {
  update: number,
}

class PlotSearchSite extends PureComponent<Props, State> {
  state = {
    update: 0,
  }

  timer: any

  handleCollapseToggle = (val: boolean) => {
    const {receiveCollapseStates, plotSearchSite} = this.props;

    receiveCollapseStates({
      [ViewModes.READONLY]: {
        [FormNames.PLOT_SEARCH_BASIC_INFORMATION]: {
          plotSearch_site: {
            [plotSearchSite.id]: val,
          },
        },
      },
    });
  };

  componentDidMount(){
    this.getPlanUnitData();
    this.startTimer();  
  }

  updateComponent(){
    const {update} = this.state; 
    this.setState({
      update: update + 1,
    });
    if(update > 100)
      this.stopTimer();
  }

  startTimer = () => {
    this.timer = setInterval(
      () => this.updateComponent(),
      10
    );
  }

  stopTimer = () => {
    clearInterval(this.timer);
  }

  getPlanUnitData(){
    const {
      fetchPlanUnitAttributes,
      fetchPlanUnit,
      plotSearchSite,  
    } = this.props;
    const payload = {
      value: plotSearchSite.plan_unit,
    };
    fetchPlanUnitAttributes(payload);
    fetchPlanUnit(payload);
  }

  render(){
    
    const {
      collapseState,
      plotSearchSite,
      isFetchingPlanUnitAttributes,
      isFetchingPlanUnit,
      planUnit, 
      planUnitAttributes,
    } = this.props;

    const planUnitAttributesByValue = get(planUnitAttributes, plotSearchSite.plan_unit);
    const currentPlanUnit = get(planUnit, plotSearchSite.plan_unit);
    const planUnitIntendedUseOptions = getFieldOptions(planUnitAttributesByValue, 'plan_unit_intended_use');
    const planUnitStateOptions = getFieldOptions(planUnitAttributesByValue, 'plan_unit_state');
    const planUnitTypeOptions = getFieldOptions(planUnitAttributesByValue, 'plan_unit_type');
    const plotDivisionStateOptions = getFieldOptions(planUnitAttributesByValue, 'plot_division_state');
    return (
      <Column large={12}>
        <Collapse
          className='collapse__secondary greenCollapse'
          defaultOpen={collapseState !== undefined ? collapseState : true}
          headerTitle={get(currentPlanUnit, 'identifier') || '-'}
          onToggle={this.handleCollapseToggle}
        >
          <Row>
            {(isFetchingPlanUnitAttributes || isFetchingPlanUnit) &&
              <LoaderWrapper className='relative-overlay-wrapper'><Loader isLoading={true} /></LoaderWrapper>
            }
            {(currentPlanUnit) && <Fragment>
              <Column small={6} medium={3} large={3}>
                <FormTextTitle>
                  {'Vuokraustunnus'}
                </FormTextTitle>
                <FormText>
                  <ExternalLink
                    className='no-margin'
                    href={`/`}
                    text={get(currentPlanUnit, 'identifier') || '-'}
                  />
                </FormText>
                <FormTextTitle>
                  {'Kaavayksikön vaihe'}
                </FormTextTitle>
                <FormText>{plotSearchSite.target_type || '-'}</FormText>
              </Column>
              <Column small={6} medium={4} large={2}>
                <FormTextTitle>
                  {'Kaavayksikön käyttötarkoitus'}
                </FormTextTitle>
                <FormText>{currentPlanUnit && getLabelOfOption(planUnitIntendedUseOptions, currentPlanUnit.plan_unit_intended_use) || '-'}</FormText>
              </Column>
              <Column small={6} medium={3} large={2}>
                <FormTextTitle>
                  {'Kokonaisala neliömetreissä'}
                </FormTextTitle>
                <FormText>
                  {get(currentPlanUnit, 'area') || '-'}
                </FormText>
              </Column>
              <Column small={6} medium={3} large={2}>
                <FormTextTitle>
                  {'Asemakaava'}
                </FormTextTitle>
                <FormText>
                  {get(currentPlanUnit, 'detailed_plan_identifier') || '-'}
                </FormText>
              </Column>
              <Column small={6} medium={4} large={3}>
                <FormTextTitle>
                  {'Asemakaavan viimeisin käsittelypvm'}
                </FormTextTitle>
                <FormText>
                  {formatDate(get(currentPlanUnit, 'detailed_plan_latest_processing_date')) || '-'}
                </FormText>
              </Column>
              <Column small={6} medium={4} large={3}>
                <FormTextTitle>
                  {'Asemakaavan viimeisin käsittelypvm. selite'}
                </FormTextTitle>
                <FormText>
                  {formatDate(get(currentPlanUnit, 'detailed_plan_latest_processing_date_note')) || '-'}
                </FormText>
              </Column>
              <Column small={6} medium={3} large={2}>
                <FormTextTitle>
                  {'Sopimushetkellä'}
                </FormTextTitle>
                <FormText>
                  {get(currentPlanUnit, 'in_contract') || '-'}
                </FormText>
              </Column>
              <Column small={6} medium={4} large={2}>
                <FormTextTitle>
                  {'Kaavayksikön olotila'}
                </FormTextTitle>
                <FormText>{currentPlanUnit && getLabelOfOption(planUnitStateOptions, currentPlanUnit.plan_unit_state) || '-'}</FormText>
              </Column>
              <Column small={6} medium={4} large={2}>
                <FormTextTitle>
                  {'Kaavayksikön laji'}
                </FormTextTitle>
                <FormText>{currentPlanUnit && getLabelOfOption(planUnitTypeOptions, currentPlanUnit.plan_unit_type) || '-'}</FormText>
              </Column>
              <Column small={6} medium={3} large={2}>
                <FormTextTitle>
                  {'Tonttijaon hyväksymispvm'}
                </FormTextTitle>
                <FormText>
                  {formatDate(get(currentPlanUnit, 'plot_division_date_of_approval')) || '-'}
                </FormText>
              </Column>
              <Column small={6} medium={3} large={3}>
                <FormTextTitle>
                  {'Tonttijaon voimaantulopvm'}
                </FormTextTitle>
                <FormText>
                  {formatDate(get(currentPlanUnit, 'plot_division_effective_date')) || '-'}
                </FormText>
              </Column>
              <Column small={6} medium={3} large={2}>
                <FormTextTitle>
                  {'Tonttijaon tunnus'}
                </FormTextTitle>
                <FormText>
                  {get(currentPlanUnit, 'plot_division_identifier') || '-'}
                </FormText>
              </Column>
              <Column small={6} medium={4} large={2}>
                <FormTextTitle>
                  {'Tonttijaon olotila'}
                </FormTextTitle>
                <FormText>{currentPlanUnit && getLabelOfOption(plotDivisionStateOptions, currentPlanUnit.plot_division_state) || '-'}</FormText>
              </Column>
              <Column small={6} medium={3} large={2}>
                <FormTextTitle>
                  {'Leikkausala'}
                </FormTextTitle>
                <FormText>
                  {get(currentPlanUnit, 'section_area') || '-'}
                </FormText>
              </Column>
            </Fragment>}
          </Row>
        </Collapse>
      </Column>
    );
  }
}

export default connect(
  (state, props) => {
    const id = props.plotSearchSite.id;
    return {
      attributes: getAttributes(state),
      collapseState: getCollapseStateByKey(state, `${ViewModes.READONLY}.${FormNames.PLOT_SEARCH_BASIC_INFORMATION}.plotSearch_site.${id}`),
      planUnitAttributes: getPlanUnitAttributes(state),
      planUnit: getPlanUnit(state),
      isFetchingPlanUnit: getIsFetchingPlanUnit(state),
      isFetchingPlanUnitAttributes: getIsFetchingPlanUnitAttributes(state),
    };
  },
  {
    receiveCollapseStates,
    fetchPlanUnitAttributes,
    fetchPlanUnit,
  }
)(PlotSearchSite);