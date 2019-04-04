// @flow
import React, {Fragment, PureComponent} from 'react';
import {connect} from 'react-redux';
import {Row, Column} from 'react-foundation';
import isEmpty from 'lodash/isEmpty';
import flowRight from 'lodash/flowRight';
import get from 'lodash/get';

import Authorization from '$components/authorization/Authorization';
import Collapse from '$src/components/collapse/Collapse';
import ExternalLink from '$components/links/ExternalLink';
import FileDownloadLink from '$components/file/FileDownloadLink';
import FormText from '$components/form/FormText';
import FormTextTitle from '$components/form/FormTextTitle';
import LeaseInfo from './LeaseInfo';
import ListItem from '$components/content/ListItem';
import ListItems from '$components/content/ListItems';
import Loader from '$components/loader/Loader';
import LoaderWrapper from '$components/loader/LoaderWrapper';
import SubTitle from '$components/content/SubTitle';
import {receiveCollapseStates} from '$src/infillDevelopment/actions';
import {fetchLeaseById} from '$src/leases/actions';
import {FormNames, Methods, ViewModes} from '$src/enums';
import {
  InfillDevelopmentCompensationLeasesFieldPaths,
  InfillDevelopmentCompensationLeasesFieldTitles,
  InfillDevelopmentCompensationLeaseDecisionsFieldPaths,
  InfillDevelopmentCompensationLeaseDecisionsFieldTitles,
  InfillDevelopmentCompensationLeaseIntendedUsesFieldPaths,
  InfillDevelopmentCompensationLeaseIntendedUsesFieldTitles,
} from '$src/infillDevelopment/enums';
import {
  InfillDevelopmentCompensationAttachmentFieldPaths,
  InfillDevelopmentCompensationAttachmentFieldTitles,
} from '$src/infillDevelopmentAttachment/enums';
import {LeaseFieldPaths} from '$src/leases/enums';
import {
  getContentLeaseAreas,
  getContentLeaseIdentifier,
  getContentTenants,
  isTenantActive,
} from '$src/leases/helpers';
import {getUiDataInfillDevelopmentKey, getUiDataInfillDevelopmentAttachmentKey} from '$src/uiData/helpers';
import {getUserFullName} from '$src/users/helpers';
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
import {
  getAttributes as getInfillDevelopmentAttributes,
  getCollapseStateByKey,
} from '$src/infillDevelopment/selectors';
import {
  getAttributes as getInfillDevelopmentAttachmentAttributes,
  getMethods as getInfillDevelopmentAttachmentMethods,
} from '$src/infillDevelopmentAttachment/selectors';
import {
  getAttributes as getLeaseAttributes,
  getIsFetchingById,
  getLeaseById,
} from '$src/leases/selectors';

import type {Attributes, Methods as MethodsType} from '$src/types';
import type {Lease, LeaseId} from '$src/leases/types';

type Props = {
  collapseState: boolean,
  fetchLeaseById: Function,
  id: number,
  infillDevelopmentAttachmentAttributes: Attributes,
  infillDevelopmentAttachmentMethods: MethodsType,
  infillDevelopmentAttributes: Attributes,
  isFetching: boolean,
  lease: Lease,
  leaseAttributes: Attributes,
  leaseId: LeaseId,
  leaseData: Object,
  receiveCollapseStates: Function,
}

type State = {
  decisionMakerOptions: Array<Object>,
  identifier: ?string,
  infillDevelopmentAttributes: Attributes,
  intendedUseOptions: Array<Object>,
  lease: Lease,
  planUnits: Array<Object>,
  plots: Array<Object>,
  tenants: Array<Object>,
}

class LeaseItem extends PureComponent<Props, State> {
  state = {
    decisionMakerOptions: [],
    identifier: null,
    infillDevelopmentAttributes: null,
    intendedUseOptions: [],
    lease: {},
    planUnits: [],
    plots: [],
    tenants: [],
  }

  static getDerivedStateFromProps(props: Props, state: State) {
    const newState = {};

    if(props.infillDevelopmentAttributes !== state.infillDevelopmentAttributes) {
      newState.infillDevelopmentAttributes = props.infillDevelopmentAttributes;
      newState.decisionMakerOptions = getFieldOptions(props.infillDevelopmentAttributes, InfillDevelopmentCompensationLeaseDecisionsFieldPaths.DECISION_MAKER);
      newState.intendedUseOptions = getFieldOptions(props.infillDevelopmentAttributes, InfillDevelopmentCompensationLeaseIntendedUsesFieldPaths.INTENDED_USE);
    }

    if(props.lease !== state.lease) {
      const leaseAreas = getContentLeaseAreas(props.lease).filter((area) => !area.archived_at);
      const planUnits = [];
      const plots = [];

      leaseAreas.forEach((area) => {
        planUnits.push(...get(area, 'plan_units_current', []));
      });

      leaseAreas.forEach((area) => {
        plots.push(...get(area, 'plots_current', []));
      });

      newState.lease = props.lease;
      newState.identifier = getContentLeaseIdentifier(props.lease);
      newState.planUnits = planUnits;
      newState.plots = plots;
      newState.tenants = getContentTenants(props.lease).filter((tenant) => isTenantActive(get(tenant, 'tenant')));
    }

    return newState;
  }

  componentDidMount() {
    const {
      fetchLeaseById,
      lease,
      leaseId,
    } = this.props;

    if(isEmpty(lease)) {
      fetchLeaseById(leaseId);
    }
  }

  handleCollapseToggle = (val: boolean) => {
    const {id, receiveCollapseStates} = this.props;

    receiveCollapseStates({
      [ViewModes.READONLY]: {
        [FormNames.INFILL_DEVELOPMENT]: {
          [id]: val,
        },
      },
    });
  }

  getTotalCompensation = (lease: Object) => {
    const monetaryCompensation = Number(get(lease, 'monetary_compensation_amount')),
      compensationInvestment = Number(get(lease, 'compensation_investment_amount'));
    return monetaryCompensation + compensationInvestment;
  }

  render() {
    const {
      collapseState,
      infillDevelopmentAttachmentAttributes,
      infillDevelopmentAttachmentMethods,
      infillDevelopmentAttributes,
      isFetching,
      leaseAttributes,
      leaseData,
      leaseId,
    } = this.props;
    const {
      decisionMakerOptions,
      identifier,
      intendedUseOptions,
      planUnits,
      plots,
      tenants,
    } = this.state;
    const intendedUses = get(leaseData, 'intended_uses', []),
      decisions = get(leaseData, 'decisions', []),
      attachments = get(leaseData, 'attachments', []),
      totalCompensation = this.getTotalCompensation(leaseData);

    return (
      <Collapse
        className='collapse__secondary'
        defaultOpen={collapseState !== undefined ? collapseState : true}
        headerTitle={
          <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseFieldPaths.IDENTIFIER)}>
            {identifier || '-'}
          </Authorization>
        }
        onToggle={this.handleCollapseToggle}
      >
        {isFetching
          ? <LoaderWrapper><Loader isLoading={isFetching} /></LoaderWrapper>
          : <LeaseInfo
            identifier={identifier}
            leaseId={leaseId}
            planUnits={planUnits}
            plots={plots}
            tenants={tenants}
          />
        }

        <Authorization allow={isFieldAllowedToRead(infillDevelopmentAttributes, InfillDevelopmentCompensationLeaseDecisionsFieldPaths.DECISIONS)}>
          <SubTitle uiDataKey={getUiDataInfillDevelopmentKey(InfillDevelopmentCompensationLeaseDecisionsFieldPaths.DECISIONS)}>
            {InfillDevelopmentCompensationLeaseDecisionsFieldTitles.DECISIONS}
          </SubTitle>

          {!decisions.length && <FormText>Ei päätöksiä</FormText>}
          {!!decisions.length &&
            <ListItems>
              <Row>
                <Column small={3} large={2}>
                  <Authorization allow={isFieldAllowedToRead(infillDevelopmentAttributes, InfillDevelopmentCompensationLeaseDecisionsFieldPaths.DECISION_MAKER)}>
                    <FormTextTitle uiDataKey={getUiDataInfillDevelopmentKey(InfillDevelopmentCompensationLeaseDecisionsFieldPaths.DECISION_MAKER)}>
                      {InfillDevelopmentCompensationLeaseDecisionsFieldTitles.DECISION_MAKER}
                    </FormTextTitle>
                  </Authorization>
                </Column>
                <Column small={3} large={2}>
                  <Authorization allow={isFieldAllowedToRead(infillDevelopmentAttributes, InfillDevelopmentCompensationLeaseDecisionsFieldPaths.DECISION_DATE)}>
                    <FormTextTitle uiDataKey={getUiDataInfillDevelopmentKey(InfillDevelopmentCompensationLeaseDecisionsFieldPaths.DECISION_DATE)}>
                      {InfillDevelopmentCompensationLeaseDecisionsFieldTitles.DECISION_DATE}
                    </FormTextTitle>
                  </Authorization>
                </Column>
                <Column small={3} large={2}>
                  <Authorization allow={isFieldAllowedToRead(infillDevelopmentAttributes, InfillDevelopmentCompensationLeaseDecisionsFieldPaths.SECTION)}>
                    <FormTextTitle uiDataKey={getUiDataInfillDevelopmentKey(InfillDevelopmentCompensationLeaseDecisionsFieldPaths.SECTION)}>
                      {InfillDevelopmentCompensationLeaseDecisionsFieldTitles.SECTION}
                    </FormTextTitle>
                  </Authorization>
                </Column>
                <Column small={3} large={2}>
                  <Authorization allow={isFieldAllowedToRead(infillDevelopmentAttributes, InfillDevelopmentCompensationLeaseDecisionsFieldPaths.REFERENCE_NUMBER)}>
                    <FormTextTitle uiDataKey={getUiDataInfillDevelopmentKey(InfillDevelopmentCompensationLeaseDecisionsFieldPaths.REFERENCE_NUMBER)}>
                      {InfillDevelopmentCompensationLeaseDecisionsFieldTitles.REFERENCE_NUMBER}
                    </FormTextTitle>
                  </Authorization>
                </Column>
              </Row>
              {decisions.map((decision, index) =>
                <Row key={index}>
                  <Column small={3} large={2}>
                    <Authorization allow={isFieldAllowedToRead(infillDevelopmentAttributes, InfillDevelopmentCompensationLeaseDecisionsFieldPaths.DECISION_MAKER)}>
                      <ListItem>{getLabelOfOption(decisionMakerOptions, decision.decision_maker) || '-'}</ListItem>
                    </Authorization>
                  </Column>
                  <Column small={3} large={2}>
                    <Authorization allow={isFieldAllowedToRead(infillDevelopmentAttributes, InfillDevelopmentCompensationLeaseDecisionsFieldPaths.DECISION_DATE)}>
                      <ListItem>{formatDate(decision.decision_date) || '-'}</ListItem>
                    </Authorization>
                  </Column>
                  <Column small={3} large={2}>
                    <Authorization allow={isFieldAllowedToRead(infillDevelopmentAttributes, InfillDevelopmentCompensationLeaseDecisionsFieldPaths.SECTION)}>
                      <ListItem>{decision.section ? `${decision.section} §` : '-'}</ListItem>
                    </Authorization>
                  </Column>
                  <Column small={3} large={2}>
                    <Authorization allow={isFieldAllowedToRead(infillDevelopmentAttributes, InfillDevelopmentCompensationLeaseDecisionsFieldPaths.REFERENCE_NUMBER)}>
                      {decision.reference_number
                        ? <ListItem>
                          <ExternalLink
                            className='no-margin'
                            href={getReferenceNumberLink(decision.reference_number)}
                            text={decision.reference_number}
                          />
                        </ListItem>
                        : <ListItem>-</ListItem>
                      }
                    </Authorization>
                  </Column>
                </Row>
              )}
            </ListItems>
          }
        </Authorization>

        <Authorization allow={isFieldAllowedToRead(infillDevelopmentAttributes, InfillDevelopmentCompensationLeaseIntendedUsesFieldPaths.INTENDED_USES)}>
          <SubTitle uiDataKey={getUiDataInfillDevelopmentKey(InfillDevelopmentCompensationLeaseIntendedUsesFieldPaths.INTENDED_USES)}>
            {InfillDevelopmentCompensationLeaseIntendedUsesFieldTitles.INTENDED_USES}
          </SubTitle>

          {!intendedUses.length && <FormText>Ei käyttötarkoituksia</FormText>}
          {!!intendedUses.length &&
            <ListItems>
              <Row>
                <Column small={3} large={2}>
                  <Authorization allow={isFieldAllowedToRead(infillDevelopmentAttributes, InfillDevelopmentCompensationLeaseIntendedUsesFieldPaths.INTENDED_USE)}>
                    <FormTextTitle uiDataKey={getUiDataInfillDevelopmentKey(InfillDevelopmentCompensationLeaseIntendedUsesFieldPaths.INTENDED_USE)}>
                      {InfillDevelopmentCompensationLeaseIntendedUsesFieldTitles.INTENDED_USE}
                    </FormTextTitle>
                  </Authorization>
                </Column>
                <Column small={3} large={2}>
                  <Authorization allow={isFieldAllowedToRead(infillDevelopmentAttributes, InfillDevelopmentCompensationLeaseIntendedUsesFieldPaths.FLOOR_M2)}>
                    <FormTextTitle uiDataKey={getUiDataInfillDevelopmentKey(InfillDevelopmentCompensationLeaseIntendedUsesFieldPaths.FLOOR_M2)}>
                      {InfillDevelopmentCompensationLeaseIntendedUsesFieldTitles.FLOOR_M2}
                    </FormTextTitle>
                  </Authorization>
                </Column>
                <Column small={3} large={2}>
                  <Authorization allow={isFieldAllowedToRead(infillDevelopmentAttributes, InfillDevelopmentCompensationLeaseIntendedUsesFieldPaths.AMOUNT_PER_FLOOR_M2)}>
                    <FormTextTitle uiDataKey={getUiDataInfillDevelopmentKey(InfillDevelopmentCompensationLeaseIntendedUsesFieldPaths.AMOUNT_PER_FLOOR_M2)}>
                      {InfillDevelopmentCompensationLeaseIntendedUsesFieldTitles.AMOUNT_PER_FLOOR_M2}
                    </FormTextTitle>
                  </Authorization>
                </Column>
              </Row>
              {intendedUses.map((intendedUse, index) =>
                <Row key={index}>
                  <Column small={3} large={2}>
                    <Authorization allow={isFieldAllowedToRead(infillDevelopmentAttributes, InfillDevelopmentCompensationLeaseIntendedUsesFieldPaths.INTENDED_USE)}>
                      <ListItem>{getLabelOfOption(intendedUseOptions, intendedUse.intended_use) || '-'}</ListItem>
                    </Authorization>
                  </Column>
                  <Column small={3} large={2}>
                    <Authorization allow={isFieldAllowedToRead(infillDevelopmentAttributes, InfillDevelopmentCompensationLeaseIntendedUsesFieldPaths.FLOOR_M2)}>
                      <ListItem>{intendedUse.floor_m2 ? `${formatNumber(intendedUse. floor_m2)} k-m²` : '-'}</ListItem>
                    </Authorization>
                  </Column>
                  <Column small={3} large={2}>
                    <Authorization allow={isFieldAllowedToRead(infillDevelopmentAttributes, InfillDevelopmentCompensationLeaseIntendedUsesFieldPaths.AMOUNT_PER_FLOOR_M2)}>
                      <ListItem>{intendedUse.amount_per_floor_m2 ? `${formatNumber(intendedUse.amount_per_floor_m2)} €/k-m²` : '-'}</ListItem>
                    </Authorization>
                  </Column>
                </Row>
              )}
            </ListItems>
          }
        </Authorization>

        <Row>
          <Column small={6} medium={4} large={2}>
            <Authorization allow={isFieldAllowedToRead(infillDevelopmentAttributes, InfillDevelopmentCompensationLeasesFieldPaths.MONETARY_COMPENSATION_AMOUNT)}>
              <FormTextTitle uiDataKey={getUiDataInfillDevelopmentKey(InfillDevelopmentCompensationLeasesFieldPaths.MONETARY_COMPENSATION_AMOUNT)}>
                {InfillDevelopmentCompensationLeasesFieldTitles.MONETARY_COMPENSATION_AMOUNT}
              </FormTextTitle>
              <FormText>{!isEmptyValue(leaseData.monetary_compensation_amount) ? `${formatNumber(leaseData.monetary_compensation_amount)} €` : '-'}</FormText>
            </Authorization>
          </Column>
          <Column small={6} medium={4} large={2}>
            <Authorization allow={isFieldAllowedToRead(infillDevelopmentAttributes, InfillDevelopmentCompensationLeasesFieldPaths.COMPENSATION_INVESTMENT_AMOUNT)}>
              <FormTextTitle uiDataKey={getUiDataInfillDevelopmentKey(InfillDevelopmentCompensationLeasesFieldPaths.COMPENSATION_INVESTMENT_AMOUNT)}>
                {InfillDevelopmentCompensationLeasesFieldTitles.COMPENSATION_INVESTMENT_AMOUNT}
              </FormTextTitle>
              <FormText>{!isEmptyValue(leaseData.compensation_investment_amount) ? `${formatNumber(leaseData.compensation_investment_amount)} €` : '-'}</FormText>
            </Authorization>
          </Column>
          <Column small={6} medium={4} large={2}>
            <Authorization
              allow={isFieldAllowedToRead(infillDevelopmentAttributes, InfillDevelopmentCompensationLeasesFieldPaths.MONETARY_COMPENSATION_AMOUNT) ||
                isFieldAllowedToRead(infillDevelopmentAttributes, InfillDevelopmentCompensationLeasesFieldPaths.COMPENSATION_INVESTMENT_AMOUNT)
              }
            >
              <FormTextTitle uiDataKey={getUiDataInfillDevelopmentKey(InfillDevelopmentCompensationLeasesFieldPaths.TOTAL_COMPENSATION)}>
                {InfillDevelopmentCompensationLeasesFieldTitles.TOTAL_COMPENSATION}
              </FormTextTitle>
              <FormText>{`${formatNumber(totalCompensation)} €`}</FormText>
            </Authorization>
          </Column>
          <Column small={6} medium={4} large={2}>
            <Authorization allow={isFieldAllowedToRead(infillDevelopmentAttributes, InfillDevelopmentCompensationLeasesFieldPaths.INCREASE_IN_VALUE)}>
              <FormTextTitle uiDataKey={getUiDataInfillDevelopmentKey(InfillDevelopmentCompensationLeasesFieldPaths.INCREASE_IN_VALUE)}>
                {InfillDevelopmentCompensationLeasesFieldTitles.INCREASE_IN_VALUE}
              </FormTextTitle>
              <FormText>{!isEmptyValue(leaseData.increase_in_value) ? `${formatNumber(leaseData.increase_in_value)} €` : '-'}</FormText>
            </Authorization>
          </Column>
          <Column small={6} medium={4} large={2}>
            <Authorization allow={isFieldAllowedToRead(infillDevelopmentAttributes, InfillDevelopmentCompensationLeasesFieldPaths.PART_OF_THE_INCREASE_IN_VALUE)}>
              <FormTextTitle uiDataKey={getUiDataInfillDevelopmentKey(InfillDevelopmentCompensationLeasesFieldPaths.PART_OF_THE_INCREASE_IN_VALUE)}>
                {InfillDevelopmentCompensationLeasesFieldTitles.PART_OF_THE_INCREASE_IN_VALUE}
              </FormTextTitle>
              <FormText>{!isEmptyValue(leaseData.part_of_the_increase_in_value) ? `${formatNumber(leaseData.part_of_the_increase_in_value)} €` : '-'}</FormText>
            </Authorization>
          </Column>
          <Column small={6} medium={4} large={2}>
            <Authorization allow={isFieldAllowedToRead(infillDevelopmentAttributes, InfillDevelopmentCompensationLeasesFieldPaths.DISCOUNT_IN_RENT)}>
              <FormTextTitle uiDataKey={getUiDataInfillDevelopmentKey(InfillDevelopmentCompensationLeasesFieldPaths.DISCOUNT_IN_RENT)}>
                {InfillDevelopmentCompensationLeasesFieldTitles.DISCOUNT_IN_RENT}
              </FormTextTitle>
              <FormText>{!isEmptyValue(leaseData.discount_in_rent) ? `${formatNumber(leaseData.discount_in_rent)} €` : '-'}</FormText>
            </Authorization>
          </Column>
          <Column small={6} medium={4} large={2}>
            <Authorization allow={isFieldAllowedToRead(infillDevelopmentAttributes, InfillDevelopmentCompensationLeasesFieldPaths.YEAR)}>
              <FormTextTitle uiDataKey={getUiDataInfillDevelopmentKey(InfillDevelopmentCompensationLeasesFieldPaths.YEAR)}>
                {InfillDevelopmentCompensationLeasesFieldTitles.YEAR}
              </FormTextTitle>
              <FormText>{leaseData.year || '-'}</FormText>
            </Authorization>
          </Column>
          <Column small={6} medium={4} large={2}>
            <Authorization allow={isFieldAllowedToRead(infillDevelopmentAttributes, InfillDevelopmentCompensationLeasesFieldPaths.SENT_TO_SAP_DATE)}>
              <FormTextTitle uiDataKey={getUiDataInfillDevelopmentKey(InfillDevelopmentCompensationLeasesFieldPaths.SENT_TO_SAP_DATE)}>
                {InfillDevelopmentCompensationLeasesFieldTitles.SENT_TO_SAP_DATE}
              </FormTextTitle>
              <FormText>{formatDate(leaseData.sent_to_sap_date) || '-'}</FormText>
            </Authorization>
          </Column>
          <Column small={6} medium={4} large={2}>
            <Authorization allow={isFieldAllowedToRead(infillDevelopmentAttributes, InfillDevelopmentCompensationLeasesFieldPaths.PAID_DATE)}>
              <FormTextTitle uiDataKey={getUiDataInfillDevelopmentKey(InfillDevelopmentCompensationLeasesFieldPaths.PAID_DATE)}>
                {InfillDevelopmentCompensationLeasesFieldTitles.PAID_DATE}
              </FormTextTitle>
              <FormText>{formatDate(leaseData.paid_date) || '-'}</FormText>
            </Authorization>
          </Column>
        </Row>

        <Authorization allow={isMethodAllowed(infillDevelopmentAttachmentMethods, Methods.GET)}>
          <SubTitle uiDataKey={getUiDataInfillDevelopmentAttachmentKey(InfillDevelopmentCompensationAttachmentFieldPaths.ATTACHMENTS)}>
            {InfillDevelopmentCompensationAttachmentFieldTitles.ATTACHMENTS}
          </SubTitle>

          {!attachments.length && <FormText>Ei liitetiedostoja</FormText>}
          {!!attachments.length &&
            <Fragment>
              <Row>
                <Column small={3} large={4}>
                  <Authorization allow={isFieldAllowedToRead(infillDevelopmentAttachmentAttributes, InfillDevelopmentCompensationAttachmentFieldPaths.FILE)}>
                    <FormTextTitle uiDataKey={getUiDataInfillDevelopmentAttachmentKey(InfillDevelopmentCompensationAttachmentFieldPaths.FILE)}>
                      {InfillDevelopmentCompensationAttachmentFieldTitles.FILE}
                    </FormTextTitle>
                  </Authorization>
                </Column>
                <Column small={3} large={2}>
                  <Authorization allow={isFieldAllowedToRead(infillDevelopmentAttachmentAttributes, InfillDevelopmentCompensationAttachmentFieldPaths.UPLOADED_AT)}>
                    <FormTextTitle uiDataKey={getUiDataInfillDevelopmentAttachmentKey(InfillDevelopmentCompensationAttachmentFieldPaths.UPLOADED_AT)}>
                      {InfillDevelopmentCompensationAttachmentFieldTitles.UPLOADED_AT}
                    </FormTextTitle>
                  </Authorization>
                </Column>
                <Column small={3} large={2}>
                  <FormTextTitle uiDataKey={getUiDataInfillDevelopmentAttachmentKey(InfillDevelopmentCompensationAttachmentFieldPaths.UPLOADER)}>
                    {InfillDevelopmentCompensationAttachmentFieldTitles.UPLOADER}
                  </FormTextTitle>
                </Column>
              </Row>

              {attachments.map((file, index) => {
                return (
                  <Row key={index}>
                    <Column small={3} large={4}>
                      <Authorization allow={isFieldAllowedToRead(infillDevelopmentAttachmentAttributes, InfillDevelopmentCompensationAttachmentFieldPaths.FILE)}>
                        <FileDownloadLink
                          fileUrl={file.file}
                          label={file.filename}
                        />
                      </Authorization>
                    </Column>
                    <Column small={3} large={2}>
                      <Authorization allow={isFieldAllowedToRead(infillDevelopmentAttachmentAttributes, InfillDevelopmentCompensationAttachmentFieldPaths.UPLOADED_AT)}>
                        <FormText>{formatDate(file.uploaded_at) || '-'}</FormText>
                      </Authorization>
                    </Column>
                    <Column small={3} large={2}>
                      <FormText>{getUserFullName((file.uploader)) || '-'}</FormText>
                    </Column>
                  </Row>
                );
              })}
            </Fragment>
          }
        </Authorization>

        <Authorization allow={isFieldAllowedToRead(infillDevelopmentAttributes, InfillDevelopmentCompensationLeasesFieldPaths.NOTE)}>
          <Row>
            <Column>
              <FormTextTitle uiDataKey={InfillDevelopmentCompensationLeasesFieldPaths.NOTE}>
                {InfillDevelopmentCompensationLeasesFieldTitles.NOTE}
              </FormTextTitle>
              <FormText>{leaseData.note || '-'}</FormText>
            </Column>
          </Row>
        </Authorization>
      </Collapse>
    );
  }
}

export default flowRight(
  connect(
    (state, props) => {
      const id = props.id;

      return {
        collapseState: getCollapseStateByKey(state, `${ViewModes.READONLY}.${FormNames.INFILL_DEVELOPMENT}.${id}`),
        infillDevelopmentAttachmentAttributes: getInfillDevelopmentAttachmentAttributes(state),
        infillDevelopmentAttachmentMethods: getInfillDevelopmentAttachmentMethods(state),
        infillDevelopmentAttributes: getInfillDevelopmentAttributes(state),
        isFetching: getIsFetchingById(state, props.leaseId),
        lease: getLeaseById(state, props.leaseId),
        leaseAttributes: getLeaseAttributes(state),
      };
    },
    {
      fetchLeaseById,
      receiveCollapseStates,
    }
  )
)(LeaseItem);
