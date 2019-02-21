// @flow
import React, {Fragment, PureComponent} from 'react';
import {connect} from 'react-redux';
import {Row, Column} from 'react-foundation';

import Authorization from '$components/authorization/Authorization';
import Collapse from '$components/collapse/Collapse';
import Divider from '$components/content/Divider';
import ExternalLink from '$components/links/ExternalLink';
import FormText from '$components/form/FormText';
import FormTextTitle from '$components/form/FormTextTitle';
import ListItem from '$components/content/ListItem';
import ListItems from '$components/content/ListItems';
import RelatedLeases from './RelatedLeases';
import RightSubtitle from '$components/content/RightSubtitle';
import ShowMore from '$components/showMore/ShowMore';
import SummaryLeaseInfo from './SummaryLeaseInfo';

import {receiveCollapseStates} from '$src/leases/actions';
import {Methods, ViewModes} from '$src/enums';
import {FormNames, LeaseFieldTitles, LeaseFieldPaths} from '$src/leases/enums';
import {UiDataPrefixes} from '$src/uiData/enums';
import {getContactFullName} from '$src/contacts/helpers';
import {getContentSummary} from '$src/leases/helpers';
import {getKeyWithPrefix, getUiDataValue} from '$src/uiData/helpers';
import {
  formatDate,
  formatNumber,
  getFieldOptions,
  getLabelOfOption,
  getReferenceNumberLink,
  isEmptyValue,
  isFieldAllowedToRead,
  isMethodAllowed,
} from '$util/helpers';
import {getUserFullName} from '$src/users/helpers';
import {getRouteById, Routes} from '$src/root/routes';
import {getMethods as getInfillDevelopmentMethods} from '$src/infillDevelopment/selectors';
import {getAttributes, getCollapseStateByKey, getCurrentLease} from '$src/leases/selectors';
import {getUiDataList} from '$src/uiData/selectors';

import type {Attributes, Methods as MethodsType} from '$src/types';
import type {Lease} from '$src/leases/types';
import type {UiDataList} from '$src/uiData/types';

type Props = {
  attributes: Attributes,
  collapseStateBasic: boolean,
  collapseStateStatistical: boolean,
  currentLease: Lease,
  infillDevelopmentMethods: MethodsType,
  receiveCollapseStates: Function,
  uiDataList: UiDataList,
}

type State = {
  attributes: Attributes,
  classificationOptions: Array<Object>,
  currentLease: Lease,
  financingOptions: Array<Object>,
  hitasOptions: Array<Object>,
  intendedUseOptions: Array<Object>,
  managementOptions: Array<Object>,
  noticePeriodOptions: Array<Object>,
  regulationOptions: Array<Object>,
  specialProjectOptions: Array<Object>,
  stateOptions: Array<Object>,
  statisticalUseOptions: Array<Object>,
  summary: Object,
  supportiveHousingOptions: Array<Object>,
}

class Summary extends PureComponent<Props, State> {
  state = {
    attributes: null,
    classificationOptions: [],
    currentLease: {},
    financingOptions: [],
    hitasOptions: [],
    intendedUseOptions: [],
    lessorOptions: [],
    managementOptions: [],
    noticePeriodOptions: [],
    regulationOptions: [],
    specialProjectOptions: [],
    stateOptions: [],
    statisticalUseOptions: [],
    summary: {},
    supportiveHousingOptions: [],
  }

  static getDerivedStateFromProps(props: Props, state: State) {
    const newState: any = {};

    if(props.attributes !== state.attributes) {
      newState.attributes = props.attributes;
      newState.classificationOptions = getFieldOptions(props.attributes, LeaseFieldPaths.CLASSIFICATION);
      newState.financingOptions = getFieldOptions(props.attributes, LeaseFieldPaths.FINANCING);
      newState.hitasOptions = getFieldOptions(props.attributes, LeaseFieldPaths.HITAS);
      newState.intendedUseOptions = getFieldOptions(props.attributes, LeaseFieldPaths.INTENDED_USE);
      newState.managementOptions = getFieldOptions(props.attributes, LeaseFieldPaths.MANAGEMENT);
      newState.noticePeriodOptions = getFieldOptions(props.attributes, LeaseFieldPaths.NOTICE_PERIOD);
      newState.regulationOptions = getFieldOptions(props.attributes, LeaseFieldPaths.REGULATION);
      newState.specialProjectOptions = getFieldOptions(props.attributes, LeaseFieldPaths.SPECIAL_PROJECT);
      newState.stateOptions = getFieldOptions(props.attributes, LeaseFieldPaths.STATE);
      newState.statisticalUseOptions = getFieldOptions(props.attributes, LeaseFieldPaths.STATISTICAL_USE);
      newState.supportiveHousingOptions = getFieldOptions(props.attributes, LeaseFieldPaths.SUPPORTIVE_HOUSING);
    }

    if(props.currentLease !== state.currentLease) {
      newState.currentLease = props.currentLease;
      newState.summary = getContentSummary(props.currentLease);
    }

    return newState;
  }

  handleBasicInfoToggle = (val: boolean) => {
    const {receiveCollapseStates} = this.props;

    receiveCollapseStates({
      [ViewModes.READONLY]: {
        [FormNames.SUMMARY]: {
          basic: val,
        },
      },
    });
  }

  handleStatisticalInfoToggle = (val: boolean) => {
    const {receiveCollapseStates} = this.props;

    receiveCollapseStates({
      [ViewModes.READONLY]: {
        [FormNames.SUMMARY]: {
          statistical: val,
        },
      },
    });
  }

  render() {
    const {
      classificationOptions,
      financingOptions,
      hitasOptions,
      intendedUseOptions,
      managementOptions,
      noticePeriodOptions,
      regulationOptions,
      specialProjectOptions,
      stateOptions,
      statisticalUseOptions,
      summary,
      supportiveHousingOptions,
    } = this.state;
    const {
      attributes,
      collapseStateBasic,
      collapseStateStatistical,
      infillDevelopmentMethods,
      uiDataList,
    } = this.props;
    const infillDevelopmentCompensations = summary.infill_development_compensations;

    return (
      <Fragment>
        <h2>Yhteenveto</h2>
        <Authorization allow={isFieldAllowedToRead(attributes, LeaseFieldPaths.CLASSIFICATION)}>
          <RightSubtitle
            className='publicity-label'
            text={summary.classification
              ? getLabelOfOption(classificationOptions, summary.classification)
              : '-'
            }
          />
        </Authorization>
        <Divider />
        <Row className='summary__content-wrapper'>
          <Column small={12} medium={8} large={9}>
            <Collapse
              defaultOpen={collapseStateBasic !== undefined ? collapseStateBasic : true}
              headerTitle='Perustiedot'
              onToggle={this.handleBasicInfoToggle}
            >
              <Row>
                <Column small={12} medium={6} large={4}>
                  <Authorization allow={isFieldAllowedToRead(attributes, LeaseFieldPaths.STATE)}>
                    <FormTextTitle infoText={getUiDataValue(uiDataList, getKeyWithPrefix(UiDataPrefixes.LEASE, LeaseFieldPaths.STATE))}>{LeaseFieldTitles.STATE}</FormTextTitle>
                    <FormText>{getLabelOfOption(stateOptions, summary.state) || '-'}</FormText>
                  </Authorization>
                </Column>
                <Column small={12} medium={6} large={4}>
                  <Authorization allow={isFieldAllowedToRead(attributes, LeaseFieldPaths.START_DATE)}>
                    <FormTextTitle>{LeaseFieldTitles.START_DATE}</FormTextTitle>
                    <FormText>{formatDate(summary.start_date) || '-'}</FormText>
                  </Authorization>
                </Column>
                <Column small={12} medium={6} large={4}>
                  <Authorization allow={isFieldAllowedToRead(attributes, LeaseFieldPaths.END_DATE)}>
                    <FormTextTitle>{LeaseFieldTitles.END_DATE}</FormTextTitle>
                    <FormText>{formatDate(summary.end_date) || '-'}</FormText>
                  </Authorization>
                </Column>
              </Row>
              <Row>
                <Column small={12} medium={6} large={4}>
                  <Authorization allow={isFieldAllowedToRead(attributes, LeaseFieldPaths.LESSOR)}>
                    <FormTextTitle>{LeaseFieldTitles.LESSOR}</FormTextTitle>
                    <FormText>{getContactFullName(summary.lessor) || '-'}</FormText>
                  </Authorization>
                </Column>
                <Column small={12} medium={6} large={4}>
                  <Authorization allow={isFieldAllowedToRead(attributes, LeaseFieldPaths.PREPARER)}>
                    <FormTextTitle>{LeaseFieldTitles.PREPARER}</FormTextTitle>
                    <FormText>{getUserFullName(summary.preparer) || '-'}</FormText>
                  </Authorization>
                </Column>
                <Authorization allow={isFieldAllowedToRead(attributes, LeaseFieldPaths.CLASSIFICATION)}>
                  <Column small={12} medium={6} large={4}>
                    <FormTextTitle>{LeaseFieldTitles.CLASSIFICATION}</FormTextTitle>
                    <FormText>{getLabelOfOption(classificationOptions, summary.classification) || '-'}</FormText>
                  </Column>
                </Authorization>
              </Row>
              <Row>
                <Column small={12} medium={6} large={4}>
                  <Authorization allow={isFieldAllowedToRead(attributes, LeaseFieldPaths.INTENDED_USE)}>
                    <FormTextTitle>{LeaseFieldTitles.INTENDED_USE}</FormTextTitle>
                    <FormText>{getLabelOfOption(intendedUseOptions, summary.intended_use) || '-'}</FormText>
                  </Authorization>
                </Column>
                <Column small={12} medium={6} large={8}>
                  <Authorization allow={isFieldAllowedToRead(attributes, LeaseFieldPaths.INTENDED_USE_NOTE)}>
                    <FormTextTitle>{LeaseFieldTitles.INTENDED_USE_NOTE}</FormTextTitle>
                    <ShowMore text={summary.intended_use_note || '-'} />
                  </Authorization>
                </Column>
              </Row>
              <Row>
                <Column small={12} medium={6} large={4}>
                  <Authorization allow={isFieldAllowedToRead(attributes, LeaseFieldPaths.FINANCING)}>
                    <FormTextTitle>{LeaseFieldTitles.FINANCING}</FormTextTitle>
                    <FormText>{getLabelOfOption(financingOptions, summary.financing) || '-'}</FormText>
                  </Authorization>
                </Column>
                <Column small={12} medium={6} large={4}>
                  <Authorization allow={isFieldAllowedToRead(attributes, LeaseFieldPaths.MANAGEMENT)}>
                    <FormTextTitle>{LeaseFieldTitles.MANAGEMENT}</FormTextTitle>
                    <FormText>{getLabelOfOption(managementOptions, summary.management) || '-'}</FormText>
                  </Authorization>
                </Column>
                <Column small={12} medium={6} large={4}>
                  <Authorization allow={isFieldAllowedToRead(attributes, LeaseFieldPaths.TRANSFERABLE)}>
                    <FormTextTitle>{LeaseFieldTitles.TRANSFERABLE}</FormTextTitle>
                    <FormText>{summary.transferable ? 'Kyllä' : 'Ei'}</FormText>
                  </Authorization>
                </Column>
                <Column small={12} medium={6} large={4}>
                  <Authorization allow={isFieldAllowedToRead(attributes, LeaseFieldPaths.HITAS)}>
                    <FormTextTitle>{LeaseFieldTitles.HITAS}</FormTextTitle>
                    <FormText>{getLabelOfOption(hitasOptions, summary.hitas) || '-'}</FormText>
                  </Authorization>
                </Column>
                {/* TODO: Get vuokrausperuste via API */}
                <Column small={12} medium={6} large={4}>
                  <FormTextTitle>Vuokrausperuste</FormTextTitle>
                  <FormText>-</FormText>
                </Column>
                <Column small={12} medium={6} large={4}>
                  <Authorization allow={isMethodAllowed(infillDevelopmentMethods, Methods.GET)}>
                    <FormTextTitle>{LeaseFieldTitles.INFILL_DEVELOPMENT_COMPENSATIONS}</FormTextTitle>
                    {!infillDevelopmentCompensations || !infillDevelopmentCompensations.length
                      ? <FormText>-</FormText>
                      : <ListItems>
                        {infillDevelopmentCompensations.map((item) =>
                          <ListItem key={item.id}>
                            <ExternalLink
                              className='no-margin'
                              href={`${getRouteById(Routes.INFILL_DEVELOPMENTS)}/${item.id}`}
                              text={item.name || item.id}
                            />
                          </ListItem>
                        )}
                      </ListItems>
                    }
                  </Authorization>
                </Column>
              </Row>
              <Row>
                <Column small={12} medium={6} large={4}>
                  <Authorization allow={isFieldAllowedToRead(attributes, LeaseFieldPaths.NOTICE_PERIOD)}>
                    <FormTextTitle>{LeaseFieldTitles.NOTICE_PERIOD}</FormTextTitle>
                    <FormText>{getLabelOfOption(noticePeriodOptions, summary.notice_period) || '-'}</FormText>
                  </Authorization>
                </Column>
                <Column small={12} medium={6} large={8}>
                  <Authorization allow={isFieldAllowedToRead(attributes, LeaseFieldPaths.NOTICE_NOTE)}>
                    <FormTextTitle>{LeaseFieldTitles.NOTICE_NOTE}</FormTextTitle>
                    <ShowMore text={summary.notice_note || '-'} />
                  </Authorization>
                </Column>
              </Row>
              <Row>
                <Column small={12} medium={6} large={4}>
                  <Authorization allow={isFieldAllowedToRead(attributes, LeaseFieldPaths.REFERENCE_NUMBER)}>
                    <FormTextTitle>{LeaseFieldTitles.REFERENCE_NUMBER}</FormTextTitle>
                    <FormText>{summary.reference_number
                      ? <ExternalLink
                        className='no-margin'
                        href={getReferenceNumberLink(summary.reference_number)}
                        text={summary.reference_number} />
                      : '-'}</FormText>
                  </Authorization>
                </Column>
                <Column small={12} medium={6} large={8}>
                  <Authorization allow={isFieldAllowedToRead(attributes, LeaseFieldPaths.NOTE)}>
                    <FormTextTitle>{LeaseFieldTitles.NOTE}</FormTextTitle>
                    <ShowMore text={summary.note || '-'} />
                  </Authorization>
                </Column>
              </Row>
              <Row>
                <Column small={12} medium={6} large={4}>
                  <Authorization allow={isFieldAllowedToRead(attributes, LeaseFieldPaths.IS_SUBJECT_TO_VAT)}>
                    <FormTextTitle>{LeaseFieldTitles.IS_SUBJECT_TO_VAT}</FormTextTitle>
                    <FormText>{summary.is_subject_to_vat ? 'Kyllä' : 'Ei'}</FormText>
                  </Authorization>
                </Column>
                <Column small={12} medium={6} large={4}>
                  <Authorization allow={isFieldAllowedToRead(attributes, LeaseFieldPaths.ARRANGEMENT_DECISION)}>
                    <FormTextTitle>{LeaseFieldTitles.ARRANGEMENT_DECISION}</FormTextTitle>
                    <FormText>{summary.arrangement_decision ? 'Kyllä' : 'Ei'}</FormText>
                  </Authorization>
                </Column>
              </Row>

              <SummaryLeaseInfo />
            </Collapse>

            <Collapse
              defaultOpen={collapseStateStatistical !== undefined ? collapseStateStatistical : true}
              headerTitle='Tilastotiedot'
              onToggle={this.handleStatisticalInfoToggle}
            >
              <Row>
                <Column small={12} medium={6} large={4}>
                  <Authorization allow={isFieldAllowedToRead(attributes, LeaseFieldPaths.SPECIAL_PROJECT)}>
                    <FormTextTitle>{LeaseFieldTitles.SPECIAL_PROJECT}</FormTextTitle>
                    <FormText>{getLabelOfOption(specialProjectOptions, summary.special_project) || '-'}</FormText>
                  </Authorization>
                </Column>
                <Column small={12} medium={6} large={4}>
                  <Authorization allow={isFieldAllowedToRead(attributes, LeaseFieldPaths.SUPPORTIVE_HOUSING)}>
                    <FormTextTitle>{LeaseFieldTitles.SUPPORTIVE_HOUSING}</FormTextTitle>
                    <FormText>{getLabelOfOption(supportiveHousingOptions, summary.supportive_housing) || '-'}</FormText>
                  </Authorization>
                </Column>
                <Column small={12} medium={6} large={4}>
                  <Authorization allow={isFieldAllowedToRead(attributes, LeaseFieldPaths.STATISTICAL_USE)}>
                    <FormTextTitle>{LeaseFieldTitles.STATISTICAL_USE}</FormTextTitle>
                    <FormText>{getLabelOfOption(statisticalUseOptions, summary.statistical_use) || '-'}</FormText>
                  </Authorization>
                </Column>
              </Row>
              <Row>
                <Column small={12} medium={6} large={4}>
                  <Authorization allow={isFieldAllowedToRead(attributes, LeaseFieldPaths.REAL_ESTATE_DEVELOPER)}>
                    <FormTextTitle>{LeaseFieldTitles.REAL_ESTATE_DEVELOPER}</FormTextTitle>
                    <FormText>{summary.real_estate_developer || '-'}</FormText>
                  </Authorization>
                </Column>
                <Column small={12} medium={6} large={4}>
                  <Authorization allow={isFieldAllowedToRead(attributes, LeaseFieldPaths.CONVEYANCE_NUMBER)}>
                    <FormTextTitle>{LeaseFieldTitles.CONVEYANCE_NUMBER}</FormTextTitle>
                    <FormText>{summary.conveyance_number || '-'}</FormText>
                  </Authorization>
                </Column>
                <Column small={12} medium={6} large={4}>
                  <Authorization allow={isFieldAllowedToRead(attributes, LeaseFieldPaths.BUILDING_SELLING_PRICE)}>
                    <FormTextTitle>{LeaseFieldTitles.BUILDING_SELLING_PRICE}</FormTextTitle>
                    <FormText>{!isEmptyValue(summary.building_selling_price) ? `${formatNumber(summary.building_selling_price)} €` : '-'}</FormText>
                  </Authorization>
                </Column>
              </Row>
              <Row>
                <Column small={12} medium={6} large={4}>
                  <Authorization allow={isFieldAllowedToRead(attributes, LeaseFieldPaths.REGULATED)}>
                    <FormTextTitle>{LeaseFieldTitles.REGULATED}</FormTextTitle>
                    <FormText>{summary.regulated ? 'Kyllä' : 'Ei'}</FormText>
                  </Authorization>
                </Column>
                <Column small={12} medium={6} large={4}>
                  <Authorization allow={isFieldAllowedToRead(attributes, LeaseFieldPaths.REGULATION)}>
                    <FormTextTitle>{LeaseFieldTitles.REGULATION}</FormTextTitle>
                    <FormText>{getLabelOfOption(regulationOptions, summary.regulation) || '-'}</FormText>
                  </Authorization>
                </Column>
              </Row>
            </Collapse>
          </Column>

          <Authorization allow={isFieldAllowedToRead(attributes, LeaseFieldPaths.RELATED_LEASES)}>
            <Column small={12} medium={4} large={3}>
              <RelatedLeases />
            </Column>
          </Authorization>
        </Row>
      </Fragment>
    );
  }
}

export default connect(
  (state) => {
    return {
      attributes: getAttributes(state),
      collapseStateBasic: getCollapseStateByKey(state, `${ViewModes.READONLY}.${FormNames.SUMMARY}.basic`),
      collapseStateStatistical: getCollapseStateByKey(state, `${ViewModes.READONLY}.${FormNames.SUMMARY}.statistical`),
      currentLease: getCurrentLease(state),
      infillDevelopmentMethods: getInfillDevelopmentMethods(state),
      uiDataList: getUiDataList(state),
    };
  },
  {
    receiveCollapseStates,
  }
)(Summary);
