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
import WarningContainer from '$components/content/WarningContainer';
import WarningField from '$components/form/WarningField';
import {createPaikkatietovipunenUrl} from '$util/helpers';
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
      value: plotSearchSite.plan_unit.id,
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

    const planUnitAttributesByValue = get(planUnitAttributes, plotSearchSite.plan_unit.id);
    const currentPlanUnit = get(planUnit, plotSearchSite.plan_unit.id);
    const planUnitIntendedUseOptions = getFieldOptions(planUnitAttributesByValue, 'plan_unit_intended_use');
    const planUnitStateOptions = getFieldOptions(planUnitAttributesByValue, 'plan_unit_state');
    const planUnitTypeOptions = getFieldOptions(planUnitAttributesByValue, 'plan_unit_type');
    const plotDivisionStateOptions = getFieldOptions(planUnitAttributesByValue, 'plot_division_state');
    const isDeleted = get(plotSearchSite, 'is_master_plan_unit_deleted');
    const isNewer = get(plotSearchSite, 'is_master_plan_unit_newer');
    const label = get(plotSearchSite, 'message_label');

    const leaseAddress = get(plotSearchSite, 'lease_address');
    const address = get(leaseAddress, 'address');
    const leaseIdentifier = get(plotSearchSite, 'lease_identifier');
    const leaseHitas = get(plotSearchSite, 'lease_hitas');

    return (
      <Column large={12}>
        <Collapse
          className='collapse__secondary greenCollapse'
          defaultOpen={collapseState !== undefined ? collapseState : true}
          headerTitle={get(currentPlanUnit, 'identifier') || '-'}
          onToggle={this.handleCollapseToggle}
        >
          <Row style={{marginBottom: 10}}>
            {(isFetchingPlanUnitAttributes || isFetchingPlanUnit) &&
              <LoaderWrapper className='relative-overlay-wrapper'><Loader isLoading={true} /></LoaderWrapper>
            }
            {(isDeleted || isNewer) && <WarningContainer style={{marginLeft: 5, marginBottom: 5}}> {/* style={{position: 'absolute', right: '15px', top: '-5px'}}> */}
              <WarningField
                meta={{warning: label}}
                showWarning={(isDeleted || isNewer)}
              />
            </WarningContainer>}
            {(currentPlanUnit) && <Fragment>
              {(isDeleted || isNewer) && <Column small={12} medium={12} large={12}></Column>}
              <Column small={6} medium={3} large={3}>
                <FormTextTitle>
                  {'Vuokraustunnus'}
                </FormTextTitle>
                <FormText>
                  <ExternalLink
                    className='no-margin'
                    href={`/vuokraukset?search=${leaseIdentifier}`}
                    text={leaseIdentifier || '-'}
                  />
                </FormText>
                <FormTextTitle>
                  {'Osoite'}
                </FormTextTitle>
                <FormText>{address || '-'}</FormText>
                {/* <FormTextTitle>
                  {'Kaavayksikön vaihe'}
                </FormTextTitle>
                <FormText>{plotSearchSite.target_type || '-'}</FormText> */}
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
                  {`${get(currentPlanUnit, 'area')} m²` || '-'}
                </FormText>
              </Column>
              <Column small={6} medium={3} large={2}>
                <FormTextTitle>
                  {'Asemakaava'}
                </FormTextTitle>
                {get(currentPlanUnit, 'detailed_plan_identifier')
                  ? <ExternalLink
                    href={createPaikkatietovipunenUrl(`helreport/planpdfloader/?id=${get(currentPlanUnit, 'detailed_plan_identifier')}`)}
                    text={get(currentPlanUnit, 'detailed_plan_identifier')}
                  />
                  : <FormText>-</FormText>
                }
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
                  {get(currentPlanUnit, 'detailed_plan_latest_processing_date_note') || '-'}
                </FormText>
              </Column>
              <Column small={6} medium={4} large={2}>
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
              <Column small={6} medium={4} large={2}>
                <FormTextTitle>
                  {'Tonttijaon hyväksymispvm'}
                </FormTextTitle>
                <FormText>
                  {formatDate(get(currentPlanUnit, 'plot_division_date_of_approval')) || '-'}
                </FormText>
              </Column>
              <Column small={6} medium={4} large={3}>
                <FormTextTitle>
                  {'Tonttijaon voimaantulopvm'}
                </FormTextTitle>
                <FormText>
                  {formatDate(get(currentPlanUnit, 'plot_division_effective_date')) || '-'}
                </FormText>
              </Column>
              <Column small={6} medium={4} large={2}>
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
              <Column small={6} medium={4} large={2}>
                <FormTextTitle>
                  {'Leikkausala'}
                </FormTextTitle>
                <FormText>
                  {`${get(currentPlanUnit, 'section_area')} m²` || '-'}
                </FormText>
              </Column>
              {leaseHitas && <Column small={6} medium={4} large={2}>
                <FormTextTitle>
                  {'Hitas'}
                </FormTextTitle>
                <FormText>
                  {leaseHitas || '-'}
                </FormText>
              </Column>}
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
