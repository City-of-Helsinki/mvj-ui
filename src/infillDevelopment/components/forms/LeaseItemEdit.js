// @flow
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {change, FieldArray, formValueSelector} from 'redux-form';
import {Row, Column} from 'react-foundation';
import isEmpty from 'lodash/isEmpty';
import flowRight from 'lodash/flowRight';
import get from 'lodash/get';
import type {Element} from 'react';

import {ActionTypes, AppConsumer} from '$src/app/AppContext';
import AddButtonThird from '$components/form/AddButtonThird';
import AddFileButton from '$components/form/AddFileButton';
import BoxContentWrapper from '$components/content/BoxContentWrapper';
import Collapse from '$src/components/collapse/Collapse';
import ExternalLink from '$components/links/ExternalLink';
import FileDownloadLink from '$components/file/FileDownloadLink';
import FormField from '$components/form/FormField';
import FormFieldLabel from '$components/form/FormFieldLabel';
import ListItems from '$components/content/ListItems';
import RemoveButton from '$components/form/RemoveButton';
import SubTitle from '$components/content/SubTitle';
import {
  deleteInfillDevelopmentFile,
  receiveCollapseStates,
  uploadInfillDevelopmentFile,
} from '$src/infillDevelopment/actions';
import {fetchLeaseById} from '$src/leases/actions';
import {ViewModes} from '$src/enums';
import {DeleteModalLabels, DeleteModalTitles, FormNames} from '$src/infillDevelopment/enums';
import {
  formatDate,
  formatDecimalNumberForDb,
  formatNumber,
} from '$util/helpers';
import {getContactFullName} from '$src/contacts/helpers';
import {
  getContentLeaseAreas,
  getContentLeaseIdentifier,
  getContentTenants,
  isTenantActive,
} from '$src/leases/helpers';
import {getUserFullName} from '$src/users/helpers';
import {getRouteById} from '$src/root/routes';
import {getAttributes, getCollapseStateByKey} from '$src/infillDevelopment/selectors';
import {
  getIsFetchingById,
  getLeaseById,
} from '$src/leases/selectors';
import {referenceNumber} from '$components/form/validations';

import type {Attributes} from '$src/infillDevelopment/types';
import type {Lease, LeaseId} from '$src/leases/types';

type DecisionsProps = {
  attributes: Attributes,
  fields: any,
  isSaveClicked: boolean,
}

const renderDecisions = ({attributes, fields, isSaveClicked}: DecisionsProps): Element<*> => {
  const handleAdd = () => fields.push({});

  return (
    <AppConsumer>
      {({dispatch}) => {
        return(
          <div>
            <SubTitle>Korvauksen päätökset</SubTitle>
            {!!fields && !!fields.length &&
              <div>
                <Row>
                  <Column small={3} large={2}><FormFieldLabel>Päättäjä</FormFieldLabel></Column>
                  <Column small={3} large={2}><FormFieldLabel>Pvm</FormFieldLabel></Column>
                  <Column small={3} large={2}><FormFieldLabel>Pykälä</FormFieldLabel></Column>
                  <Column small={3} large={2}><FormFieldLabel>Diaarunumero</FormFieldLabel></Column>
                </Row>
                {fields.map((field, index) => {
                  const handleRemove = () => {
                    dispatch({
                      type: ActionTypes.SHOW_DELETE_MODAL,
                      deleteFunction: () => {
                        fields.remove(index);
                      },
                      deleteModalLabel: DeleteModalLabels.DECISION,
                      deleteModalTitle: DeleteModalTitles.DECISION,
                    });
                  };

                  return (
                    <Row key={index}>
                      <Column small={3} large={2}>
                        <FormField
                          disableTouched={isSaveClicked}
                          fieldAttributes={get(attributes, 'infill_development_compensation_leases.child.children.decisions.child.children.decision_maker')}
                          name={`${field}.decision_maker`}
                          overrideValues={{
                            label: '',
                          }}
                        />
                      </Column>
                      <Column small={3} large={2}>
                        <FormField
                          disableTouched={isSaveClicked}
                          fieldAttributes={get(attributes, 'infill_development_compensation_leases.child.children.decisions.child.children.decision_date')}
                          name={`${field}.decision_date`}
                          overrideValues={{
                            label: '',
                          }}
                        />
                      </Column>
                      <Column small={3} large={2}>
                        <FormField
                          disableTouched={isSaveClicked}
                          fieldAttributes={get(attributes, 'infill_development_compensation_leases.child.children.decisions.child.children.section')}
                          name={`${field}.section`}
                          overrideValues={{
                            label: '',
                          }}
                        />
                      </Column>
                      <Column small={3} large={2}>
                        <FormField
                          disableTouched={isSaveClicked}
                          fieldAttributes={get(attributes, 'infill_development_compensation_leases.child.children.decisions.child.children.reference_number')}
                          name={`${field}.reference_number`}
                          validate={referenceNumber}
                          overrideValues={{
                            label: '',
                          }}
                        />
                      </Column>
                      <Column small={3} large={2}>
                        <RemoveButton
                          className='third-level'
                          onClick={handleRemove}
                          title="Poista päätös"
                        />
                      </Column>
                    </Row>
                  );
                })}
              </div>
            }
            <Row>
              <Column>
                <AddButtonThird
                  label='Lisää päätös'
                  onClick={handleAdd}
                  title='Lisää päätös'
                />
              </Column>
            </Row>
          </div>
        );
      }}
    </AppConsumer>
  );
};

type IntendedUsesProps = {
  attributes: Attributes,
  fields: any,
  isSaveClicked: boolean,
}

const renderIntendedUses = ({attributes, fields, isSaveClicked}: IntendedUsesProps): Element<*> => {
  const handleAdd = () => fields.push({});

  return (
    <AppConsumer>
      {({dispatch}) => {
        return(
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
                  const handleRemove = () => {
                    dispatch({
                      type: ActionTypes.SHOW_DELETE_MODAL,
                      deleteFunction: () => {
                        fields.remove(index);
                      },
                      deleteModalLabel: DeleteModalLabels.INTENDED_USE,
                      deleteModalTitle: DeleteModalTitles.INTENDED_USE,
                    });
                  };

                  return (
                    <Row key={index}>
                      <Column small={3} large={2}>
                        <FormField
                          disableTouched={isSaveClicked}
                          fieldAttributes={get(attributes, 'infill_development_compensation_leases.child.children.intended_uses.child.children.intended_use')}
                          name={`${field}.intended_use`}
                          overrideValues={{
                            label: '',
                          }}
                        />
                      </Column>
                      <Column small={3} large={2}>
                        <FormField
                          disableTouched={isSaveClicked}
                          fieldAttributes={get(attributes, 'infill_development_compensation_leases.child.children.intended_uses.child.children.floor_m2')}
                          name={`${field}.floor_m2`}
                          unit='k-m²'
                          overrideValues={{
                            label: '',
                          }}
                        />
                      </Column>
                      <Column small={3} large={2}>
                        <FormField
                          disableTouched={isSaveClicked}
                          fieldAttributes={get(attributes, 'infill_development_compensation_leases.child.children.intended_uses.child.children.amount_per_floor_m2')}
                          name={`${field}.amount_per_floor_m2`}
                          unit='€/k-m²'
                          overrideValues={{
                            label: '',
                          }}
                        />
                      </Column>
                      <Column small={3} large={2}>
                        <RemoveButton
                          className='third-level'
                          onClick={handleRemove}
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
                <AddButtonThird
                  label='Lisää käyttötarkoitus'
                  onClick={handleAdd}
                  title='Lisää käyttötarkoitus'
                />
              </Column>
            </Row>
          </div>
        );
      }}
    </AppConsumer>
  );
};

type Props = {
  attributes: Attributes,
  change: Function,
  collapseState: boolean,
  compensationInvestment: ?number,
  deleteInfillDevelopmentFile: Function,
  fetchLeaseById: Function,
  field: string,
  isFetching: boolean,
  isSaveClicked: boolean,
  lease: Lease,
  leaseId: LeaseId,
  infillDevelopment: Object,
  infillDevelopmentCompensationLeaseId: number,
  leaseFieldValue: Object,
  monetaryCompensation: ?number,
  onRemove: Function,
  receiveCollapseStates: Function,
  uploadInfillDevelopmentFile: Function,
}

type State = {
  identifier: ?string,
  planUnits: Array<Object>,
  plots: Array<Object>,
  tenants: Array<Object>,
}

class LeaseItemEdit extends Component<Props, State> {
  state = {
    identifier: null,
    planUnits: [],
    plots: [],
    tenants: [],
  }

  componentDidMount() {
    const {
      fetchLeaseById,
      leaseFieldValue,
      lease,
    } = this.props;

    if(isEmpty(lease) && !isEmpty(leaseFieldValue)) {
      fetchLeaseById(leaseFieldValue.value);
    } else {
      this.updateLeaseContentStates();
    }

    this.updateTotalCompensation();
  }

  componentDidUpdate(prevProps) {
    if(prevProps.leaseFieldValue !== this.props.leaseFieldValue) {
      const {fetchLeaseById, lease, leaseFieldValue} = this.props;
      if(isEmpty(lease) && !isEmpty(leaseFieldValue)) {
        fetchLeaseById(leaseFieldValue.value);
      } else {
        this.updateLeaseContentStates();
      }
    }

    if(prevProps.compensationInvestment !== this.props.compensationInvestment ||
      prevProps.monetaryCompensation !== this.props.monetaryCompensation) {
      this.updateTotalCompensation();
    }

    if(prevProps.lease !== this.props.lease) {
      this.updateLeaseContentStates();
    }
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

  updateTotalCompensation = () => {
    const {compensationInvestment, change, field, monetaryCompensation} = this.props;
    change(FormNames.INFILL_DEVELOPMENT, `${field}.compensation_total`, formatNumber(formatDecimalNumberForDb(monetaryCompensation) + formatDecimalNumberForDb(compensationInvestment)));
  }

  handleFileChange = (e) => {
    const {
      infillDevelopment,
      infillDevelopmentCompensationLeaseId,
      uploadInfillDevelopmentFile,
    } = this.props;

    uploadInfillDevelopmentFile({
      id: infillDevelopment.id,
      data: {
        infill_development_compensation_lease: infillDevelopmentCompensationLeaseId,
      },
      file: e.target.files[0],
    });
  };

  handleDeleteInfillDevelopmentFile = (fileId: number) => {
    const {deleteInfillDevelopmentFile, infillDevelopment} = this.props;
    deleteInfillDevelopmentFile({
      id: infillDevelopment.id,
      fileId,
    });
  }

  handleCollapseToggle = (val: boolean) => {
    const {infillDevelopmentCompensationLeaseId, receiveCollapseStates} = this.props;
    if(!infillDevelopmentCompensationLeaseId){return;}

    receiveCollapseStates({
      [ViewModes.EDIT]: {
        [FormNames.INFILL_DEVELOPMENT]: {
          [infillDevelopmentCompensationLeaseId]: val,
        },
      },
    });
  }

  render() {
    const {
      attributes,
      collapseState,
      field,
      infillDevelopment,
      infillDevelopmentCompensationLeaseId,
      isFetching,
      isSaveClicked,
      leaseId,
      onRemove,
    } = this.props;

    const {
      identifier,
      planUnits,
      plots,
      tenants,
    } = this.state;

    const attachments = get(infillDevelopment, `${field}.attachments`, []);

    return (
      <Collapse
        className='collapse__secondary'
        defaultOpen={collapseState !== undefined ? collapseState : true}
        headerTitle={<h4 className='collapse__header-title'>{isFetching ? 'Ladataan...' : (identifier || '-')}</h4>}
        onRemove={onRemove}
        onToggle={this.handleCollapseToggle}
      >
        <BoxContentWrapper>
          <Row>
            <Column small={6} medium={4} large={2}>
              <FormField
                disableTouched={isSaveClicked}
                fieldAttributes={get(attributes, 'infill_development_compensation_leases.child.children.lease')}
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
                      <ExternalLink
                        className='no-margin'
                        href={`${getRouteById('contacts')}/${get(tenant, 'tenant.contact.id')}`}
                        label={getContactFullName(get(tenant, 'tenant.contact'))}
                      />
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
              {isFetching && <p>Ladataan...</p>}
              {!isFetching && !leaseId && <p>-</p>}
              {!isFetching && leaseId &&
                <ExternalLink
                  href={`${getRouteById('leases')}/${leaseId}?tab=7`}
                  label='Karttalinkki'
                />
              }
            </Column>
          </Row>

          <FieldArray
            attributes={attributes}
            component={renderDecisions}
            isSaveClicked={isSaveClicked}
            name={`${field}.decisions`}
          />

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
                fieldAttributes={get(attributes, 'infill_development_compensation_leases.child.children.monetary_compensation_amount')}
                name={`${field}.monetary_compensation_amount`}
                unit='€'
              />
            </Column>
            <Column small={6} medium={4} large={2}>
              <FormField
                disableTouched={isSaveClicked}
                fieldAttributes={get(attributes, 'infill_development_compensation_leases.child.children.compensation_investment_amount')}
                name={`${field}.compensation_investment_amount`}
                unit='€'
              />
            </Column>
            <Column small={6} medium={4} large={2}>
              <FormField
                disabled
                disableDirty
                disableTouched={isSaveClicked}
                fieldAttributes={{}}
                name={`${field}.compensation_total`}
                unit='€'
                overrideValues={{
                  label: 'Korvaus yhteensä',
                }}
              />
            </Column>
            <Column small={6} medium={4} large={2}>
              <FormField
                disableTouched={isSaveClicked}
                fieldAttributes={get(attributes, 'infill_development_compensation_leases.child.children.increase_in_value')}
                name={`${field}.increase_in_value`}
                unit='€'
              />
            </Column>
            <Column small={6} medium={4} large={2}>
              <FormField
                disableTouched={isSaveClicked}
                fieldAttributes={get(attributes, 'infill_development_compensation_leases.child.children.part_of_the_increase_in_value')}
                name={`${field}.part_of_the_increase_in_value`}
                unit='€'
              />
            </Column>
            <Column small={6} medium={4} large={2}>
              <FormField
                disableTouched={isSaveClicked}
                fieldAttributes={get(attributes, 'infill_development_compensation_leases.child.children.discount_in_rent')}
                name={`${field}.discount_in_rent`}
                unit='€'
              />
            </Column>
          </Row>
          <Row>
            <Column small={6} medium={4} large={2}>
              <FormField
                disableTouched={isSaveClicked}
                fieldAttributes={get(attributes, 'infill_development_compensation_leases.child.children.year')}
                name={`${field}.year`}
              />
            </Column>
            <Column small={6} medium={4} large={2}>
              <FormField
                disableTouched={isSaveClicked}
                fieldAttributes={get(attributes, 'infill_development_compensation_leases.child.children.sent_to_sap_date')}
                name={`${field}.sent_to_sap_date`}
              />
            </Column>
            <Column small={6} medium={4} large={2}>
              <FormField
                disableTouched={isSaveClicked}
                fieldAttributes={get(attributes, 'infill_development_compensation_leases.child.children.paid_date')}
                name={`${field}.paid_date`}
              />
            </Column>
          </Row>
          {!!infillDevelopmentCompensationLeaseId &&
            <AppConsumer>
              {({dispatch}) => {
                return(
                  <div>
                    <SubTitle>Liitetiedostot</SubTitle>
                    {!!attachments && !!attachments.length &&
                      <div>
                        <Row>
                          <Column small={3} large={4}>
                            <FormFieldLabel>Nimi</FormFieldLabel>
                          </Column>
                          <Column small={3} large={2}>
                            <FormFieldLabel>Pvm</FormFieldLabel>
                          </Column>
                          <Column small={3} large={2}>
                            <FormFieldLabel>Lataaja</FormFieldLabel>
                          </Column>
                        </Row>
                        {attachments.map((file, index) => {
                          const handleRemove = () => {
                            dispatch({
                              type: ActionTypes.SHOW_DELETE_MODAL,
                              deleteFunction: () => {
                                this.handleDeleteInfillDevelopmentFile(file.id);
                              },
                              deleteModalLabel: DeleteModalLabels.ATTACHMENT,
                              deleteModalTitle: DeleteModalTitles.ATTACHMENT,
                            });
                          };

                          return (
                            <Row key={index}>
                              <Column small={3} large={4}>
                                <FileDownloadLink
                                  fileUrl={file.file}
                                  label={file.filename}
                                />
                              </Column>
                              <Column small={3} large={2}>
                                <p>{formatDate(file.uploaded_at) || '-'}</p>
                              </Column>
                              <Column small={3} large={2}>
                                <p>{getUserFullName((file.uploader)) || '-'}</p>
                              </Column>
                              <Column small={3} large={2}>
                                <RemoveButton
                                  className='third-level'
                                  onClick={handleRemove}
                                  title="Poista liitetiedosto"
                                />
                              </Column>
                            </Row>
                          );
                        })}
                      </div>
                    }
                    <AddFileButton
                      label='Lisää tiedosto'
                      name={`${infillDevelopmentCompensationLeaseId}`}
                      onChange={this.handleFileChange}
                    />
                  </div>
                );
              }}
            </AppConsumer>
          }
          <Row>
            <Column>
              <FormField
                disableTouched={isSaveClicked}
                fieldAttributes={get(attributes, 'infill_development_compensation_leases.child.children.note')}
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
      const lease = selector(state, `${field}.lease.value`);
      const leaseId = selector(state, `${field}.id`);

      return {
        attributes: getAttributes(state),
        collapseState: getCollapseStateByKey(state, `${ViewModes.EDIT}.${FormNames.INFILL_DEVELOPMENT}.${leaseId}`),
        compensationInvestment: selector(state, `${field}.compensation_investment_amount`),
        infillDevelopmentCompensationLeaseId: leaseId,
        isFetching: getIsFetchingById(state, lease),
        lease: getLeaseById(state, lease),
        leaseId: lease,
        leaseFieldValue: leaseFieldValue,
        monetaryCompensation: selector(state, `${field}.monetary_compensation_amount`),
      };
    },
    {
      change,
      deleteInfillDevelopmentFile,
      fetchLeaseById,
      receiveCollapseStates,
      uploadInfillDevelopmentFile,
    }
  )
)(LeaseItemEdit);
