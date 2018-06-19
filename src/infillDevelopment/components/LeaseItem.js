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
  getContentDecisions,
  getContentLeaseAreas,
  getContentLeaseIdentifier,
  getContentTenants,
} from '$src/leases/helpers';
import {getAttributes} from '$src/infillDevelopment/selectors';
import {getAttributes as getLeaseAttributes, getIsFetchingById, getLeaseById} from '$src/leases/selectors';

import type {Attributes} from '$src/infillDevelopment/types';
import type {Attributes as LeaseAttributes, Lease, LeaseId} from '$src/leases/types';

type Props = {
  attributes: Attributes,
  fetchLeaseById: Function,
  id: LeaseId,
  isFetching: boolean,
  lease: Lease,
  leaseData: Object,
  leaseAttributes: LeaseAttributes,
}

type State = {
  decisionMakerOptions: Array<Object>,
  decisions: Array<Object>,
  identifier: ?string,
  intendedUseOptions: Array<Object>,
  planUnits: Array<Object>,
  plots: Array<Object>,
  tenants: Array<Object>,
}

class LeaseItem extends Component<Props, State> {
  state = {
    decisionMakerOptions: [],
    decisions: [],
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
      leaseAttributes,
    } = this.props;

    if(!isEmpty(attributes)) {
      this.updateAttributeStates();
    }

    if(!isEmpty(leaseAttributes)) {
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

  updateAttributeStates = () => {
    const {attributes} = this.props;

    this.setState({
      intendedUseOptions: getAttributeFieldOptions(attributes, 'leases.child.children.intended_uses.child.children.intended_use'),
    });
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
    const {id, isFetching, leaseData} = this.props;
    const {
      decisionMakerOptions,
      decisions,
      identifier,
      intendedUseOptions,
      planUnits,
      plots,
      tenants,
    } = this.state;
    const intendedUses = get(leaseData, 'intended_uses', []);
    const attachments = get(leaseData, 'attachments', []);

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
                  <p className='no-margin'>{intendedUse.km2 ? `${formatNumber(intendedUse. km2)} k-m²` : '-'}</p>
                </Column>
                <Column small={3} large={2}>
                  <p className='no-margin'>{intendedUse.ekm2 ? `${formatNumber(intendedUse.ekm2)} €/k-m²` : '-'}</p>
                </Column>
              </Row>
            )}
          </ListItems>
        }

        <Row>
          <Column small={6} medium={4} large={2}>
            <FormFieldLabel>Rahakorvaus</FormFieldLabel>
            <p>{leaseData.cash_compensation ? `${formatNumber(leaseData.cash_compensation)} €` : '-'}</p>
          </Column>
          <Column small={6} medium={4} large={2}>
            <FormFieldLabel>Korvausinvestoinnit</FormFieldLabel>
            <p>{leaseData.replacement_investments ? `${formatNumber(leaseData.replacement_investments)} €` : '-'}</p>
          </Column>
          <Column small={6} medium={4} large={2}>
            <FormFieldLabel>Korvaus yhteensä</FormFieldLabel>
            <p>{leaseData.total ? `${formatNumber(leaseData.total)} €` : '-'}</p>
          </Column>
          <Column small={6} medium={4} large={2}>
            <FormFieldLabel>Arvonnousu</FormFieldLabel>
            <p>{leaseData.increase_in_value ? `${formatNumber(leaseData.increase_in_value)} €` : '-'}</p>
          </Column>
          <Column small={6} medium={4} large={2}>
            <FormFieldLabel>Osuus arvonnoususta</FormFieldLabel>
            <p>{leaseData.share_in_increase_in_value ? `${formatNumber(leaseData.share_in_increase_in_value)} €` : '-'}</p>
          </Column>
          <Column small={6} medium={4} large={2}>
            <FormFieldLabel>Vuokranalennus</FormFieldLabel>
            <p>{leaseData.rent_reduction ? `${formatNumber(leaseData.rent_reduction)} €` : '-'}</p>
          </Column>
          <Column small={6} medium={4} large={2}>
            <FormFieldLabel>Arvioitu maksuvuosi</FormFieldLabel>
            <p>{leaseData.estimated_payment_year || '-'}</p>
          </Column>
          <Column small={6} medium={4} large={2}>
            <FormFieldLabel>Maksu lähetetty SAP</FormFieldLabel>
            <p>{formatDate(leaseData.sent_to_sap_date) || '-'}</p>
          </Column>
          <Column small={6} medium={4} large={2}>
            <FormFieldLabel>Maksettu</FormFieldLabel>
            <p>{formatDate(leaseData.payment_date) || '-'}</p>
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
        leaseAttributes: getLeaseAttributes(state),
      };
    },
    {
      fetchLeaseById,
    }
  )
)(LeaseItem);
