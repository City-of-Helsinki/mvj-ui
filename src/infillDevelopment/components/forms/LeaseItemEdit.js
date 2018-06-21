// @flow
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {FieldArray, formValueSelector} from 'redux-form';
import {Row, Column} from 'react-foundation';
import isEmpty from 'lodash/isEmpty';
import flowRight from 'lodash/flowRight';
import get from 'lodash/get';
import type {Element} from 'react';

import AddButtonSecondary from '$components/form/AddButtonSecondary';
import AddFileButton from '$components/form/AddFileButton';
import BoxContentWrapper from '$components/content/BoxContentWrapper';
import Collapse from '$src/components/collapse/Collapse';
import FormField from '$components/form/FormField';
import FormFieldLabel from '$components/form/FormFieldLabel';
import ListItems from '$components/content/ListItems';
import RemoveButton from '$components/form/RemoveButton';
import SubTitle from '$components/content/SubTitle';
import {fetchAttributes as fetchLeaseAttributes, fetchLeaseById} from '$src/leases/actions';
import {FormNames} from '$src/infillDevelopment/enums';
import {
  formatDate,
  getAttributeFieldOptions,
  getLabelOfOption,
  getReferenceNumberLink,
} from '$util/helpers';
import {getContactFullName} from '$src/contacts/helpers';
import {
  getContentDecisions,
  getContentLeaseAreas,
  getContentLeaseIdentifier,
  getContentTenants,
} from '$src/leases/helpers';
import {getRouteById} from '$src/root/routes';
import {getAttributes} from '$src/infillDevelopment/selectors';
import {
  getAttributes as getLeaseAttributes,
  getIsFetchingById,
  getLeaseById,
} from '$src/leases/selectors';

import type {Attributes} from '$src/infillDevelopment/types';
import type {Attributes as LeaseAttributes, Lease} from '$src/leases/types';

type AttachmentsProps = {
  fields: any,
  files: Array<Object>,
}

const renderAttachments = ({fields, files}: AttachmentsProps): Element<*> => {

  const handleFileChange = (e) => {
    fields.push({
      date: new Date().toISOString(),
      file: e.target.files[0],
    });
  };

  return (
    <div>
      <SubTitle>Liitetiedostot</SubTitle>
      {!!fields && !!fields.length &&
        <div>
          <Row>
            <Column small={6} large={4}>
              <FormFieldLabel>Nimi</FormFieldLabel>
            </Column>
            <Column small={4} large={2}>
              <FormFieldLabel>Pvm</FormFieldLabel>
            </Column>
          </Row>
          {fields.map((field, index) => {
            const file = files[index];
            return (
              <Row key={index}>
                <Column small={6} large={4}>
                  <p>{get(file, 'file.name') || '-'}</p>
                </Column>
                <Column small={4} large={2}>
                  <p>{formatDate(file.date) || '-'}</p>
                </Column>
                <Column small={2} large={2}>
                  <RemoveButton
                    onClick={() => fields.remove(index)}
                    title="Poista tiedosto"
                  />
                </Column>
              </Row>
            );
          })}
        </div>
      }
      <AddFileButton
        label='Lisää tiedosto'
        name={get(fields, 'name')}
        onChange={handleFileChange}
      />
    </div>
  );
};

type IntendedUsesProps = {
  attributes: Attributes,
  fields: any,
  isSaveClicked: boolean,
}

const renderIntendedUses = ({attributes, fields, isSaveClicked}: IntendedUsesProps): Element<*> => {
  return (
    <div>
      <SubTitle>Käyttötarkoitus</SubTitle>
      {!!fields && !!fields.length &&
        <div>
          <Row>
            <Column small={3} large={2}><FormFieldLabel>Käyttötarkoitus</FormFieldLabel></Column>
            <Column small={3} large={2}><FormFieldLabel>k-m²</FormFieldLabel></Column>
            <Column small={3} large={2}><FormFieldLabel>€/k-m²</FormFieldLabel></Column>
          </Row>
          {fields.map((field, index) => {
            return (
              <Row key={index}>
                <Column small={3} large={2}>
                  <FormField
                    disableTouched={isSaveClicked}
                    fieldAttributes={get(attributes, 'leases.child.children.intended_uses.child.children.intended_use')}
                    name={`${field}.intended_use`}
                    overrideValues={{
                      label: '',
                    }}
                  />
                </Column>
                <Column small={3} large={2}>
                  <FormField
                    disableTouched={isSaveClicked}
                    fieldAttributes={get(attributes, 'leases.child.children.intended_uses.child.children.km2')}
                    name={`${field}.km2`}
                    unit='k-m²'
                    overrideValues={{
                      label: '',
                    }}
                  />
                </Column>
                <Column small={3} large={2}>
                  <FormField
                    disableTouched={isSaveClicked}
                    fieldAttributes={get(attributes, 'leases.child.children.intended_uses.child.children.ekm2')}
                    name={`${field}.ekm2`}
                    unit='€/k-m²'
                    overrideValues={{
                      label: '',
                    }}
                  />
                </Column>
                <Column small={3} large={2}>
                  <RemoveButton
                    onClick={() => fields.remove(index)}
                    title="Poista käyttötarkoitus"
                  />
                </Column>
              </Row>
            );
          })}
        </div>
      }
      <Row>
        <Column>
          <AddButtonSecondary
            label='Lisää käyttötarkoitus'
            onClick={() => fields.push({})}
            title='Lisää käyttötarkoitus'
          />
        </Column>
      </Row>
    </div>
  );
};

type Props = {
  attributes: Attributes,
  fetchLeaseAttributes: Function,
  fetchLeaseById: Function,
  field: string,
  fields: any,
  files: any,
  index: number,
  isFetching: boolean,
  isSaveClicked: boolean,
  lease: Lease,
  leaseFieldValue: Object,
  leaseAttributes: LeaseAttributes,
  leaseFieldValue: Object,
}

type State = {
  decisionMakerOptions: Array<Object>,
  decisions: Array<Object>,
  identifier: ?string,
  planUnits: Array<Object>,
  plots: Array<Object>,
  tenants: Array<Object>,
}

class LeaseItemEdit extends Component<Props, State> {
  state = {
    decisionMakerOptions: [],
    decisions: [],
    identifier: null,
    planUnits: [],
    plots: [],
    tenants: [],
  }

  componentDidMount() {
    const {
      fetchLeaseAttributes,
      fetchLeaseById,
      leaseFieldValue,
      lease,
      leaseAttributes,
    } = this.props;

    if(isEmpty(leaseAttributes)) {
      fetchLeaseAttributes();
    } else {
      this.updateLeaseAttributeStates();
    }

    if(isEmpty(lease) && !isEmpty(leaseFieldValue)) {
      fetchLeaseById(leaseFieldValue.value);
    } else {
      this.updateLeaseContentStates();
    }
  }

  componentDidUpdate(prevProps) {
    if(prevProps.leaseAttributes !== this.props.leaseAttributes) {
      this.updateLeaseAttributeStates();
    }

    if(prevProps.leaseFieldValue !== this.props.leaseFieldValue) {
      const {fetchLeaseById, lease, leaseFieldValue} = this.props;
      if(isEmpty(lease) && !isEmpty(leaseFieldValue)) {
        fetchLeaseById(leaseFieldValue.value);
      } else {
        this.updateLeaseContentStates();
      }
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
    const {
      attributes,
      field,
      fields,
      files,
      index,
      isFetching,
      isSaveClicked,
      leaseAttributes,
    } = this.props;

    const {
      decisionMakerOptions,
      decisions,
      identifier,
      planUnits,
      plots,
      tenants,
    } = this.state;

    return (
      <Collapse
        className='collapse__secondary'
        defaultOpen={true}
        headerTitle={
          <h4 className='collapse__header-title'>{isFetching ? 'Ladataan...' : (identifier || '-')}</h4>
        }
      >
        <BoxContentWrapper>
          <RemoveButton
            className='position-topright-no-padding'
            onClick={() => fields.remove(index)}
            title="Poista käyttötarkoitus"
          />
          <Row>
            <Column small={6} medium={4} large={2}>
              <FormField
                disableTouched={isSaveClicked}
                fieldAttributes={get(leaseAttributes, 'leases.child.children.lease')}
                name={`${field}.lease`}
                overrideValues={{
                  fieldType: 'lease',
                  label: 'Vuokratunnus',
                }}
              />
            </Column>
            <Column small={6} medium={4} large={2}>
              <FormFieldLabel>Vuokralainen</FormFieldLabel>
              {isFetching && <p>Ladataan...</p>}
              {!isFetching && !tenants.length && <p>-</p>}
              {!isFetching && !!tenants.length &&
                <ListItems>
                  {tenants.map((tenant) =>
                    <p key={tenant.id} className='no-margin'>
                      <a className='no-margin' href={`${getRouteById('contacts')}/${get(tenant, 'tenant.contact.id')}`} target='_blank'>
                        {getContactFullName(get(tenant, 'tenant.contact'))}
                      </a>
                    </p>
                  )}
                </ListItems>
              }
            </Column>
            <Column small={6} medium={4} large={2}>
              <FormFieldLabel>Kiinteistö</FormFieldLabel>
              {isFetching && <p>Ladataan...</p>}
              {!isFetching && !plots.length && <p>-</p>}
              {!isFetching && !!plots.length &&
                <ListItems>
                  {plots.map((plot, index) =>
                    <p key={index} className='no-margin'>{plot.identifier || '-'}</p>
                  )}
                </ListItems>
              }
            </Column>
            <Column small={6} medium={4} large={2}>
              <FormFieldLabel>Kaavayksikkö</FormFieldLabel>
              {isFetching && <p>Ladataan...</p>}
              {!isFetching && !planUnits.length && <p>-</p>}
              {!isFetching && !!planUnits.length &&
                <ListItems>
                  {planUnits.map((planUnit, index) =>
                    <p key={index} className='no-margin'>{planUnit.identifier || '-'}</p>
                  )}
                </ListItems>
              }
            </Column>
            <Column small={6} medium={4} large={2}>
              {!isFetching && <a onClick={() => {alert('TODO. OPEN MAP LINK');}}>Karttalinkki</a>}
            </Column>
          </Row>
          <div>
            <SubTitle>Korvauksen päätös</SubTitle>
            {isFetching && <p>Ladataan...</p>}
            {!isFetching &&
              <div>
                {!decisions.length && <p>Ei päätöksiä</p>}
                {!!decisions.length &&
                  <ListItems>
                    <Row>
                      <Column small={3} large={2}><FormFieldLabel>Päättäjä</FormFieldLabel></Column>
                      <Column small={3} large={2}><FormFieldLabel>Pvm</FormFieldLabel></Column>
                      <Column small={3} large={2}><FormFieldLabel>Pykälä</FormFieldLabel></Column>
                      <Column small={3} large={2}><FormFieldLabel>Diaarinumero</FormFieldLabel></Column>
                    </Row>
                    {decisions.map((decision) =>
                      <Row key={decision.id}>
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
                                href={getReferenceNumberLink(decision.reference_number)}>
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
              </div>
            }
          </div>
          <FieldArray
            attributes={attributes}
            component={renderIntendedUses}
            isSaveClicked={isSaveClicked}
            name={`${field}.intended_uses`}
          />

          <Row>
            <Column small={6} medium={4} large={2}>
              <FormField
                disableTouched={isSaveClicked}
                fieldAttributes={get(attributes, 'leases.child.children.cash_compensation')}
                name={`${field}.cash_compensation`}
                unit='€'
              />
            </Column>
            <Column small={6} medium={4} large={2}>
              <FormField
                disableTouched={isSaveClicked}
                fieldAttributes={get(attributes, 'leases.child.children.replacement_investments')}
                name={`${field}.replacement_investments`}
                unit='€'
              />
            </Column>
            <Column small={6} medium={4} large={2}>
              <FormField
                disableTouched={isSaveClicked}
                fieldAttributes={get(attributes, 'leases.child.children.total')}
                name={`${field}.total`}
                unit='€'
              />
            </Column>
            <Column small={6} medium={4} large={2}>
              <FormField
                disableTouched={isSaveClicked}
                fieldAttributes={get(attributes, 'leases.child.children.increase_in_value')}
                name={`${field}.increase_in_value`}
                unit='€'
              />
            </Column>
            <Column small={6} medium={4} large={2}>
              <FormField
                disableTouched={isSaveClicked}
                fieldAttributes={get(attributes, 'leases.child.children.share_in_increase_in_value')}
                name={`${field}.share_in_increase_in_value`}
                unit='€'
              />
            </Column>
            <Column small={6} medium={4} large={2}>
              <FormField
                disableTouched={isSaveClicked}
                fieldAttributes={get(attributes, 'leases.child.children.rent_reduction')}
                name={`${field}.rent_reduction`}
                unit='€'
              />
            </Column>
          </Row>
          <Row>
            <Column small={6} medium={4} large={2}>
              <FormField
                disableTouched={isSaveClicked}
                fieldAttributes={get(attributes, 'leases.child.children.estimated_payment_year')}
                name={`${field}.estimated_payment_year`}
              />
            </Column>
            <Column small={6} medium={4} large={2}>
              <FormField
                disableTouched={isSaveClicked}
                fieldAttributes={get(attributes, 'leases.child.children.sent_to_sap_date')}
                name={`${field}.sent_to_sap_date`}
              />
            </Column>
            <Column small={6} medium={4} large={2}>
              <FormField
                disableTouched={isSaveClicked}
                fieldAttributes={get(attributes, 'leases.child.children.payment_date')}
                name={`${field}.payment_date`}
              />
            </Column>
          </Row>
          <FieldArray
            attributes={attributes}
            files={files}
            label='Lisää tiedosto'
            name={`${field}.attachments`}
            component={renderAttachments}
          />
          <Row>
            <Column>
              <FormField
                disableTouched={isSaveClicked}
                fieldAttributes={get(attributes, 'leases.child.children.note')}
                name={`${field}.note`}
              />
            </Column>
          </Row>
        </BoxContentWrapper>
      </Collapse>
    );
  }
}

const selector = formValueSelector(FormNames.INFILL_DEVELOPMENT);

export default flowRight(
  connect(
    (state, props) => {
      const {field} = props;
      const leaseFieldValue = selector(state, `${field}.lease`);

      if(leaseFieldValue) {
        return {
          attributes: getAttributes(state),
          files: selector(state, `${field}.attachments`),
          isFetching: getIsFetchingById(state, leaseFieldValue.value),
          lease: getLeaseById(state, leaseFieldValue.value),
          leaseAttributes: getLeaseAttributes(state),
          leaseFieldValue: leaseFieldValue,
        };
      }
      return {
        attributes: getAttributes(state),
        leaseAttributes: getLeaseAttributes(state),
        leaseFieldValue: leaseFieldValue,
      };

    },
    {
      fetchLeaseAttributes,
      fetchLeaseById,
    }
  )
)(LeaseItemEdit);
