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
import Loader from '$components/loader/Loader';
import LoaderWrapper from '$components/loader/LoaderWrapper';
import SubTitle from '$components/content/Subtitle';
import {fetchAttributes as fetchLeaseAttributes, fetchLeaseById} from '$src/leases/actions';
import {formatDate, formatNumber, getAttributeFieldOptions} from '$util/helpers';
import {
  getContentDecisions,
  getContentLeaseAreas,
  getContentLeaseIdentifier,
  getContentTenants,
} from '$src/leases/helpers';
import {getAttributes as getLeaseAttributes, getIsFetchingById, getLeaseById} from '$src/leases/selectors';

import type {Attributes as LeaseAttributes, Lease, LeaseId} from '$src/leases/types';

type Props = {
  fetchLeaseAttributes: Function,
  fetchLeaseById: Function,
  id: LeaseId,
  isFetching: boolean,
  lease: Lease,
  leaseMock: Object,
  leaseAttributes: LeaseAttributes,
}

type State = {
  decisionMakerOptions: Array<Object>,
  decisions: Array<Object>,
  identifier: ?string,
  planUnits: Array<Object>,
  plots: Array<Object>,
  tenants: Array<Object>,
}

class LeaseItem extends Component<Props, State> {
  state = {
    decisionMakerOptions: [],
    decisions: [],
    identifier: null,
    planUnits: [],
    plots: [],
    tenants: [],
  }
  componentWillMount() {
    const {
      fetchLeaseAttributes,
      fetchLeaseById,
      id,
      lease,
      leaseAttributes,
    } = this.props;

    if(isEmpty(leaseAttributes)) {
      fetchLeaseAttributes();
    } else {
      this.updateLeaseAttributeStates();
    }
    if(isEmpty(lease)) {
      fetchLeaseById(id);
    } else {
      this.updateLeaseContentStates();
    }
  }

  componentDidUpdate(prevProps) {
    if(prevProps.leaseAttributes !== this.props.leaseAttributes) {
      this.updateLeaseAttributeStates();
    }
    if(prevProps.lease !== this.props.lease) {
      this.updateLeaseContentStates();
    }
  }

  updateLeaseAttributeStates = () => {
    const {leaseAttributes} = this.props;

    this.setState({
      decisionMakerOptions: getAttributeFieldOptions(leaseAttributes, 'decisions.child.children.decision_maker'),
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
      decisions: getContentDecisions(lease),
      identifier: getContentLeaseIdentifier(lease),
      planUnits: planUnits,
      plots: plots,
      tenants: getContentTenants(lease),
    });
  }

  handleMapLink = () => {
    alert('TODO: open map link');
  }

  render() {
    const {id, isFetching, leaseMock} = this.props;
    const {
      decisionMakerOptions,
      decisions,
      identifier,
      planUnits,
      plots,
      tenants,
    } = this.state;
    const intendedUses = get(leaseMock, 'intended_uses', []);
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
            decisionMakerOptions={decisionMakerOptions}
            decisions={decisions}
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
          <div>
            <Row>
              <Column small={3} large={2}><FormFieldLabel>Käyttötarkoitus</FormFieldLabel></Column>
              <Column small={3} large={2}><FormFieldLabel>k-m2</FormFieldLabel></Column>
              <Column small={3} large={2}><FormFieldLabel>e / k-m2</FormFieldLabel></Column>
            </Row>
            {intendedUses.map((intendedUse, index) =>
              <Row key={index}>
                <Column small={3} large={2}>
                  <p>{intendedUse.type || '-'}</p>
                </Column>
                <Column small={3} large={2}>
                  <p>{intendedUse.km2 ? `${formatNumber(intendedUse. km2)} €` : '-'}</p>
                </Column>
                <Column small={3} large={2}>
                  <p>{intendedUse.ekm2 ? `${formatNumber(intendedUse.ekm2)} €` : '-'}</p>
                </Column>
              </Row>
            )}
          </div>
        }

        <Row>
          <Column small={6} medium={4} large={2}>
            <FormFieldLabel>Rahakorvaus</FormFieldLabel>
            <p>{leaseMock.cash_compensation ? formatNumber(leaseMock.cash_compensation) : '-'}</p>
          </Column>
          <Column small={6} medium={4} large={2}>
            <FormFieldLabel>Korvausinsvestoinnit</FormFieldLabel>
            <p>{leaseMock.replacement_investments ? formatNumber(leaseMock.replacement_investments) : '-'}</p>
          </Column>
          <Column small={6} medium={4} large={2}>
            <FormFieldLabel>Korvaus yhteensä</FormFieldLabel>
            <p>{leaseMock.total ? formatNumber(leaseMock.total) : '-'}</p>
          </Column>
          <Column small={6} medium={4} large={2}>
            <FormFieldLabel>Arvon nousu</FormFieldLabel>
            <p>{leaseMock.increase_in_value || '-'}</p>
          </Column>
          <Column small={6} medium={4} large={2}>
            <FormFieldLabel>Arvon osuus noususta</FormFieldLabel>
            <p>{leaseMock.share_in_increase_in_value || '-'}</p>
          </Column>
          <Column small={6} medium={4} large={2}>
            <FormFieldLabel>Vuokranalennus</FormFieldLabel>
            <p>{leaseMock.rent_reduction ? formatNumber(leaseMock.rent_reduction) : '-'}</p>
          </Column>
          <Column small={6} medium={4} large={2}>
            <FormFieldLabel>Arvioitu maksuvuosi</FormFieldLabel>
            <p>{leaseMock.estimated_payment_year || '-'}</p>
          </Column>
          <Column small={6} medium={4} large={2}>
            <FormFieldLabel>Maksu lähetetty SAP</FormFieldLabel>
            <p>{formatDate(leaseMock.sent_to_sap_date) || '-'}</p>
          </Column>
          <Column small={6} medium={4} large={2}>
            <FormFieldLabel>Maksettu</FormFieldLabel>
            <p>{formatDate(leaseMock.payment_date) || '-'}</p>
          </Column>
        </Row>

        <SubTitle>Liitetiedostot</SubTitle>
        <p>Ei liitetiedostoja</p>

        <Row>
          <Column>
            <FormFieldLabel>Kommentti</FormFieldLabel>
            <p>{leaseMock.note || '-'}</p>
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
        isFetching: getIsFetchingById(state, props.id),
        lease: getLeaseById(state, props.id),
        leaseAttributes: getLeaseAttributes(state),
      };
    },
    {
      fetchLeaseAttributes,
      fetchLeaseById,
    }
  )
)(LeaseItem);
