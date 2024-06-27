import React, { Fragment, PureComponent } from "react";
import { connect } from "react-redux";
import { Row, Column } from "react-foundation";
import Authorization from "/src/components/authorization/Authorization";
import { getUserFullName } from "users/helpers";
import { getUsersPermissions } from "usersPermissions/selectors";
import { FormNames, ViewModes } from "enums";
import ExternalLink from "/src/components/links/ExternalLink";
import FormText from "/src/components/form/FormText";
import FormTextTitle from "/src/components/form/FormTextTitle";
import Collapse from "/src/components/collapse/Collapse";
import Divider from "/src/components/content/Divider";
import Title from "/src/components/content/Title";
import type { UsersPermissions as UsersPermissionsType } from "usersPermissions/types";
import { getAttributes, getCollapseStateByKey, getCurrentPlotSearch, getPlanUnit, getPlotSearchSubTypes, getRelatedApplications } from "/src/plotSearch/selectors";
import { receiveCollapseStates } from "/src/plotSearch/actions";
import { PlotSearchFieldTitles, PlotSearchStageTypes } from "/src/plotSearch/enums";
import { getContentBasicInformation, formatDecisionName } from "/src/plotSearch/helpers";
import { getUiDataPlotSearchKey } from "uiData/helpers";
import { getFieldOptions, getLabelOfOption, formatDate, isFieldAllowedToRead } from "util/helpers";
import { getHoursAndMinutes } from "util/date";
import { PlotSearchFieldPaths } from "/src/plotSearch/enums";
import type { Attributes } from "types";
import type { PlotSearch } from "/src/plotSearch/types";
import { fetchPlanUnit, fetchPlanUnitAttributes, fetchCustomDetailedPlanAttributes } from "/src/plotSearch/actions";
import { getRouteById, Routes } from "/src/root/routes";
import PlotSearchTargetListing from "/src/plotSearch/components/plotSearchSections/basicInfo/PlotSearchTargetListing";
import DocumentsButton from "/src/components/form/DocumentsButton";
import Button from "/src/components/button/Button";
type OwnProps = {
  openExportModal: (...args: Array<any>) => any;
  openReservationIdentifiersModal: (...args: Array<any>) => any;
  openDirectReservationLinkModal: (...args: Array<any>) => any;
  showEditMode: (...args: Array<any>) => any;
};
type Props = OwnProps & {
  usersPermissions: UsersPermissionsType;
  basicInformationCollapseState: boolean;
  receiveCollapseStates: (...args: Array<any>) => any;
  attributes: Attributes;
  currentPlotSearch: PlotSearch;
  fetchPlanUnit: (...args: Array<any>) => any;
  fetchPlanUnitAttributes: (...args: Array<any>) => any;
  fetchCustomDetailedPlanAttributes: (...args: Array<any>) => any;
  planUnit: Record<string, any>;
  subtypes: Array<Record<string, any>>;
  relatedApplications: Array<Record<string, any>>;
};
type State = {};

class BasicInfo extends PureComponent<Props, State> {
  state = {};

  componentDidMount() {
    const {
      fetchCustomDetailedPlanAttributes,
      fetchPlanUnitAttributes
    } = this.props;
    fetchCustomDetailedPlanAttributes();
    fetchPlanUnitAttributes();
  }

  handleBasicInfoCollapseToggle = (val: boolean) => {
    const {
      receiveCollapseStates
    } = this.props;
    receiveCollapseStates({
      [ViewModes.READONLY]: {
        [FormNames.PLOT_SEARCH_BASIC_INFORMATION]: {
          basic_information: val
        }
      }
    });
  };

  render() {
    const {
      // usersPermissions,
      basicInformationCollapseState,
      attributes,
      currentPlotSearch,
      openExportModal,
      openReservationIdentifiersModal,
      openDirectReservationLinkModal,
      showEditMode,
      subtypes,
      relatedApplications
    } = this.props;
    const plotSearch = getContentBasicInformation(currentPlotSearch);
    const typeOptions = getFieldOptions(attributes, PlotSearchFieldPaths.TYPE);
    const subtypeOptions = getFieldOptions(attributes, PlotSearchFieldPaths.SUBTYPE);
    const stageOptions = getFieldOptions(attributes, PlotSearchFieldPaths.STAGE);
    const searchClassOptions = getFieldOptions(attributes, PlotSearchFieldPaths.SEARCH_CLASS);
    const isInProcessing = [PlotSearchStageTypes.PROCESSING, PlotSearchStageTypes.DECISION].includes(plotSearch.stageType);
    const requiresOpeningRecord = subtypes.find(type => type.id === plotSearch.subtype)?.require_opening_record;
    return <Fragment>
        <div className="plot_search__basic-info-header-buttons">
          {isInProcessing && requiresOpeningRecord && relatedApplications.some(application => application.opening_record === null) && <Button onClick={() => showEditMode(true)} text="Avaa hakemukset" />}
          {plotSearch.stageType === PlotSearchStageTypes.IN_ACTION && <Button onClick={openDirectReservationLinkModal} text="Lähetä hakemuslinkki" />}
          {isInProcessing && <Button onClick={openReservationIdentifiersModal} text="Luo varaustunnukset" />}
          <DocumentsButton onClick={openExportModal} label="Tulosta kaikki hakemukset" />
        </div>
        <Title>
          {PlotSearchFieldTitles.BASIC_INFO}
        </Title>
        <Divider />
        <Row className='summary__content-wrapper plot_search__basic-info'>
          <Column small={12}>
            <Collapse defaultOpen={basicInformationCollapseState !== undefined ? basicInformationCollapseState : true} headerTitle={PlotSearchFieldTitles.BASIC_INFO} onToggle={this.handleBasicInfoCollapseToggle}>
              <Row>
                <Authorization allow={isFieldAllowedToRead(attributes, 'name')}>
                  <Column small={12} large={4}>
                    <FormTextTitle uiDataKey={getUiDataPlotSearchKey('name')}>
                      {PlotSearchFieldTitles.NAME}
                    </FormTextTitle>
                    <FormText>{plotSearch.name}</FormText>
                  </Column>
                </Authorization>
                <Authorization allow={isFieldAllowedToRead(attributes, 'preparers')}>
                  <Column small={12} medium={6} large={4}>
                    <FormTextTitle uiDataKey={getUiDataPlotSearchKey('preparers')}>
                      {PlotSearchFieldTitles.PREPARERS}
                    </FormTextTitle>
                    <FormText>{plotSearch.preparers?.map(getUserFullName).join(', ') || '-'}</FormText>
                  </Column>
                </Authorization>
                <Authorization allow={isFieldAllowedToRead(attributes, 'search_class')}>
                  <Column small={12} medium={6} large={2}>
                    <FormTextTitle uiDataKey={getUiDataPlotSearchKey('search_class')}>
                      {PlotSearchFieldTitles.SEARCH_CLASS}
                    </FormTextTitle>
                    <FormText>{getLabelOfOption(searchClassOptions, plotSearch.search_class) || '-'}</FormText>
                  </Column>
                </Authorization>
                <Authorization allow={isFieldAllowedToRead(attributes, 'applications')}>
                  <Column small={12} medium={6} large={2}>
                    <FormTextTitle uiDataKey={getUiDataPlotSearchKey('applications')}>
                      {PlotSearchFieldTitles.APPLICATIONS}
                    </FormTextTitle>
                    {plotSearch.applications && plotSearch.applications.map((application, index) => <FormText key={index}>
                        <ExternalLink className='no-margin' href={`${application.id}`} text={application.name} />
                      </FormText>)}
                  </Column>
                </Authorization>
              </Row>
              <Row>
                <Authorization allow={isFieldAllowedToRead(attributes, 'type')}>
                  <Column small={12} medium={6} large={2}>
                    <FormTextTitle uiDataKey={getUiDataPlotSearchKey('type')}>
                      {PlotSearchFieldTitles.TYPE}
                    </FormTextTitle>
                    <FormText>{getLabelOfOption(typeOptions, plotSearch.type) || '-'}</FormText>
                  </Column>
                </Authorization>
                <Authorization allow={isFieldAllowedToRead(attributes, 'subtype')}>
                  <Column small={12} medium={6} large={2}>
                    <FormTextTitle uiDataKey={getUiDataPlotSearchKey('subtype')}>
                      {PlotSearchFieldTitles.SUBTYPE}
                    </FormTextTitle>
                    <FormText>{getLabelOfOption(subtypeOptions, plotSearch.subtype) || '-'}</FormText>
                  </Column>
                </Authorization>
                <Authorization allow={isFieldAllowedToRead(attributes, 'begin_at')}>
                  <Column small={6} medium={3} large={1}>
                    <FormTextTitle uiDataKey={getUiDataPlotSearchKey('begin_at')}>
                      {PlotSearchFieldTitles.START_DATE}
                    </FormTextTitle>
                    <FormText>{formatDate(plotSearch.begin_at) || '-'}</FormText>
                  </Column>
                </Authorization>
                <Authorization allow={isFieldAllowedToRead(attributes, 'begin_at')}>
                  <Column small={6} medium={3} large={1}>
                    <FormTextTitle>
                      {PlotSearchFieldTitles.CLOCK}
                    </FormTextTitle>
                    <FormText>{getHoursAndMinutes(plotSearch.begin_at) || '-'}</FormText>
                  </Column>
                </Authorization>
                <Authorization allow={isFieldAllowedToRead(attributes, 'end_at')}>
                  <Column small={6} medium={3} large={1}>
                    <FormTextTitle uiDataKey={getUiDataPlotSearchKey('end_at')}>
                      {PlotSearchFieldTitles.END_DATE}
                    </FormTextTitle>
                    <FormText>{formatDate(plotSearch.end_at) || '-'}</FormText>
                  </Column>
                </Authorization>
                <Authorization allow={isFieldAllowedToRead(attributes, 'end_at')}>
                  <Column small={6} medium={3} large={1}>
                    <FormTextTitle>
                      {PlotSearchFieldTitles.CLOCK}
                    </FormTextTitle>
                    <FormText>{getHoursAndMinutes(plotSearch.end_at) || '-'}</FormText>
                  </Column>
                </Authorization>
                <Authorization allow={isFieldAllowedToRead(attributes, 'stage')}>
                  <Column small={6} medium={6} large={2}>
                    <FormTextTitle>
                      {PlotSearchFieldTitles.STAGE}
                    </FormTextTitle>
                    <FormText>
                      {getLabelOfOption(stageOptions, plotSearch.stage) || '-'}
                    </FormText>
                  </Column>
                </Authorization>
                <Authorization allow={isFieldAllowedToRead(attributes, 'modified_at')}>
                  <Column small={12} medium={6} large={2}>
                    <FormTextTitle uiDataKey={getUiDataPlotSearchKey('modified_at')}>
                      {PlotSearchFieldTitles.APPLICATIONS_UPDATED_DATE}
                    </FormTextTitle>
                    <FormText>{formatDate(plotSearch.modified_at)}</FormText>
                  </Column>
                </Authorization>
              </Row>
              <Row>
                <Column small={12} medium={4} large={3}>
                  <FormTextTitle id="plotSearchDecisionTable__applications-header">
                    <ExternalLink href={`${getRouteById(Routes.PLOT_APPLICATIONS)}?plot_search=${plotSearch.id}`} text={`${PlotSearchFieldTitles.APPLICATIONS} (${relatedApplications.length})`} />
                  </FormTextTitle>
                </Column>
              </Row>
              <Row>
                <Column small={12} medium={6} large={6}>
                  <FormTextTitle id="plotSearchDecisionTable__decision-header">
                    {PlotSearchFieldTitles.DECISION}
                  </FormTextTitle>
                </Column>
                {
                /*<Column small={6} medium={4} large={4}>
                 <FormTextTitle id="plotSearchDecisionTable__to-list-header">
                   {PlotSearchFieldTitles.DECISION_TO_LIST}
                 </FormTextTitle>
                </Column>*/
              }
              </Row>
              {(!plotSearch.decisions || plotSearch.decisions.length === 0) && <FormText>Ei valittuja päätöksiä.</FormText>}
              {!!plotSearch.decisions && plotSearch.decisions.map((decision, index) => <Row key={index}>
                  <Column small={12} medium={6} large={6} aria-labelledby="plotSearchDecisionTable__decision-header">
                    <FormText key={index}>
                      <ExternalLink className='no-margin' href={`${getRouteById(Routes.LEASES)}/${decision.lease}?tab=4`} text={formatDecisionName(decision)} />
                    </FormText>
                  </Column>
                  {
                /*<Column small={6} medium={4} large={4} aria-labelledby="plotSearchDecisionTable__to-list-header">
                 <SingleRadioInput
                     name={''}
                     label={''}
                     checked={!!decision.decision_to_list}
                     onChange={()=>{}}
                     onClick={()=>{}}
                     onKeyDown={()=>{}}
                     disabled
                   />
                </Column>*/
              }
                </Row>)}
              <PlotSearchTargetListing />
            </Collapse>
          </Column>
        </Row>
      </Fragment>;
  }

}

export default (connect(state => {
  return {
    usersPermissions: getUsersPermissions(state),
    basicInformationCollapseState: getCollapseStateByKey(state, `${ViewModes.READONLY}.${FormNames.PLOT_SEARCH_BASIC_INFORMATION}.basic_information`),
    attributes: getAttributes(state),
    planUnit: getPlanUnit(state),
    currentPlotSearch: getCurrentPlotSearch(state),
    subtypes: getPlotSearchSubTypes(state),
    relatedApplications: getRelatedApplications(state)
  };
}, {
  receiveCollapseStates,
  fetchPlanUnitAttributes,
  fetchCustomDetailedPlanAttributes,
  fetchPlanUnit
})(BasicInfo) as React.ComponentType<OwnProps>);