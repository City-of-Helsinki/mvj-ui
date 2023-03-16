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
import {Routes, getRouteById} from '$src/root/routes';
import {
  formatDate,
  getFieldOptions,
  getLabelOfOption,
} from '$util/helpers';
import {
  getAttributes,
  getCollapseStateByKey,
  getIsFetchingPlanUnitAttributes,
} from '$src/plotSearch/selectors';
import type {Attributes} from '$src/types';
import {
  PlotSearchFieldTitles,
} from '$src/plotSearch/enums';
import PlotSearchReservationRecipients
  from '$src/plotSearch/components/plotSearchSections/basicInfo/PlotSearchReservationRecipients';


type OwnProps = {
  plotSearchSite: Object,
  index: number,
  planUnitAttributes: Attributes,
}
type Props = {
  ...OwnProps,
  attributes: Attributes,
  plotSearchSite: Object,
  receiveCollapseStates: Function,
  fetchPlanUnitAttributes: Function,
  collapseState: Boolean,
  isFetchingPlanUnitAttributes: boolean,
  isFetchingPlanUnit: boolean,
  planUnitAttributes: Attributes,
  planUnit: Object,
}

type State = {
  update: number,
}

class PlotSearchSitePlanUnit extends PureComponent<Props, State> {
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

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  stopTimer = () => {
    clearInterval(this.timer);
  }

  render(){

    const {
      attributes,
      collapseState,
      plotSearchSite,
      isFetchingPlanUnitAttributes,
      planUnitAttributes,
    } = this.props;

    const currentPlanUnit = get(plotSearchSite, 'plan_unit');
    const planUnitIntendedUseOptions = getFieldOptions(planUnitAttributes, 'plan_unit_intended_use');
    const planUnitStateOptions = getFieldOptions(planUnitAttributes, 'plan_unit_state');
    const planUnitTypeOptions = getFieldOptions(planUnitAttributes, 'plan_unit_type');
    const plotDivisionStateOptions = getFieldOptions(planUnitAttributes, 'plot_division_state');
    const isDeleted = get(plotSearchSite, 'is_master_plan_unit_deleted');
    const isNewer = get(plotSearchSite, 'is_master_plan_unit_newer');
    const label = get(plotSearchSite, 'message_label');

    const leaseAddress = get(plotSearchSite, 'lease_address');
    const address = get(leaseAddress, 'address');
    const leaseIdentifier = get(plotSearchSite, 'lease_identifier');
    const leaseHitas = get(plotSearchSite, 'lease_hitas');
    const infoLinks = get(plotSearchSite, 'info_links');

    const getInfoLinkLanguageDisplayText = (key) => {
      const languages = get(attributes, 'plot_search_targets.child.children.info_links.child.children.language.choices');
      return languages?.find((language) => language.value === key)?.display_name || key;
    };

    return (
      <Column large={12}>
        <Collapse
          className='collapse__secondary greenCollapse'
          defaultOpen={collapseState !== undefined ? collapseState : true}
          headerTitle={get(currentPlanUnit, 'identifier') ? `${get(currentPlanUnit, 'identifier')} ${get(currentPlanUnit, 'plan_unit_status')}` : '-'}
          onToggle={this.handleCollapseToggle}
        >
          <Row style={{marginBottom: 10}}>
            {isFetchingPlanUnitAttributes &&
              <LoaderWrapper className='relative-overlay-wrapper'><Loader isLoading={true} /></LoaderWrapper>
            }
            {(isNewer) && <WarningContainer style={{marginLeft: 5, marginBottom: 5}}> {/* style={{position: 'absolute', right: '15px', top: '-5px'}}> */}
              <WarningField
                meta={{warning: label + ' Päivitä tiedot'}}
                showWarning={(isDeleted || isNewer)}
              />
            </WarningContainer>}
            {(isDeleted) && <WarningContainer style={{marginLeft: 5, marginBottom: 5}}> {/* style={{position: 'absolute', right: '15px', top: '-5px'}}> */}
              <WarningField
                meta={{warning: label + ' Poista kohde hausta'}}
                showWarning={(isDeleted || isNewer)}
              />
            </WarningContainer>}
            {(isDeleted || isNewer) && <Column small={12} medium={12} large={12} />}
            {currentPlanUnit && <Fragment>
              <Column small={12} medium={12} large={2}>
                <Row>
                  <Column small={4} medium={4} large={12}>
                    <FormTextTitle>
                      {PlotSearchFieldTitles.TARGET_IDENTIFIER}
                    </FormTextTitle>
                    <FormText>
                      {currentPlanUnit.identifier}
                    </FormText>
                  </Column>
                  <Column small={8} medium={8} large={12}>
                    <FormTextTitle>
                      {PlotSearchFieldTitles.LEASE_IDENTIFIER}
                    </FormTextTitle>
                    <FormText>
                      <ExternalLink
                        className='no-margin'
                        href={`${getRouteById(Routes.LEASES)}?search=${leaseIdentifier}`}
                        text={leaseIdentifier || '-'}
                      />
                    </FormText>
                  </Column>
                </Row>
              </Column>
              <Column small={12} medium={12} large={7}>
                <Row>
                  <Column small={6} medium={4} large={6}>
                    <FormTextTitle>
                      {PlotSearchFieldTitles.PLAN_UNIT_INTENDED_USE}
                    </FormTextTitle>
                    <FormText>{currentPlanUnit && getLabelOfOption(planUnitIntendedUseOptions, currentPlanUnit.plan_unit_intended_use) || '-'}</FormText>
                  </Column>
                  <Column small={6} medium={4} large={3}>
                    <FormTextTitle>
                      {PlotSearchFieldTitles.ADDRESS}
                    </FormTextTitle>
                    <FormText>{address || '-'}</FormText>
                  </Column>
                  <Column small={6} medium={4} large={3}>
                    <FormTextTitle>
                      {PlotSearchFieldTitles.LEASE_MANAGEMENT}
                    </FormTextTitle>
                    <FormText>{get(plotSearchSite, 'lease_management') || '-'}</FormText>
                  </Column>
                  <Column small={6} medium={4} large={6}>
                    {/*
                    <FormTextTitle>
                      {'Kaavayksikön vaihe'}
                    </FormTextTitle>
                    <FormText>{plotSearchSite.target_type || '-'}</FormText>
                    */}
                  </Column>
                  <Column small={6} medium={4} large={3}>
                    <FormTextTitle>
                      {PlotSearchFieldTitles.LEASE_FINANCING}
                    </FormTextTitle>
                    <FormText>{get(plotSearchSite, 'lease_financing') || '-'}</FormText>
                  </Column>
                  <Column small={6} medium={4} large={3}>
                    <FormTextTitle>
                      {PlotSearchFieldTitles.LEASE_HITAS}
                    </FormTextTitle>
                    <FormText>
                      {leaseHitas || '-'}
                    </FormText>
                  </Column>
                  <Column small={6} medium={4} large={3}>
                    <FormTextTitle>
                      {PlotSearchFieldTitles.DETAILED_PLAN}
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
                      {PlotSearchFieldTitles.PLAN_UNIT_STATE}
                    </FormTextTitle>
                    <FormText>{currentPlanUnit && getLabelOfOption(planUnitStateOptions, currentPlanUnit.plan_unit_state) || '-'}</FormText>
                  </Column>
                  <Column small={6} medium={4} large={3}>
                    <FormTextTitle>
                      {PlotSearchFieldTitles.AREA}
                    </FormTextTitle>
                    <FormText>
                      {get(currentPlanUnit, 'area') ? `${get(currentPlanUnit, 'area')} m²` : '-'}
                    </FormText>
                  </Column>
                  <Column small={6} medium={4} large={3}>
                    <FormTextTitle>
                      {PlotSearchFieldTitles.SECTION_AREA}
                    </FormTextTitle>
                    <FormText>
                      {get(currentPlanUnit, 'section_area') ? `${get(currentPlanUnit, 'section_area')} m²` : '-'}
                    </FormText>
                  </Column>
                  <Column small={6} medium={4} large={6}>
                    <FormTextTitle>
                      {PlotSearchFieldTitles.DETAILED_PLAN_LATEST_PROCESSING_DATE}
                    </FormTextTitle>
                    <FormText>
                      {formatDate(get(currentPlanUnit, 'detailed_plan_latest_processing_date')) || '-'}
                    </FormText>
                  </Column>
                  <Column small={6} medium={4} large={6}>
                    <FormTextTitle>
                      {PlotSearchFieldTitles.DETAILED_PLAN_LATEST_PROCESSING_DATE_NOTE}
                    </FormTextTitle>
                    <FormText>
                      {get(currentPlanUnit, 'detailed_plan_latest_processing_date_note') || '-'}
                    </FormText>
                  </Column>
                  <Column small={6} medium={4} large={4}>
                    <FormTextTitle>
                      {PlotSearchFieldTitles.IN_CONTRACT}
                    </FormTextTitle>
                    <FormText>
                      {get(currentPlanUnit, 'in_contract') || '-'}
                    </FormText>
                  </Column>
                  <Column small={6} medium={4} large={4}>
                    <FormTextTitle>
                      {PlotSearchFieldTitles.PLAN_UNIT_TYPE}
                    </FormTextTitle>
                    <FormText>{currentPlanUnit && getLabelOfOption(planUnitTypeOptions, currentPlanUnit.plan_unit_type) || '-'}</FormText>
                  </Column>
                  <Column small={6} medium={4} large={4}>
                    <FormTextTitle>
                      {PlotSearchFieldTitles.PLOT_DIVISION_DATE_OF_APPROVAL}
                    </FormTextTitle>
                    <FormText>
                      {formatDate(get(currentPlanUnit, 'plot_division_date_of_approval')) || '-'}
                    </FormText>
                  </Column>
                  <Column small={6} medium={4} large={4}>
                    <FormTextTitle>
                      {PlotSearchFieldTitles.PLOT_DIVISION_EFFECTIVE_DATE}
                    </FormTextTitle>
                    <FormText>
                      {formatDate(get(currentPlanUnit, 'plot_division_effective_date')) || '-'}
                    </FormText>
                  </Column>
                  <Column small={6} medium={4} large={4}>
                    <FormTextTitle>
                      {PlotSearchFieldTitles.PLOT_DIVISION_IDENTIFIER}
                    </FormTextTitle>
                    <FormText>
                      {get(currentPlanUnit, 'plot_division_identifier') || '-'}
                    </FormText>
                  </Column>
                  <Column small={6} medium={4} large={4}>
                    <FormTextTitle>
                      {PlotSearchFieldTitles.PLOT_DIVISION_STATE}
                    </FormTextTitle>
                    <FormText>{currentPlanUnit && getLabelOfOption(plotDivisionStateOptions, currentPlanUnit.plot_division_state) || '-'}</FormText>
                  </Column>
                  {infoLinks.length > 0 && (<Column small={12} medium={12} large={12} className="plot_search_target__info-links">
                    <Row>
                      <Column small={4} medium={4} large={4}>
                        <FormTextTitle>
                          {PlotSearchFieldTitles.INFO_LINK_DESCRIPTION}
                        </FormTextTitle>
                      </Column>
                      <Column small={6} medium={6} large={6}>
                        <FormTextTitle>
                          {PlotSearchFieldTitles.INFO_LINK_URL}
                        </FormTextTitle>
                      </Column>
                      <Column small={2} medium={2} large={2}>
                        <FormTextTitle>
                          {PlotSearchFieldTitles.INFO_LINK_LANGUAGE}
                        </FormTextTitle>
                      </Column>
                    </Row>
                    {infoLinks.map((infoLink) => <Row key={infoLink.id}>
                      <Column small={4} medium={4} large={4}>
                        <FormText>
                          {infoLink.description}
                        </FormText>
                      </Column>
                      <Column small={6} medium={6} large={6}>
                        <FormText>
                          <ExternalLink href={infoLink.url} text={infoLink.url} />
                        </FormText>
                      </Column>
                      <Column small={2} medium={2} large={2}>
                        <FormText>
                          {getInfoLinkLanguageDisplayText(infoLink.language)}
                        </FormText>
                      </Column>
                    </Row>)}
                  </Column>)}
                </Row>
              </Column>
              <Column small={12} medium={12} large={3}>
                <Row>
                  <Column small={4} medium={4} large={12}>
                    <FormText>
                      <ExternalLink href={`${getRouteById(Routes.PLOT_APPLICATIONS)}?target_plan_unit=${currentPlanUnit.id}`} text={'Hakemukset (?)'} />
                    </FormText>
                  </Column>
                  <Column small={8} medium={8} large={12}>
                    <PlotSearchReservationRecipients reservationRecipients={get(plotSearchSite, 'reservation_recipients')} />
                  </Column>
                </Row>
              </Column>
            </Fragment>}
          </Row>
        </Collapse>
      </Column>
    );
  }
}

export default (connect(
  (state, props) => {
    const id = props.plotSearchSite.id;
    return {
      attributes: getAttributes(state),
      collapseState: getCollapseStateByKey(state, `${ViewModes.READONLY}.${FormNames.PLOT_SEARCH_BASIC_INFORMATION}.plotSearch_site.${id}`),
      isFetchingPlanUnitAttributes: getIsFetchingPlanUnitAttributes(state),
    };
  },
  {
    receiveCollapseStates,
  }
)(PlotSearchSitePlanUnit): React$ComponentType<OwnProps>);
