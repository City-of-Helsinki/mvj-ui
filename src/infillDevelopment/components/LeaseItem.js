// @flow
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Row, Column} from 'react-foundation';
import isEmpty from 'lodash/isEmpty';
import flowRight from 'lodash/flowRight';
import get from 'lodash/get';

import Collapse from '$src/components/collapse/Collapse';
import FormFieldLabel from '$components/form/FormFieldLabel';
import LeaseInfo from './LeaseInfo';
import ListItems from '$components/content/ListItems';
import Loader from '$components/loader/Loader';
import LoaderWrapper from '$components/loader/LoaderWrapper';
import SubTitle from '$components/content/SubTitle';
import {fetchLeaseById} from '$src/leases/actions';
import {formatDate, formatNumber, getAttributeFieldOptions, getLabelOfOption} from '$util/helpers';
import {
  getContentLeaseAreas,
  getContentLeaseIdentifier,
  getContentTenants,
} from '$src/leases/helpers';
import {getAttributes} from '$src/infillDevelopment/selectors';
import {getIsFetchingById, getLeaseById} from '$src/leases/selectors';

import type {Attributes} from '$src/infillDevelopment/types';
import type {Lease, LeaseId} from '$src/leases/types';

type Props = {
  attributes: Attributes,
  fetchLeaseById: Function,
  id: LeaseId,
  isFetching: boolean,
  lease: Lease,
  leaseData: Object,
}

type State = {
  identifier: ?string,
  intendedUseOptions: Array<Object>,
  planUnits: Array<Object>,
  plots: Array<Object>,
  tenants: Array<Object>,
}

class LeaseItem extends Component<Props, State> {
  state = {
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
      id,
      lease,
    } = this.props;

    if(!isEmpty(attributes)) {
      this.updateAttributeStates();
    }

    if(isEmpty(lease)) {
      fetchLeaseById(id);
    } else {
      this.updateLeaseContentStates();
    }
  }

  componentDidUpdate(prevProps) {
    if(prevProps.lease !== this.props.lease) {
      this.updateLeaseContentStates();
    }
  }

  updateAttributeStates = () => {
    const {attributes} = this.props;

    this.setState({
      intendedUseOptions: getAttributeFieldOptions(attributes, 'infill_development_compensation_leases.child.children.intended_uses.child.children.intended_use'),
    });
  }

  updateLeaseContentStates = () => {
    const {lease} = this.props;

    const leaseAreas = getContentLeaseAreas(lease);

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
      tenants: getContentTenants(lease),
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
    const {id, isFetching, leaseData} = this.props;
    const {
      identifier,
      intendedUseOptions,
      planUnits,
      plots,
      tenants,
    } = this.state;
    const intendedUses = get(leaseData, 'intended_uses', []);
    const attachments = get(leaseData, 'attachments', []);
    const totalCompensation = this.getTotalCompensation(leaseData);

    return (
      <Collapse
        className='collapse__secondary'
        defaultOpen={true}
        headerTitle={
          <h4 className='collapse__header-title'>{identifier || '-'}</h4>
        }
      >
        {isFetching
          ? <LoaderWrapper><Loader isLoading={isFetching} /></LoaderWrapper>
          : <LeaseInfo
            id={id}
            identifier={identifier}
            planUnits={planUnits}
            plots={plots}
            tenants={tenants}
          />
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
        {!!attachments.length &&
          <div>
            <Row>
              <Column small={6} large={4}>
                <FormFieldLabel>Nimi</FormFieldLabel>
              </Column>
              <Column small={4} large={2}>
                <FormFieldLabel>Pvm</FormFieldLabel>
              </Column>
            </Row>
            {attachments.map((file, index) => {
              return (
                <Row key={index}>
                  <Column small={6} large={4}>
                    <a>{get(file, 'file.name') || '-'}</a>
                  </Column>
                  <Column small={4} large={2}>
                    <p>{formatDate(file.date) || '-'}</p>
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
      return {
        attributes: getAttributes(state),
        isFetching: getIsFetchingById(state, props.id),
        lease: getLeaseById(state, props.id),
      };
    },
    {
      fetchLeaseById,
    }
  )
)(LeaseItem);
