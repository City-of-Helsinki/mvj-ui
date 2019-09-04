// @flow
import React, {Fragment, PureComponent} from 'react';
import {connect} from 'react-redux';
import {Row, Column} from 'react-foundation';
import get from 'lodash/get';

import Authorization from '$components/authorization/Authorization';
import Collapse from '$components/collapse/Collapse';
import Divider from '$components/content/Divider';
import ExternalLink from '$components/links/ExternalLink';
import FormText from '$components/form/FormText';
import FormTextTitle from '$components/form/FormTextTitle';
import ListItem from '$components/content/ListItem';
import ListItems from '$components/content/ListItems';
import RelatedLeases from './RelatedLeases';
import ShowMore from '$components/showMore/ShowMore';
import SummaryLeaseInfo from './SummaryLeaseInfo';
import Title from '$components/content/Title';
import WarningContainer from '$components/content/WarningContainer';
import {receiveCollapseStates} from '$src/leases/actions';
import {FormNames, ViewModes} from '$src/enums';
import {LeaseContractsFieldPaths, LeaseFieldTitles, LeaseFieldPaths} from '$src/leases/enums';
import {UsersPermissions} from '$src/usersPermissions/enums';
import {getContactFullName} from '$src/contacts/helpers';
import {getContentLeaseSummary} from '$src/leases/helpers';
import {getUiDataLeaseKey} from '$src/uiData/helpers';
import {
  formatDate,
  formatNumber,
  getFieldOptions,
  getLabelOfOption,
  getReferenceNumberLink,
  hasPermissions,
  isEmptyValue,
  isFieldAllowedToRead,
} from '$util/helpers';
import {getUserFullName} from '$src/users/helpers';
import {getRouteById, Routes} from '$src/root/routes';
import {getAttributes, getCollapseStateByKey, getCurrentLease} from '$src/leases/selectors';
import {getUsersPermissions} from '$src/usersPermissions/selectors';

import type {Attributes} from '$src/types';
import type {Lease} from '$src/leases/types';
import type {UsersPermissions as UsersPermissionsType} from '$src/usersPermissions/types';

type Props = {
  attributes: Attributes,
  collapseStateBasic: boolean,
  collapseStateStatistical: boolean,
  currentLease: Lease,
  receiveCollapseStates: Function,
  usersPermissions: UsersPermissionsType,
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
  reservationProcedureOptions: Array<Object>,
  specialProjectOptions: Array<Object>,
  stateOptions: Array<Object>,
  statisticalUseOptions: Array<Object>,
  summary: Object,
  supportiveHousingOptions: Array<Object>,
  collapseBasisOfRents: boolean,
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
    reservationProcedureOptions: [],
    specialProjectOptions: [],
    stateOptions: [],
    statisticalUseOptions: [],
    summary: {},
    supportiveHousingOptions: [],
    collapseBasisOfRents: true,
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
      newState.reservationProcedureOptions = getFieldOptions(props.attributes, LeaseFieldPaths.RESERVATION_PROCEDURE);
      newState.specialProjectOptions = getFieldOptions(props.attributes, LeaseFieldPaths.SPECIAL_PROJECT);
      newState.stateOptions = getFieldOptions(props.attributes, LeaseFieldPaths.STATE);
      newState.statisticalUseOptions = getFieldOptions(props.attributes, LeaseFieldPaths.STATISTICAL_USE);
      newState.supportiveHousingOptions = getFieldOptions(props.attributes, LeaseFieldPaths.SUPPORTIVE_HOUSING);
    }

    if(props.currentLease !== state.currentLease) {
      newState.currentLease = props.currentLease;
      newState.summary = getContentLeaseSummary(props.currentLease);
    }

    return newState;
  }

  handleCollapseToggle = (key: string, val: boolean) => {
    const {receiveCollapseStates} = this.props;

    receiveCollapseStates({
      [ViewModes.READONLY]: {
        [FormNames.LEASE_SUMMARY]: {
          [key]: val,
        },
      },
    });
  }

  handleBasicInfoCollapseToggle = (val: boolean) => {
    this.handleCollapseToggle('basic', val);
  }

  handleStatisticalInfoCollapseToggle = (val: boolean) => {
    this.handleCollapseToggle('statistical', val);
  }

  handleCollapseBasisOfRentsClick = () => {
    this.setState({
      collapseBasisOfRents: !this.state.collapseBasisOfRents,
    });
  }

  handleCollapseBasisOfRentsKeyDown = (e: any) => {
    if(e.keyCode === 13) {
      e.preventDefault();
      this.handleCollapseBasisOfRentsClick();
    }
  };

  render() {
    const {
      classificationOptions,
      financingOptions,
      hitasOptions,
      intendedUseOptions,
      managementOptions,
      noticePeriodOptions,
      regulationOptions,
      reservationProcedureOptions,
      specialProjectOptions,
      stateOptions,
      statisticalUseOptions,
      summary,
      supportiveHousingOptions,
      collapseBasisOfRents,
    } = this.state;
    const {
      attributes,
      collapseStateBasic,
      collapseStateStatistical,
      usersPermissions,
    } = this.props;
    const infillDevelopmentCompensations = summary.infill_development_compensations;
    const matchingBasisOfRents = summary.matching_basis_of_rents;

    return (
      <Fragment>
        <Title uiDataKey={getUiDataLeaseKey(LeaseFieldPaths.SUMMARY)}>
          {LeaseFieldTitles.SUMMARY}
        </Title>
        <Authorization allow={isFieldAllowedToRead(attributes, LeaseFieldPaths.CLASSIFICATION)}>
          <WarningContainer hideIcon>
            {summary.classification
              ? getLabelOfOption(classificationOptions, summary.classification)
              : '-'
            }
          </WarningContainer>
        </Authorization>
        <Divider />
        <Row className='summary__content-wrapper'>
          <Column small={12} medium={8} large={9}>
            <Collapse
              defaultOpen={collapseStateBasic !== undefined ? collapseStateBasic : true}
              headerTitle={LeaseFieldTitles.SUMMARY_BASIC_INFO}
              onToggle={this.handleBasicInfoCollapseToggle}
              uiDataKey={getUiDataLeaseKey(LeaseFieldPaths.SUMMARY_BASIC_INFO)}
            >
              <Row>
                <Column small={12} medium={6} large={4}>
                  <Authorization allow={isFieldAllowedToRead(attributes, LeaseFieldPaths.STATE)}>
                    <FormTextTitle uiDataKey={getUiDataLeaseKey(LeaseFieldPaths.STATE)}>
                      {LeaseFieldTitles.STATE}
                    </FormTextTitle>
                    <FormText>{getLabelOfOption(stateOptions, summary.state) || '-'}</FormText>
                  </Authorization>
                </Column>
                <Column small={12} medium={6} large={4}>
                  <Authorization allow={isFieldAllowedToRead(attributes, LeaseFieldPaths.START_DATE)}>
                    <FormTextTitle uiDataKey={getUiDataLeaseKey(LeaseFieldPaths.START_DATE)}>
                      {LeaseFieldTitles.START_DATE}
                    </FormTextTitle>
                    <FormText>{formatDate(summary.start_date) || '-'}</FormText>
                  </Authorization>
                </Column>
                <Column small={12} medium={6} large={4}>
                  <Authorization allow={isFieldAllowedToRead(attributes, LeaseFieldPaths.END_DATE)}>
                    <FormTextTitle uiDataKey={getUiDataLeaseKey(LeaseFieldPaths.END_DATE)}>
                      {LeaseFieldTitles.END_DATE}
                    </FormTextTitle>
                    <FormText>{formatDate(summary.end_date) || '-'}</FormText>
                  </Authorization>
                </Column>
              </Row>
              <Row>
                <Column small={12} medium={6} large={4}>
                  <Authorization allow={isFieldAllowedToRead(attributes, LeaseFieldPaths.LESSOR)}>
                    <FormTextTitle uiDataKey={getUiDataLeaseKey(LeaseFieldPaths.LESSOR)}>
                      {LeaseFieldTitles.LESSOR}
                    </FormTextTitle>
                    <FormText>{getContactFullName(summary.lessor) || '-'}</FormText>
                  </Authorization>
                </Column>
                <Column small={12} medium={6} large={4}>
                  <Authorization allow={isFieldAllowedToRead(attributes, LeaseFieldPaths.PREPARER)}>
                    <FormTextTitle uiDataKey={getUiDataLeaseKey(LeaseFieldPaths.PREPARER)}>
                      {LeaseFieldTitles.PREPARER}
                    </FormTextTitle>
                    <FormText>{getUserFullName(summary.preparer) || '-'}</FormText>
                  </Authorization>
                </Column>
                <Authorization allow={isFieldAllowedToRead(attributes, LeaseFieldPaths.CLASSIFICATION)}>
                  <Column small={12} medium={6} large={4}>
                    <FormTextTitle uiDataKey={getUiDataLeaseKey(LeaseFieldPaths.CLASSIFICATION)}>
                      {LeaseFieldTitles.CLASSIFICATION}
                    </FormTextTitle>
                    <FormText>{getLabelOfOption(classificationOptions, summary.classification) || '-'}</FormText>
                  </Column>
                </Authorization>
              </Row>
              <Row>
                <Column small={12} medium={6} large={4}>
                  <Authorization allow={isFieldAllowedToRead(attributes, LeaseFieldPaths.INTENDED_USE)}>
                    <FormTextTitle uiDataKey={getUiDataLeaseKey(LeaseFieldPaths.INTENDED_USE)}>
                      {LeaseFieldTitles.INTENDED_USE}
                    </FormTextTitle>
                    <FormText>{getLabelOfOption(intendedUseOptions, summary.intended_use) || '-'}</FormText>
                  </Authorization>
                </Column>
                <Column small={12} medium={6} large={8}>
                  <Authorization allow={isFieldAllowedToRead(attributes, LeaseFieldPaths.INTENDED_USE_NOTE)}>
                    <FormTextTitle uiDataKey={getUiDataLeaseKey(LeaseFieldPaths.INTENDED_USE_NOTE)}>
                      {LeaseFieldTitles.INTENDED_USE_NOTE}
                    </FormTextTitle>
                    <ShowMore text={summary.intended_use_note || '-'} />
                  </Authorization>
                </Column>
              </Row>
              <Row>
                <Column small={12} medium={6} large={4}>
                  <Authorization allow={isFieldAllowedToRead(attributes, LeaseFieldPaths.FINANCING)}>
                    <FormTextTitle uiDataKey={getUiDataLeaseKey(LeaseFieldPaths.FINANCING)}>
                      {LeaseFieldTitles.FINANCING}
                    </FormTextTitle>
                    <FormText>{getLabelOfOption(financingOptions, summary.financing) || '-'}</FormText>
                  </Authorization>
                </Column>
                <Column small={12} medium={6} large={4}>
                  <Authorization allow={isFieldAllowedToRead(attributes, LeaseFieldPaths.MANAGEMENT)}>
                    <FormTextTitle uiDataKey={getUiDataLeaseKey(LeaseFieldPaths.MANAGEMENT)}>
                      {LeaseFieldTitles.MANAGEMENT}
                    </FormTextTitle>
                    <FormText>{getLabelOfOption(managementOptions, summary.management) || '-'}</FormText>
                  </Authorization>
                </Column>
                <Column small={12} medium={6} large={4}>
                  <Authorization allow={isFieldAllowedToRead(attributes, LeaseFieldPaths.TRANSFERABLE)}>
                    <FormTextTitle uiDataKey={getUiDataLeaseKey(LeaseFieldPaths.TRANSFERABLE)}>
                      {LeaseFieldTitles.TRANSFERABLE}
                    </FormTextTitle>
                    <FormText>{summary.transferable ? 'Kyllä' : 'Ei'}</FormText>
                  </Authorization>
                </Column>
                <Column small={12} medium={6} large={4}>
                  <Authorization allow={isFieldAllowedToRead(attributes, LeaseFieldPaths.HITAS)}>
                    <FormTextTitle uiDataKey={getUiDataLeaseKey(LeaseFieldPaths.HITAS)}>
                      {LeaseFieldTitles.HITAS}
                    </FormTextTitle>
                    <FormText>{getLabelOfOption(hitasOptions, summary.hitas) || '-'}</FormText>
                  </Authorization>
                </Column>
                <Column small={12} medium={6} large={4}>
                  <Authorization allow={isFieldAllowedToRead(attributes, LeaseFieldPaths.RESERVATION_PROCEDURE)}>
                    <FormTextTitle uiDataKey={getUiDataLeaseKey(LeaseFieldPaths.RESERVATION_PROCEDURE)}>
                      {LeaseFieldTitles.RESERVATION_PROCEDURE}
                    </FormTextTitle>
                    <FormText>{getLabelOfOption(reservationProcedureOptions, summary.reservation_procedure) || '-'}</FormText>
                  </Authorization>
                </Column>
                <Column small={12} medium={6} large={4}>
                  <Authorization allow={hasPermissions(usersPermissions, UsersPermissions.VIEW_BASISOFRENT)}>
                    <FormTextTitle uiDataKey={getUiDataLeaseKey(LeaseFieldPaths.MATCHING_BASIS_OF_RENTS)}>
                      {LeaseFieldTitles.MATCHING_BASIS_OF_RENTS}
                    </FormTextTitle>
                    {!matchingBasisOfRents || !matchingBasisOfRents.length
                      ? <FormText>-</FormText>
                      : collapseBasisOfRents
                        ?<ListItems>
                          {matchingBasisOfRents.map((item, index) => {
                            const property = get(item, 'property_identifiers', [])[0];
                            return (
                              <ListItem key={`${index}`}>
                                <ExternalLink
                                  className='no-margin'
                                  href={`${getRouteById(Routes.RENT_BASIS)}/${item.id}`}
                                  text={property.identifier}
                                />
                              </ListItem>
                            );
                          })}
                          <a
                            onClick={this.handleCollapseBasisOfRentsClick}
                            onKeyDown={this.handleCollapseBasisOfRentsKeyDown}
                            tabIndex={0}
                          >
                            ...
                          </a>
                        </ListItems>
                        : <ListItems>
                          {matchingBasisOfRents.map((item, index1) => {
                            return get(item, 'property_identifiers', []).map((property, index2) =>
                              <ListItem key={`${index1}_${index2}`}>
                                <ExternalLink
                                  className='no-margin'
                                  href={`${getRouteById(Routes.RENT_BASIS)}/${item.id}`}
                                  text={property.identifier}
                                />
                              </ListItem>
                            );
                          })}
                        </ListItems>
                    }
                  </Authorization>
                </Column>
                <Column small={12} medium={6} large={4}>
                  <Authorization allow={hasPermissions(usersPermissions, UsersPermissions.VIEW_INFILLDEVELOPMENTCOMPENSATION)}>
                    <FormTextTitle uiDataKey={getUiDataLeaseKey(LeaseFieldPaths.INFILL_DEVELOPMENT_COMPENSATIONS)}>
                      {LeaseFieldTitles.INFILL_DEVELOPMENT_COMPENSATIONS}
                    </FormTextTitle>
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
                    <FormTextTitle uiDataKey={getUiDataLeaseKey(LeaseFieldPaths.NOTICE_PERIOD)}>
                      {LeaseFieldTitles.NOTICE_PERIOD}
                    </FormTextTitle>
                    <FormText>{getLabelOfOption(noticePeriodOptions, summary.notice_period) || '-'}</FormText>
                  </Authorization>
                </Column>
                <Column small={12} medium={6} large={8}>
                  <Authorization allow={isFieldAllowedToRead(attributes, LeaseFieldPaths.NOTICE_NOTE)}>
                    <FormTextTitle uiDataKey={getUiDataLeaseKey(LeaseFieldPaths.NOTICE_NOTE)}>
                      {LeaseFieldTitles.NOTICE_NOTE}
                    </FormTextTitle>
                    <ShowMore text={summary.notice_note || '-'} />
                  </Authorization>
                </Column>
              </Row>
              <Row>
                <Column small={12} medium={6} large={4}>
                  <Authorization allow={isFieldAllowedToRead(attributes, LeaseFieldPaths.REFERENCE_NUMBER)}>
                    <FormTextTitle uiDataKey={getUiDataLeaseKey(LeaseFieldPaths.REFERENCE_NUMBER)}>
                      {LeaseFieldTitles.REFERENCE_NUMBER}
                    </FormTextTitle>
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
                    <FormTextTitle uiDataKey={getUiDataLeaseKey(LeaseFieldPaths.NOTE)}>
                      {LeaseFieldTitles.NOTE}
                    </FormTextTitle>
                    <ShowMore text={summary.note || '-'} />
                  </Authorization>
                </Column>
              </Row>
              <Row>
                <Column small={12} medium={6} large={4}>
                  <Authorization allow={isFieldAllowedToRead(attributes, LeaseContractsFieldPaths.CONTRACT_NUMBER)}>
                    <FormTextTitle uiDataKey={getUiDataLeaseKey(LeaseFieldPaths.CONTRACT_NUMBERS)}>
                      {LeaseFieldTitles.CONTRACT_NUMBERS}
                    </FormTextTitle>
                    <FormText>{summary.contract_numbers || '-'}</FormText>
                  </Authorization>
                </Column>
                <Column small={12} medium={6} large={4}>
                  <Authorization allow={isFieldAllowedToRead(attributes, LeaseFieldPaths.IS_SUBJECT_TO_VAT)}>
                    <FormTextTitle uiDataKey={getUiDataLeaseKey(LeaseFieldPaths.IS_SUBJECT_TO_VAT)}>
                      {LeaseFieldTitles.IS_SUBJECT_TO_VAT}
                    </FormTextTitle>
                    <FormText>{summary.is_subject_to_vat ? 'Kyllä' : 'Ei'}</FormText>
                  </Authorization>
                </Column>
                <Column small={12} medium={6} large={4}>
                  {summary.arrangement_decision &&
                    <Authorization allow={isFieldAllowedToRead(attributes, LeaseContractsFieldPaths.CONTRACTS)}>
                      <FormTextTitle uiDataKey={getUiDataLeaseKey(LeaseFieldPaths.ARRANGEMENT_DECISION)}>
                        {LeaseFieldTitles.ARRANGEMENT_DECISION}
                      </FormTextTitle>
                      <FormText>{summary.arrangement_decision ? 'Kyllä' : 'Ei'}</FormText>
                    </Authorization>
                  }
                </Column>
              </Row>

              <SummaryLeaseInfo />
            </Collapse>

            <Collapse
              defaultOpen={collapseStateStatistical !== undefined ? collapseStateStatistical : true}
              headerTitle={LeaseFieldTitles.SUMMARY_STATISTICAL_INFO}
              onToggle={this.handleStatisticalInfoCollapseToggle}
              uiDataKey={getUiDataLeaseKey(LeaseFieldPaths.SUMMARY_STATISTICAL_INFO)}
            >
              <Row>
                <Column small={12} medium={6} large={4}>
                  <Authorization allow={isFieldAllowedToRead(attributes, LeaseFieldPaths.SPECIAL_PROJECT)}>
                    <FormTextTitle uiDataKey={getUiDataLeaseKey(LeaseFieldPaths.SPECIAL_PROJECT)}>
                      {LeaseFieldTitles.SPECIAL_PROJECT}
                    </FormTextTitle>
                    <FormText>{getLabelOfOption(specialProjectOptions, summary.special_project) || '-'}</FormText>
                  </Authorization>
                </Column>
                <Column small={12} medium={6} large={4}>
                  <Authorization allow={isFieldAllowedToRead(attributes, LeaseFieldPaths.SUPPORTIVE_HOUSING)}>
                    <FormTextTitle uiDataKey={getUiDataLeaseKey(LeaseFieldPaths.SUPPORTIVE_HOUSING)}>
                      {LeaseFieldTitles.SUPPORTIVE_HOUSING}
                    </FormTextTitle>
                    <FormText>{getLabelOfOption(supportiveHousingOptions, summary.supportive_housing) || '-'}</FormText>
                  </Authorization>
                </Column>
                <Column small={12} medium={6} large={4}>
                  <Authorization allow={isFieldAllowedToRead(attributes, LeaseFieldPaths.STATISTICAL_USE)}>
                    <FormTextTitle uiDataKey={getUiDataLeaseKey(LeaseFieldPaths.STATISTICAL_USE)}>
                      {LeaseFieldTitles.STATISTICAL_USE}
                    </FormTextTitle>
                    <FormText>{getLabelOfOption(statisticalUseOptions, summary.statistical_use) || '-'}</FormText>
                  </Authorization>
                </Column>
              </Row>
              <Row>
                <Column small={12} medium={6} large={4}>
                  <Authorization allow={isFieldAllowedToRead(attributes, LeaseFieldPaths.REAL_ESTATE_DEVELOPER)}>
                    <FormTextTitle uiDataKey={getUiDataLeaseKey(LeaseFieldPaths.REAL_ESTATE_DEVELOPER)}>
                      {LeaseFieldTitles.REAL_ESTATE_DEVELOPER}
                    </FormTextTitle>
                    <FormText>{summary.real_estate_developer || '-'}</FormText>
                  </Authorization>
                </Column>
                <Column small={12} medium={6} large={4}>
                  <Authorization allow={isFieldAllowedToRead(attributes, LeaseFieldPaths.CONVEYANCE_NUMBER)}>
                    <FormTextTitle uiDataKey={getUiDataLeaseKey(LeaseFieldPaths.CONVEYANCE_NUMBER)}>
                      {LeaseFieldTitles.CONVEYANCE_NUMBER}
                    </FormTextTitle>
                    <FormText>{summary.conveyance_number || '-'}</FormText>
                  </Authorization>
                </Column>
                <Column small={12} medium={6} large={4}>
                  <Authorization allow={isFieldAllowedToRead(attributes, LeaseFieldPaths.BUILDING_SELLING_PRICE)}>
                    <FormTextTitle uiDataKey={getUiDataLeaseKey(LeaseFieldPaths.BUILDING_SELLING_PRICE)}>
                      {LeaseFieldTitles.BUILDING_SELLING_PRICE}
                    </FormTextTitle>
                    <FormText>{!isEmptyValue(summary.building_selling_price) ? `${formatNumber(summary.building_selling_price)} €` : '-'}</FormText>
                  </Authorization>
                </Column>
              </Row>
              <Row>
                <Column small={12} medium={6} large={4}>
                  <Authorization allow={isFieldAllowedToRead(attributes, LeaseFieldPaths.REGULATED)}>
                    <FormTextTitle uiDataKey={getUiDataLeaseKey(LeaseFieldPaths.REGULATED)}>
                      {LeaseFieldTitles.REGULATED}
                    </FormTextTitle>
                    <FormText>{summary.regulated ? 'Kyllä' : 'Ei'}</FormText>
                  </Authorization>
                </Column>
                <Column small={12} medium={6} large={4}>
                  <Authorization allow={isFieldAllowedToRead(attributes, LeaseFieldPaths.REGULATION)}>
                    <FormTextTitle uiDataKey={getUiDataLeaseKey(LeaseFieldPaths.REGULATION)}>
                      {LeaseFieldTitles.REGULATION}
                    </FormTextTitle>
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
      collapseStateBasic: getCollapseStateByKey(state, `${ViewModes.READONLY}.${FormNames.LEASE_SUMMARY}.basic`),
      collapseStateStatistical: getCollapseStateByKey(state, `${ViewModes.READONLY}.${FormNames.LEASE_SUMMARY}.statistical`),
      currentLease: getCurrentLease(state),
      usersPermissions: getUsersPermissions(state),
    };
  },
  {
    receiveCollapseStates,
  }
)(Summary);
