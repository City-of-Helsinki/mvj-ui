// @flow
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Row, Column} from 'react-foundation';
import isEmpty from 'lodash/isEmpty';
import flowRight from 'lodash/flowRight';
import get from 'lodash/get';

import Collapse from '$src/components/collapse/Collapse';
import FileDownloadLink from '$components/file/FileDownloadLink';
import FormFieldLabel from '$components/form/FormFieldLabel';
import LeaseInfo from './LeaseInfo';
import ListItems from '$components/content/ListItems';
import Loader from '$components/loader/Loader';
import LoaderWrapper from '$components/loader/LoaderWrapper';
import SubTitle from '$components/content/SubTitle';
import {receiveCollapseStates} from '$src/infillDevelopment/actions';
import {fetchLeaseById} from '$src/leases/actions';
import {ViewModes} from '$src/enums';
import {FormNames} from '$src/infillDevelopment/enums';
import {getUserFullName} from '$src/users/helpers';
import {
  formatDate,
  formatNumber,
  getAttributeFieldOptions,
  getLabelOfOption,
  getReferenceNumberLink,
} from '$util/helpers';
import {
  getContentLeaseAreas,
  getContentLeaseIdentifier,
  getContentTenants,
  isTenantActive,
} from '$src/leases/helpers';
import {getAttributes, getCollapseStateByKey} from '$src/infillDevelopment/selectors';
import {getIsFetchingById, getLeaseById} from '$src/leases/selectors';

import type {Attributes} from '$src/infillDevelopment/types';
import type {Lease, LeaseId} from '$src/leases/types';

type Props = {
  attributes: Attributes,
  collapseState: boolean,
  fetchLeaseById: Function,
  id: number,
  isFetching: boolean,
  lease: Lease,
  leaseId: LeaseId,
  leaseData: Object,
  receiveCollapseStates: Function,
}

type State = {
  decisionMakerOptions: Array<Object>,
  identifier: ?string,
  intendedUseOptions: Array<Object>,
  planUnits: Array<Object>,
  plots: Array<Object>,
  tenants: Array<Object>,
}

class LeaseItem extends Component<Props, State> {
  state = {
    decisionMakerOptions: [],
    identifier: null,
    intendedUseOptions: [],
    planUnits: [],
    plots: [],
    tenants: [],
  }

  componentWillMount() {
    const {
      attributes,
      fetchLeaseById,
      lease,
      leaseId,
    } = this.props;

    if(!isEmpty(attributes)) {
      this.updateAttributeStates();
    }

    if(isEmpty(lease)) {
      fetchLeaseById(leaseId);
    } else {
      this.updateLeaseContentStates();
    }
  }

  componentDidUpdate(prevProps) {
    if(prevProps.lease !== this.props.lease) {
      this.updateLeaseContentStates();
    }
    if(prevProps.attributes !== this.props.attributes) {
      this.updateAttributeStates();
    }
  }

  updateAttributeStates = () => {
    const {attributes} = this.props;

    this.setState({
      decisionMakerOptions: getAttributeFieldOptions(attributes, 'infill_development_compensation_leases.child.children.decisions.child.children.decision_maker'),
      intendedUseOptions: getAttributeFieldOptions(attributes, 'infill_development_compensation_leases.child.children.intended_uses.child.children.intended_use'),
    });
  }

  updateLeaseContentStates = () => {
    const {lease} = this.props;

    const leaseAreas = getContentLeaseAreas(lease).filter((area) => !area.archived_at);

    let planUnits = [];
    leaseAreas.forEach((area) => {
      planUnits = [...planUnits, ...get(area, 'plan_units_current', [])];
    });

    let plots = [];
    leaseAreas.forEach((area) => {
      plots = [...planUnits, ...get(area, 'plots_current', [])];
    });

    this.setState({
      identifier: getContentLeaseIdentifier(lease),
      planUnits: planUnits,
      plots: plots,
      tenants: getContentTenants(lease).filter((tenant) => isTenantActive(get(tenant, 'tenant'))),
    });
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

  handleMapLink = () => {
    alert('TODO: open map link');
  }

  getTotalCompensation = (lease: Object) => {
    const monetaryCompensation = Number(get(lease, 'monetary_compensation_amount')),
      compensationInvestment = Number(get(lease, 'compensation_investment_amount'));
    return monetaryCompensation + compensationInvestment;
  }

  render() {
    const {
      collapseState,
      isFetching,
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
        headerTitle={<h4 className='collapse__header-title'>{identifier || '-'}</h4>}
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

        <SubTitle>Korvauksen päätös</SubTitle>
        {!decisions.length && <p>Ei päätöksiä</p>}
        {!!decisions.length &&
          <ListItems>
            <Row>
              <Column small={3} large={2}><FormFieldLabel>Päättäjä</FormFieldLabel></Column>
              <Column small={3} large={2}><FormFieldLabel>Pvm</FormFieldLabel></Column>
              <Column small={3} large={2}><FormFieldLabel>Pykälä</FormFieldLabel></Column>
              <Column small={3} large={2}><FormFieldLabel>Diaarinumero</FormFieldLabel></Column>
            </Row>
            {decisions.map((decision, index) =>
              <Row key={index}>
                <Column small={3} large={2}>
                  <p className='no-margin'>{getLabelOfOption(decisionMakerOptions, decision.decision_maker) || '-'}</p>
                </Column>
                <Column small={3} large={2}>
                  <p className='no-margin'>{formatDate(decision.decision_date) || '-'}</p>
                </Column>
                <Column small={3} large={2}>
                  <p className='no-margin'>{decision.section ? `${decision.section} §` : '-'}</p>
                </Column>
                <Column small={3} large={2}>
                  {decision.reference_number
                    ? <p className='no-margin'>
                      <a
                        className='no-margin'
                        target='_blank'
                        href={getReferenceNumberLink(decision.reference_number)}
                      >
                        {decision.reference_number}
                      </a>
                    </p>
                    : <p className='no-margin'>-</p>
                  }
                </Column>
              </Row>
            )}
          </ListItems>
        }
        <SubTitle>Käyttötarkoitus</SubTitle>
        {!intendedUses.length && <p>Ei käyttötarkoituksia</p>}
        {!!intendedUses.length &&
          <ListItems>
            <Row>
              <Column small={3} large={2}><FormFieldLabel>Käyttötarkoitus</FormFieldLabel></Column>
              <Column small={3} large={2}><FormFieldLabel>k-m2</FormFieldLabel></Column>
              <Column small={3} large={2}><FormFieldLabel>e / k-m2</FormFieldLabel></Column>
            </Row>
            {intendedUses.map((intendedUse, index) =>
              <Row key={index}>
                <Column small={3} large={2}>
                  <p className='no-margin'>{getLabelOfOption(intendedUseOptions, intendedUse.intended_use) || '-'}</p>
                </Column>
                <Column small={3} large={2}>
                  <p className='no-margin'>{intendedUse.floor_m2 ? `${formatNumber(intendedUse. floor_m2)} k-m²` : '-'}</p>
                </Column>
                <Column small={3} large={2}>
                  <p className='no-margin'>{intendedUse.amount_per_floor_m2 ? `${formatNumber(intendedUse.amount_per_floor_m2)} €/k-m²` : '-'}</p>
                </Column>
              </Row>
            )}
          </ListItems>
        }

        <Row>
          <Column small={6} medium={4} large={2}>
            <FormFieldLabel>Rahakorvaus</FormFieldLabel>
            <p>{leaseData.monetary_compensation_amount ? `${formatNumber(leaseData.monetary_compensation_amount)} €` : '-'}</p>
          </Column>
          <Column small={6} medium={4} large={2}>
            <FormFieldLabel>Korvausinvestoinnit</FormFieldLabel>
            <p>{leaseData.compensation_investment_amount ? `${formatNumber(leaseData.compensation_investment_amount)} €` : '-'}</p>
          </Column>
          <Column small={6} medium={4} large={2}>
            <FormFieldLabel>Korvaus yhteensä</FormFieldLabel>
            <p>{formatNumber(totalCompensation)} €</p>
          </Column>
          <Column small={6} medium={4} large={2}>
            <FormFieldLabel>Arvonnousu</FormFieldLabel>
            <p>{leaseData.increase_in_value ? `${formatNumber(leaseData.increase_in_value)} €` : '-'}</p>
          </Column>
          <Column small={6} medium={4} large={2}>
            <FormFieldLabel>Osuus arvonnoususta</FormFieldLabel>
            <p>{leaseData.part_of_the_increase_in_value ? `${formatNumber(leaseData.part_of_the_increase_in_value)} €` : '-'}</p>
          </Column>
          <Column small={6} medium={4} large={2}>
            <FormFieldLabel>Vuokranalennus</FormFieldLabel>
            <p>{leaseData.discount_in_rent ? `${formatNumber(leaseData.discount_in_rent)} €` : '-'}</p>
          </Column>
          <Column small={6} medium={4} large={2}>
            <FormFieldLabel>Arvioitu maksuvuosi</FormFieldLabel>
            <p>{leaseData.year || '-'}</p>
          </Column>
          <Column small={6} medium={4} large={2}>
            <FormFieldLabel>Maksu lähetetty SAP</FormFieldLabel>
            <p>{formatDate(leaseData.sent_to_sap_date) || '-'}</p>
          </Column>
          <Column small={6} medium={4} large={2}>
            <FormFieldLabel>Maksettu</FormFieldLabel>
            <p>{formatDate(leaseData.paid_date) || '-'}</p>
          </Column>
        </Row>

        <SubTitle>Liitetiedostot</SubTitle>
        {!attachments.length && <p>Ei liitetiedostoja</p>}
        {!!attachments.length &&
          <div>
            <Row>
              <Column small={4} large={4}>
                <FormFieldLabel>Nimi</FormFieldLabel>
              </Column>
              <Column small={4} large={2}>
                <FormFieldLabel>Pvm</FormFieldLabel>
              </Column>
              <Column small={4} large={2}>
                <FormFieldLabel>Lataaja</FormFieldLabel>
              </Column>
            </Row>
            {attachments.map((file, index) => {
              return (
                <Row key={index}>
                  <Column small={4} large={4}>
                    <FileDownloadLink
                      fileName={file.filename}
                      fileUrl={file.file}
                      label={file.filename}
                    />
                  </Column>
                  <Column small={4} large={2}>
                    <p>{formatDate(file.uploaded_at) || '-'}</p>
                  </Column>
                  <Column small={4} large={2}>
                    <p>{getUserFullName((file.uploader)) || '-'}</p>
                  </Column>
                </Row>
              );
            })}
          </div>
        }
        <Row>
          <Column>
            <FormFieldLabel>Huomautus</FormFieldLabel>
            <p>{leaseData.note || '-'}</p>
          </Column>
        </Row>
      </Collapse>
    );
  }
}

export default flowRight(
  connect(
    (state, props) => {
      const id = props.id;
      return {
        attributes: getAttributes(state),
        collapseState: getCollapseStateByKey(state, `${ViewModes.READONLY}.${FormNames.INFILL_DEVELOPMENT}.${id}`),
        isFetching: getIsFetchingById(state, props.leaseId),
        lease: getLeaseById(state, props.leaseId),
      };
    },
    {
      fetchLeaseById,
      receiveCollapseStates,
    }
  )
)(LeaseItem);
