// @flow
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Row, Column} from 'react-foundation';
import isEmpty from 'lodash/isEmpty';
import flowRight from 'lodash/flowRight';
import get from 'lodash/get';

import Collapse from '$src/components/collapse/Collapse';
import ExternalLink from '$components/links/ExternalLink';
import FileDownloadLink from '$components/file/FileDownloadLink';
import FormText from '$components/form/FormText';
import FormTextTitle from '$components/form/FormTextTitle';
import FormTitleAndText from '$components/form/FormTitleAndText';
import LeaseInfo from './LeaseInfo';
import ListItem from '$components/content/ListItem';
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

  componentDidMount() {
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
        {!decisions.length && <FormText>Ei päätöksiä</FormText>}
        {!!decisions.length &&
          <ListItems>
            <Row>
              <Column small={3} large={2}><FormTextTitle title='Päättäjä' /></Column>
              <Column small={3} large={2}><FormTextTitle title='Pvm' /></Column>
              <Column small={3} large={2}><FormTextTitle title='Pykälä' /></Column>
              <Column small={3} large={2}><FormTextTitle title='Diaarinumero' /></Column>
            </Row>
            {decisions.map((decision, index) =>
              <Row key={index}>
                <Column small={3} large={2}>
                  <ListItem>{getLabelOfOption(decisionMakerOptions, decision.decision_maker) || '-'}</ListItem>
                </Column>
                <Column small={3} large={2}>
                  <ListItem>{formatDate(decision.decision_date) || '-'}</ListItem>
                </Column>
                <Column small={3} large={2}>
                  <ListItem>{decision.section ? `${decision.section} §` : '-'}</ListItem>
                </Column>
                <Column small={3} large={2}>
                  {decision.reference_number
                    ? <ListItem>
                      <ExternalLink
                        href={getReferenceNumberLink(decision.reference_number)}
                        text={decision.reference_number}
                      />
                    </ListItem>
                    : <ListItem>-</ListItem>
                  }
                </Column>
              </Row>
            )}
          </ListItems>
        }
        <SubTitle>Käyttötarkoitus</SubTitle>
        {!intendedUses.length && <FormText>Ei käyttötarkoituksia</FormText>}
        {!!intendedUses.length &&
          <ListItems>
            <Row>
              <Column small={3} large={2}><FormTextTitle title='Käyttötarkoitus' /></Column>
              <Column small={3} large={2}><FormTextTitle title='k-m2' /></Column>
              <Column small={3} large={2}><FormTextTitle title='€ / k-m2' /></Column>
            </Row>
            {intendedUses.map((intendedUse, index) =>
              <Row key={index}>
                <Column small={3} large={2}>
                  <ListItem>{getLabelOfOption(intendedUseOptions, intendedUse.intended_use) || '-'}</ListItem>
                </Column>
                <Column small={3} large={2}>
                  <ListItem>{intendedUse.floor_m2 ? `${formatNumber(intendedUse. floor_m2)} k-m²` : '-'}</ListItem>
                </Column>
                <Column small={3} large={2}>
                  <ListItem>{intendedUse.amount_per_floor_m2 ? `${formatNumber(intendedUse.amount_per_floor_m2)} €/k-m²` : '-'}</ListItem>
                </Column>
              </Row>
            )}
          </ListItems>
        }

        <Row>
          <Column small={6} medium={4} large={2}>
            <FormTitleAndText
              title='Rahakorvaus'
              text={leaseData.monetary_compensation_amount ? `${formatNumber(leaseData.monetary_compensation_amount)} €` : '-'}
            />
          </Column>
          <Column small={6} medium={4} large={2}>
            <FormTitleAndText
              title='Korvausinvestoinnit'
              text={leaseData.compensation_investment_amount ? `${formatNumber(leaseData.compensation_investment_amount)} €` : '-'}
            />
          </Column>
          <Column small={6} medium={4} large={2}>
            <FormTitleAndText
              title='Korvaus yhteensä'
              text={`${formatNumber(totalCompensation)} €`}
            />
          </Column>
          <Column small={6} medium={4} large={2}>
            <FormTitleAndText
              title='Arvonnousu'
              text={leaseData.increase_in_value ? `${formatNumber(leaseData.increase_in_value)} €` : '-'}
            />
          </Column>
          <Column small={6} medium={4} large={2}>
            <FormTitleAndText
              title='Osuus arvonnoususta'
              text={leaseData.part_of_the_increase_in_value ? `${formatNumber(leaseData.part_of_the_increase_in_value)} €` : '-'}
            />
          </Column>
          <Column small={6} medium={4} large={2}>
            <FormTitleAndText
              title='Vuokranalennus'
              text={leaseData.discount_in_rent ? `${formatNumber(leaseData.discount_in_rent)} €` : '-'}
            />
          </Column>
          <Column small={6} medium={4} large={2}>
            <FormTitleAndText
              title='Arvioitu maksuvuosi'
              text={leaseData.year || '-'}
            />
          </Column>
          <Column small={6} medium={4} large={2}>
            <FormTitleAndText
              title='Maksu lähetetty SAP'
              text={formatDate(leaseData.sent_to_sap_date) || '-'}
            />
          </Column>
          <Column small={6} medium={4} large={2}>
            <FormTitleAndText
              title='Maksettu'
              text={formatDate(leaseData.paid_date) || '-'}
            />
          </Column>
        </Row>

        <SubTitle>Liitetiedostot</SubTitle>
        {!attachments.length && <FormText>Ei liitetiedostoja</FormText>}
        {!!attachments.length &&
          <div>
            <Row>
              <Column small={4} large={4}>
                <FormTextTitle title='Nimi' />
              </Column>
              <Column small={4} large={2}>
                <FormTextTitle title='Pvm' />
              </Column>
              <Column small={4} large={2}>
                <FormTextTitle title='Lataaja' />
              </Column>
            </Row>
            {attachments.map((file, index) => {
              return (
                <Row key={index}>
                  <Column small={4} large={4}>
                    <FileDownloadLink
                      fileUrl={file.file}
                      label={file.filename}
                    />
                  </Column>
                  <Column small={4} large={2}>
                    <FormText>{formatDate(file.uploaded_at) || '-'}</FormText>
                  </Column>
                  <Column small={4} large={2}>
                    <FormText>{getUserFullName((file.uploader)) || '-'}</FormText>
                  </Column>
                </Row>
              );
            })}
          </div>
        }
        <Row>
          <Column>
            <FormTitleAndText
              title='Huomautus'
              text={leaseData.note || '-'}
            />
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
