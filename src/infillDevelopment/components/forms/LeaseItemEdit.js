// @flow
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {FieldArray, formValueSelector} from 'redux-form';
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
import FormText from '$components/form/FormText';
import FormTextTitle from '$components/form/FormTextTitle';
import FormTitleAndText from '$components/form/FormTitleAndText';
import ListItem from '$components/content/ListItem';
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
                  <Column small={3} large={2}><FormTextTitle title='Päättäjä' /></Column>
                  <Column small={3} large={2}><FormTextTitle title='Pvm' /></Column>
                  <Column small={3} large={2}><FormTextTitle title='Pykälä' /></Column>
                  <Column small={3} large={2}><FormTextTitle title='Diaarinumero' /></Column>
                </Row>
                {fields.map((field, index) => {
                  const handleRemove = () => {
                    dispatch({
                      type: ActionTypes.SHOW_CONFIRMATION_MODAL,
                      confirmationFunction: () => {
                        fields.remove(index);
                      },
                      confirmationModalButtonText: 'Poista',
                      confirmationModalLabel: DeleteModalLabels.DECISION,
                      confirmationModalTitle: DeleteModalTitles.DECISION,
                    });
                  };

                  return (
                    <Row key={index}>
                      <Column small={3} large={2}>
                        <FormField
                          disableTouched={isSaveClicked}
                          fieldAttributes={get(attributes, 'infill_development_compensation_leases.child.children.decisions.child.children.decision_maker')}
                          invisibleLabel
                          name={`${field}.decision_maker`}
                        />
                      </Column>
                      <Column small={3} large={2}>
                        <FormField
                          disableTouched={isSaveClicked}
                          fieldAttributes={get(attributes, 'infill_development_compensation_leases.child.children.decisions.child.children.decision_date')}
                          invisibleLabel
                          name={`${field}.decision_date`}
                        />
                      </Column>
                      <Column small={3} large={2}>
                        <FormField
                          disableTouched={isSaveClicked}
                          fieldAttributes={get(attributes, 'infill_development_compensation_leases.child.children.decisions.child.children.section')}
                          invisibleLabel
                          name={`${field}.section`}
                        />
                      </Column>
                      <Column small={3} large={2}>
                        <FormField
                          disableTouched={isSaveClicked}
                          fieldAttributes={get(attributes, 'infill_development_compensation_leases.child.children.decisions.child.children.reference_number')}
                          invisibleLabel
                          name={`${field}.reference_number`}
                          validate={referenceNumber}
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
                  <Column small={3} large={2}><FormTextTitle title='Käyttötarkoitu' /></Column>
                  <Column small={3} large={2}><FormTextTitle title='k-m²' /></Column>
                  <Column small={3} large={2}><FormTextTitle title='€/k-m²' /></Column>
                </Row>
                {fields.map((field, index) => {
                  const handleRemove = () => {
                    dispatch({
                      type: ActionTypes.SHOW_CONFIRMATION_MODAL,
                      confirmationFunction: () => {
                        fields.remove(index);
                      },
                      confirmationModalButtonText: 'Poista',
                      confirmationModalLabel: DeleteModalLabels.INTENDED_USE,
                      confirmationModalTitle: DeleteModalTitles.INTENDED_USE,
                    });
                  };

                  return (
                    <Row key={index}>
                      <Column small={3} large={2}>
                        <FormField
                          disableTouched={isSaveClicked}
                          fieldAttributes={get(attributes, 'infill_development_compensation_leases.child.children.intended_uses.child.children.intended_use')}
                          invisibleLabel
                          name={`${field}.intended_use`}
                        />
                      </Column>
                      <Column small={3} large={2}>
                        <FormField
                          disableTouched={isSaveClicked}
                          fieldAttributes={get(attributes, 'infill_development_compensation_leases.child.children.intended_uses.child.children.floor_m2')}
                          invisibleLabel
                          name={`${field}.floor_m2`}
                          unit='k-m²'
                        />
                      </Column>
                      <Column small={3} large={2}>
                        <FormField
                          disableTouched={isSaveClicked}
                          fieldAttributes={get(attributes, 'infill_development_compensation_leases.child.children.intended_uses.child.children.amount_per_floor_m2')}
                          invisibleLabel
                          name={`${field}.amount_per_floor_m2`}
                          unit='€/k-m²'
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

  getTotalCompensation = () => {
    const {compensationInvestment, monetaryCompensation} = this.props;
    const formatedCompensationInvestment = formatDecimalNumberForDb(compensationInvestment);
    const formatedMonetaryCompensation = formatDecimalNumberForDb(monetaryCompensation);

    return  ((formatedCompensationInvestment && !isNaN(formatedCompensationInvestment)) ? formatedCompensationInvestment : 0)
      + ((formatedMonetaryCompensation  && !isNaN(formatedMonetaryCompensation)) ? formatedMonetaryCompensation : 0);
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
    const totalCompensation = this.getTotalCompensation();

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
              <FormTextTitle title='Vuokralainen' />
              {isFetching && <FormText>Ladataan...</FormText>}
              {!isFetching && !tenants.length && <FormText>-</FormText>}
              {!isFetching && !!tenants.length &&
                <ListItems>
                  {tenants.map((tenant) =>
                    <ListItem key={tenant.id}>
                      <ExternalLink
                        className='no-margin'
                        href={`${getRouteById('contacts')}/${get(tenant, 'tenant.contact.id')}`}
                        text={getContactFullName(get(tenant, 'tenant.contact'))}
                      />
                    </ListItem>
                  )}
                </ListItems>
              }
            </Column>
            <Column small={6} medium={4} large={2}>
              <FormTextTitle title='Kiinteistö' />
              {isFetching && <FormText>Ladataan...</FormText>}
              {!isFetching && !plots.length && <FormText>-</FormText>}
              {!isFetching && !!plots.length &&
                <ListItems>
                  {plots.map((plot, index) =>
                    <ListItem key={index}>{plot.identifier || '-'}</ListItem>
                  )}
                </ListItems>
              }
            </Column>
            <Column small={6} medium={4} large={2}>
              <FormTextTitle title='Kaavayksikkö' />
              {isFetching && <FormText>Ladataan...</FormText>}
              {!isFetching && !planUnits.length && <FormText>-</FormText>}
              {!isFetching && !!planUnits.length &&
                <ListItems>
                  {planUnits.map((planUnit, index) =>
                    <ListItem key={index}>{planUnit.identifier || '-'}</ListItem>
                  )}
                </ListItems>
              }
            </Column>
            <Column small={6} medium={4} large={2}>
              {isFetching && <FormText>Ladataan...</FormText>}
              {!isFetching && !leaseId && <FormText>-</FormText>}
              {!isFetching && leaseId &&
                <ExternalLink
                  href={`${getRouteById('leases')}/${leaseId}?tab=7`}
                  text='Karttalinkki'
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
              <FormTitleAndText
                title='Korvaus yhteensä'
                text={`${formatNumber(totalCompensation)} €`}
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
                            <FormTextTitle title='Nimi' />
                          </Column>
                          <Column small={3} large={2}>
                            <FormTextTitle title='Pvm' />
                          </Column>
                          <Column small={3} large={2}>
                            <FormTextTitle title='Lataaja' />
                          </Column>
                        </Row>
                        {attachments.map((file, index) => {
                          const handleRemove = () => {
                            dispatch({
                              type: ActionTypes.SHOW_CONFIRMATION_MODAL,
                              confirmationFunction: () => {
                                this.handleDeleteInfillDevelopmentFile(file.id);
                              },
                              confirmationModalButtonText: 'Poista',
                              confirmationModalLabel: DeleteModalLabels.ATTACHMENT,
                              confirmationModalTitle: DeleteModalTitles.ATTACHMENT,
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
                                <FormText>{formatDate(file.uploaded_at) || '-'}</FormText>
                              </Column>
                              <Column small={3} large={2}>
                                <FormText>{getUserFullName((file.uploader)) || '-'}</FormText>
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
      deleteInfillDevelopmentFile,
      fetchLeaseById,
      receiveCollapseStates,
      uploadInfillDevelopmentFile,
    }
  )
)(LeaseItemEdit);
