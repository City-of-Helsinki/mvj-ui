// @flow
import React, {Fragment, PureComponent} from 'react';
import {connect} from 'react-redux';
import {Row, Column} from 'react-foundation';

import Authorization from '$components/authorization/Authorization';
import {getUserFullName} from '$src/users/helpers';
import {getUsersPermissions} from '$src/usersPermissions/selectors';
import {FormNames, ViewModes} from '$src/enums';
import WhiteBox from '$components/content/WhiteBox';
import ExternalLink from '$components/links/ExternalLink';
import FormText from '$components/form/FormText';
import FormTextTitle from '$components/form/FormTextTitle';
import Collapse from '$components/collapse/Collapse';
import Divider from '$components/content/Divider';
import Title from '$components/content/Title';
import SubTitle from '$components/content/SubTitle';
import type {UsersPermissions as UsersPermissionsType} from '$src/usersPermissions/types';
import {getAttributes, getCollapseStateByKey, getCurrentPlotSearch, getPlanUnit} from '$src/plotSearch/selectors';
import {receiveCollapseStates} from '$src/plotSearch/actions';
import {PlotSearchFieldTitles} from '$src/plotSearch/enums';
import PlotSearchSite from './PlotSearchSite';
import {getContentBasicInformation} from '$src/plotSearch/helpers';
import {getUiDataPlotSearchKey} from '$src/uiData/helpers';
import {
  getFieldOptions,
  getLabelOfOption,
  formatDate,
  isFieldAllowedToRead,
} from '$util/helpers';
import {
  getHoursAndMinutes,
} from '$util/date';
import {
  PlotSearchFieldPaths,
} from '$src/plotSearch/enums';
import type {Attributes} from '$src/types';
import type {PlotSearch} from '$src/plotSearch/types';
// import SingleRadioInput from '$components/inputs/SingleRadioInput';
import {
  fetchPlanUnit,
  fetchPlanUnitAttributes,
} from '$src/plotSearch/actions';

type Props = {
  usersPermissions: UsersPermissionsType,
  basicInformationCollapseState: Boolean,
  receiveCollapseStates: Function,
  attributes: Attributes,
  currentPlotSearch: PlotSearch,
  fetchPlanUnit: Function,
  fetchPlanUnitAttributes: Function,
  planUnit: Object,
}

type State = {

}

class BasicInfo extends PureComponent<Props, State> {
  state = {
  }

  handleBasicInfoCollapseToggle = (val: boolean) => {
    const {receiveCollapseStates} = this.props;

    receiveCollapseStates({
      [ViewModes.READONLY]: {
        [FormNames.PLOT_SEARCH_BASIC_INFORMATION]: {
          basic_information: val,
        },
      },
    });
  }

  render (){
    const {
      // usersPermissions,
      basicInformationCollapseState,
      attributes,
      currentPlotSearch,
    } = this.props;

    const plotSearch = getContentBasicInformation(currentPlotSearch);
    const typeOptions = getFieldOptions(attributes, PlotSearchFieldPaths.TYPE);
    const subtypeOptions = getFieldOptions(attributes, PlotSearchFieldPaths.SUBTYPE);
    // const decisionOptions = getFieldOptions(attributes, 'decision.child.children.type');
    // const stageOptions = getFieldOptions(attributes, 'stage');
  
    return (
      <Fragment>
        <Title>
          {PlotSearchFieldTitles.BASIC_INFO}
        </Title>
        <Divider />
        <Row className='summary__content-wrapper'>
          <Column small={12}>
            <Collapse
              defaultOpen={basicInformationCollapseState !== undefined ? basicInformationCollapseState : true}
              headerTitle={PlotSearchFieldTitles.BASIC_INFO}
              onToggle={this.handleBasicInfoCollapseToggle}
            >
              <Row>
                <Authorization allow={isFieldAllowedToRead(attributes, 'name')}>
                  <Column small={12} large={8}>
                    <FormTextTitle uiDataKey={getUiDataPlotSearchKey('name')}>
                      {PlotSearchFieldTitles.NAME}
                    </FormTextTitle>
                    <FormText>{plotSearch.name}</FormText>
                  </Column>
                </Authorization>
                <Authorization allow={isFieldAllowedToRead(attributes, 'preparer')}>
                  <Column small={12} medium={6} large={2}>
                    <FormTextTitle uiDataKey={getUiDataPlotSearchKey('preparer')}>
                      {PlotSearchFieldTitles.PREPARER}
                    </FormTextTitle>
                    <FormText>{getUserFullName(plotSearch.preparer) || '-'}</FormText>
                  </Column>
                </Authorization>
                <Authorization allow={isFieldAllowedToRead(attributes, 'applications')}>
                  <Column small={12} medium={6} large={2}>
                    <FormTextTitle uiDataKey={getUiDataPlotSearchKey('applications')}>
                      {PlotSearchFieldTitles.APPLICATIONS}
                    </FormTextTitle>
                    {plotSearch.applications && plotSearch.applications.map((application, index) => 
                      <FormText key={index}>
                        <ExternalLink
                          className='no-margin'
                          href={`${application.id}`}
                          text={application.name}
                        />
                      </FormText>
                    )}
                  </Column>
                </Authorization>
              </Row>
              <Row>
                <Authorization allow={isFieldAllowedToRead(attributes, 'type')}>
                  <Column small={12} medium={6} large={3}>
                    <FormTextTitle uiDataKey={getUiDataPlotSearchKey('type')}>
                      {PlotSearchFieldTitles.TYPE}
                    </FormTextTitle>
                    <FormText>{getLabelOfOption(typeOptions, plotSearch.type) || '-'}</FormText>
                  </Column>
                </Authorization>
                <Authorization allow={isFieldAllowedToRead(attributes, 'subtype')}>
                  <Column small={12} medium={6} large={3}>
                    <FormTextTitle uiDataKey={getUiDataPlotSearchKey('subtype')}>
                      {PlotSearchFieldTitles.SUBTYPE}
                    </FormTextTitle>
                    <FormText>{getLabelOfOption(subtypeOptions, plotSearch.subtype) || '-'}</FormText>
                  </Column>
                </Authorization>
                <Authorization allow={isFieldAllowedToRead(attributes, 'begin_at')}>
                  <Column small={6} medium={4} large={1}>
                    <FormTextTitle uiDataKey={getUiDataPlotSearchKey('begin_at')}>
                      {PlotSearchFieldTitles.START_DATE}
                    </FormTextTitle>  
                    <FormText>{formatDate(plotSearch.begin_at) || '-'}</FormText>
                  </Column>
                </Authorization>
                <Authorization allow={isFieldAllowedToRead(attributes, 'begin_at')}>
                  <Column small={6} medium={4} large={1}>
                    <FormTextTitle>
                      {PlotSearchFieldTitles.CLOCK}
                    </FormTextTitle>
                    <FormText>{getHoursAndMinutes(plotSearch.begin_at) || '-'}</FormText>
                  </Column>
                </Authorization>
                <Authorization allow={isFieldAllowedToRead(attributes, 'end_at')}>
                  <Column small={6} medium={4} large={1}>
                    <FormTextTitle uiDataKey={getUiDataPlotSearchKey('end_at')}>
                      {PlotSearchFieldTitles.END_DATE}
                    </FormTextTitle>
                    <FormText>{formatDate(plotSearch.end_at) || '-'}</FormText>
                  </Column>
                </Authorization>
                <Authorization allow={isFieldAllowedToRead(attributes, 'end_at')}>
                  <Column small={6} medium={4} large={1}>
                    <FormTextTitle>
                      {PlotSearchFieldTitles.CLOCK}
                    </FormTextTitle>
                    <FormText>{getHoursAndMinutes(plotSearch.end_at) || '-'}</FormText>
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
              {/* <Row>
                <Column small={12} medium={6} large={6}>
                  <FormTextTitle>
                    {PlotSearchFieldTitles.DECISION}
                  </FormTextTitle>
                  {!!plotSearch.decisions && plotSearch.decisions.map((decision, index) => 
                    <FormText key={index}>
                      <ExternalLink
                        className='no-margin'
                        href={`${decision.id}`}
                        text={getLabelOfOption(decisionOptions, decision.type) || '-'}
                      />
                    </FormText>
                  )}
                </Column>
                <Column small={6} medium={4} large={4}>
                  <FormTextTitle>
                    {PlotSearchFieldTitles.DECISION_TO_LIST}
                  </FormTextTitle>
                  {!!plotSearch.decisions && plotSearch.decisions.map((decision, index) => 
                    <Row key={index}>
                      <Column>
                        <SingleRadioInput
                          name={''}
                          label={''}
                          checked={!!decision.decision_to_list}
                          onChange={()=>{}}
                          onClick={()=>{}}
                          onKeyDown={()=>{}}
                        />
                      </Column>
                    </Row>
                  )}
                </Column>

                <Column small={6} medium={2} large={2}>
                  <FormTitleAndText
                    title={PlotSearchFieldTitles.STEP}
                    text={getLabelOfOption(stageOptions, plotSearch.stage) || '-'}
                  />
                </Column>
              </Row> */}
              {(!!plotSearch.targets && plotSearch.targets.
                filter(plotSearchSite => plotSearchSite.target_type === 'searchable').length > 0) && <WhiteBox>
                <SubTitle>
                  {'HAETTAVAT KOHTEET'}
                </SubTitle>
                {!!plotSearch.targets && plotSearch.targets.
                  filter(plotSearchSite => plotSearchSite.target_type === 'searchable').
                  map((plotSearchSite, index) => {
                    return(
                      <Row key={index}>
                        <PlotSearchSite
                          plotSearchSite={plotSearchSite}
                          index={index}
                        />
                      </Row>
                    );
                  })}
              </WhiteBox>}
              {(!!plotSearch.targets && plotSearch.targets.
                filter(plotSearchSite => plotSearchSite.target_type === 'procedural_reservation').length > 0) && <WhiteBox>
                <SubTitle>
                  {'MENETTELYVARAUS'}
                </SubTitle>
                {!!plotSearch.targets && plotSearch.targets.
                  filter(plotSearchSite => plotSearchSite.target_type === 'procedural_reservation').
                  map((plotSearchSite, index) => {
                    return(
                      <Row key={index}>
                        <PlotSearchSite
                          plotSearchSite={plotSearchSite}
                          index={index}
                        />
                      </Row>
                    );
                  })}
              </WhiteBox>}
              {(!!plotSearch.targets && plotSearch.targets.
                filter(plotSearchSite => plotSearchSite.target_type === 'direct_reservation').length > 0) && <WhiteBox>
                <SubTitle>
                  {'SUORAVARAUS'}
                </SubTitle>
                {!!plotSearch.targets && plotSearch.targets.
                  filter(plotSearchSite => plotSearchSite.target_type === 'direct_reservation').
                  map((plotSearchSite, index) => {
                    return(
                      <Row key={index}>
                        <PlotSearchSite
                          plotSearchSite={plotSearchSite}
                          index={index}
                        />
                      </Row>
                    );
                  })}
              </WhiteBox>}
            </Collapse>
          </Column>
        </Row>
      </Fragment>
    );
  }
}

export default connect(
  (state) => {
    return {
      usersPermissions: getUsersPermissions(state),
      basicInformationCollapseState: getCollapseStateByKey(state, `${ViewModes.READONLY}.${FormNames.PLOT_SEARCH_BASIC_INFORMATION}.basic_information`),
      attributes: getAttributes(state),
      pl: getAttributes(state),
      planUnit: getPlanUnit(state),
      currentPlotSearch: getCurrentPlotSearch(state),
    };
  },
  {
    receiveCollapseStates,
    fetchPlanUnitAttributes,
    fetchPlanUnit,
  }
)(BasicInfo);
