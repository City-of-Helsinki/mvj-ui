import React, { Fragment, PureComponent } from "react";
import { connect } from "react-redux";
import { FieldArray, formValueSelector } from "redux-form";
import { Row, Column } from "react-foundation";
import isEmpty from "lodash/isEmpty";
import flowRight from "lodash/flowRight";
import get from "lodash/get";
import type { Element } from "react";
import { ActionTypes, AppConsumer } from "src/app/AppContext";
import AddButtonThird from "src/components/form/AddButtonThird";
import AddFileButton from "src/components/form/AddFileButton";
import Authorization from "src/components/authorization/Authorization";
import BoxContentWrapper from "src/components/content/BoxContentWrapper";
import Collapse from "src/components/collapse/Collapse";
import ExternalLink from "src/components/links/ExternalLink";
import FileDownloadLink from "src/components/file/FileDownloadLink";
import FormField from "src/components/form/FormField";
import FormText from "src/components/form/FormText";
import FormTextTitle from "src/components/form/FormTextTitle";
import ListItem from "src/components/content/ListItem";
import ListItems from "src/components/content/ListItems";
import RemoveButton from "src/components/form/RemoveButton";
import SubTitle from "src/components/content/SubTitle";
import { receiveCollapseStates } from "src/infillDevelopment/actions";
import { createInfillDevelopmentAttachment, deleteInfillDevelopmentAttachment } from "src/infillDevelopmentAttachment/actions";
import { fetchLeaseById } from "src/leases/actions";
import { ConfirmationModalTexts, FieldTypes, FormNames, Methods, ViewModes } from "src/enums";
import { ButtonColors } from "src/components/enums";
import { InfillDevelopmentCompensationLeasesFieldPaths, InfillDevelopmentCompensationLeasesFieldTitles, InfillDevelopmentCompensationLeaseDecisionsFieldPaths, InfillDevelopmentCompensationLeaseDecisionsFieldTitles, InfillDevelopmentCompensationLeaseIntendedUsesFieldPaths, InfillDevelopmentCompensationLeaseIntendedUsesFieldTitles } from "src/infillDevelopment/enums";
import { InfillDevelopmentCompensationAttachmentFieldPaths, InfillDevelopmentCompensationAttachmentFieldTitles } from "src/infillDevelopmentAttachment/enums";
import { LeasePlanUnitsFieldPaths, LeasePlotsFieldPaths, LeaseTenantsFieldPaths } from "src/leases/enums";
import { UsersPermissions } from "src/usersPermissions/enums";
import { getUiDataInfillDevelopmentKey, getUiDataInfillDevelopmentAttachmentKey } from "src/uiData/helpers";
import { convertStrToDecimalNumber, formatDate, formatNumber, getFieldAttributes, hasPermissions, isActive, isFieldAllowedToRead, isFieldRequired, isMethodAllowed } from "src/util/helpers";
import { getContactFullName } from "src/contacts/helpers";
import { getContentLeaseAreas, getContentLeaseIdentifier, getContentTenants } from "src/leases/helpers";
import { getUserFullName } from "src/users/helpers";
import { getRouteById, Routes } from "src/root/routes";
import { getAttributes as getInfillDevelopmentAttributes, getCollapseStateByKey } from "src/infillDevelopment/selectors";
import { getAttributes as getInfillDevelopmentAttachmentAttributes, getMethods as getInfillDevelopmentAttachmentMethods } from "src/infillDevelopmentAttachment/selectors";
import { getAttributes as getLeaseAttributes, getIsFetchingById, getLeaseById } from "src/leases/selectors";
import { getUsersPermissions } from "src/usersPermissions/selectors";
import { referenceNumber } from "src/components/form/validations";
import { getUserActiveServiceUnit } from "src/usersPermissions/selectors";
import type { Attributes, Methods as MethodsType } from "src/types";
import type { Lease, LeaseId } from "src/leases/types";
import type { UsersPermissions as UsersPermissionsType, UserServiceUnit } from "src/usersPermissions/types";
type DecisionsProps = {
  fields: any;
  infillDevelopmentAttributes: Attributes;
  isSaveClicked: boolean;
  usersPermissions: UsersPermissionsType;
};

const renderDecisions = ({
  fields,
  infillDevelopmentAttributes,
  isSaveClicked,
  usersPermissions
}: DecisionsProps): Element<any> => {
  const handleAdd = () => {
    fields.push({});
  };

  return <AppConsumer>
      {({
      dispatch
    }) => {
      return <Fragment>
            <SubTitle enableUiDataEdit uiDataKey={getUiDataInfillDevelopmentKey(InfillDevelopmentCompensationLeaseDecisionsFieldPaths.DECISIONS)}>
              {InfillDevelopmentCompensationLeaseDecisionsFieldTitles.DECISIONS}
            </SubTitle>

            {!hasPermissions(usersPermissions, UsersPermissions.ADD_INFILLDEVELOPMENTCOMPENSATIONDECISION) && (!fields || !fields.length) && <FormText>Ei päätöksiä</FormText>}
            {!!fields && !!fields.length && <Fragment>
                <Row>
                  <Column small={3} large={2}>
                    <Authorization allow={isFieldAllowedToRead(infillDevelopmentAttributes, InfillDevelopmentCompensationLeaseDecisionsFieldPaths.DECISION_MAKER)}>
                      <FormTextTitle required={isFieldRequired(infillDevelopmentAttributes, InfillDevelopmentCompensationLeaseDecisionsFieldPaths.DECISION_MAKER)} enableUiDataEdit uiDataKey={getUiDataInfillDevelopmentKey(InfillDevelopmentCompensationLeaseDecisionsFieldPaths.DECISION_MAKER)}>
                        {InfillDevelopmentCompensationLeaseDecisionsFieldTitles.DECISION_MAKER}
                      </FormTextTitle>
                    </Authorization>
                  </Column>
                  <Column small={3} large={2}>
                    <Authorization allow={isFieldAllowedToRead(infillDevelopmentAttributes, InfillDevelopmentCompensationLeaseDecisionsFieldPaths.DECISION_DATE)}>
                      <FormTextTitle required={isFieldRequired(infillDevelopmentAttributes, InfillDevelopmentCompensationLeaseDecisionsFieldPaths.DECISION_DATE)} enableUiDataEdit uiDataKey={getUiDataInfillDevelopmentKey(InfillDevelopmentCompensationLeaseDecisionsFieldPaths.DECISION_DATE)}>
                        {InfillDevelopmentCompensationLeaseDecisionsFieldTitles.DECISION_DATE}
                      </FormTextTitle>
                    </Authorization>
                  </Column>
                  <Column small={3} large={2}>
                    <Authorization allow={isFieldAllowedToRead(infillDevelopmentAttributes, InfillDevelopmentCompensationLeaseDecisionsFieldPaths.SECTION)}>
                      <FormTextTitle required={isFieldRequired(infillDevelopmentAttributes, InfillDevelopmentCompensationLeaseDecisionsFieldPaths.SECTION)} enableUiDataEdit tooltipStyle={{
                  right: 12
                }} uiDataKey={getUiDataInfillDevelopmentKey(InfillDevelopmentCompensationLeaseDecisionsFieldPaths.SECTION)}>
                        {InfillDevelopmentCompensationLeaseDecisionsFieldTitles.SECTION}
                      </FormTextTitle>
                    </Authorization>
                  </Column>
                  <Column small={3} large={2}>
                    <Authorization allow={isFieldAllowedToRead(infillDevelopmentAttributes, InfillDevelopmentCompensationLeaseDecisionsFieldPaths.REFERENCE_NUMBER)}>
                      <FormTextTitle required={isFieldRequired(infillDevelopmentAttributes, InfillDevelopmentCompensationLeaseDecisionsFieldPaths.REFERENCE_NUMBER)} enableUiDataEdit uiDataKey={getUiDataInfillDevelopmentKey(InfillDevelopmentCompensationLeaseDecisionsFieldPaths.REFERENCE_NUMBER)}>
                        {InfillDevelopmentCompensationLeaseDecisionsFieldTitles.REFERENCE_NUMBER}
                      </FormTextTitle>
                    </Authorization>
                  </Column>
                </Row>
                {fields.map((field, index) => {
            const handleRemove = () => {
              dispatch({
                type: ActionTypes.SHOW_CONFIRMATION_MODAL,
                confirmationFunction: () => {
                  fields.remove(index);
                },
                confirmationModalButtonClassName: ButtonColors.ALERT,
                confirmationModalButtonText: ConfirmationModalTexts.DELETE_DECISION.BUTTON,
                confirmationModalLabel: ConfirmationModalTexts.DELETE_DECISION.LABEL,
                confirmationModalTitle: ConfirmationModalTexts.DELETE_DECISION.TITLE
              });
            };

            return <Row key={index}>
                      <Column small={3} large={2}>
                        <Authorization allow={isFieldAllowedToRead(infillDevelopmentAttributes, InfillDevelopmentCompensationLeaseDecisionsFieldPaths.DECISION_MAKER)}>
                          <FormField disableTouched={isSaveClicked} fieldAttributes={getFieldAttributes(infillDevelopmentAttributes, InfillDevelopmentCompensationLeaseDecisionsFieldPaths.DECISION_MAKER)} invisibleLabel name={`${field}.decision_maker`} overrideValues={{
                    label: InfillDevelopmentCompensationLeaseDecisionsFieldTitles.DECISION_MAKER
                  }} />
                        </Authorization>
                      </Column>
                      <Column small={3} large={2}>
                        <Authorization allow={isFieldAllowedToRead(infillDevelopmentAttributes, InfillDevelopmentCompensationLeaseDecisionsFieldPaths.DECISION_DATE)}>
                          <FormField disableTouched={isSaveClicked} fieldAttributes={getFieldAttributes(infillDevelopmentAttributes, InfillDevelopmentCompensationLeaseDecisionsFieldPaths.DECISION_DATE)} invisibleLabel name={`${field}.decision_date`} overrideValues={{
                    label: InfillDevelopmentCompensationLeaseDecisionsFieldTitles.DECISION_DATE
                  }} />
                        </Authorization>
                      </Column>
                      <Column small={3} large={2}>
                        <Authorization allow={isFieldAllowedToRead(infillDevelopmentAttributes, InfillDevelopmentCompensationLeaseDecisionsFieldPaths.SECTION)}>
                          <FormField disableTouched={isSaveClicked} fieldAttributes={getFieldAttributes(infillDevelopmentAttributes, InfillDevelopmentCompensationLeaseDecisionsFieldPaths.SECTION)} invisibleLabel name={`${field}.section`} unit='§' overrideValues={{
                    label: InfillDevelopmentCompensationLeaseDecisionsFieldTitles.SECTION
                  }} />
                        </Authorization>
                      </Column>
                      <Column small={3} large={2}>
                        <Authorization allow={isFieldAllowedToRead(infillDevelopmentAttributes, InfillDevelopmentCompensationLeaseDecisionsFieldPaths.REFERENCE_NUMBER)}>
                          <FormField disableTouched={isSaveClicked} fieldAttributes={getFieldAttributes(infillDevelopmentAttributes, InfillDevelopmentCompensationLeaseDecisionsFieldPaths.REFERENCE_NUMBER)} invisibleLabel name={`${field}.reference_number`} validate={referenceNumber} overrideValues={{
                    label: InfillDevelopmentCompensationLeaseDecisionsFieldTitles.REFERENCE_NUMBER,
                    fieldType: FieldTypes.REFERENCE_NUMBER
                  }} />
                        </Authorization>
                      </Column>
                      <Column small={3} large={2}>
                        <Authorization allow={hasPermissions(usersPermissions, UsersPermissions.DELETE_INFILLDEVELOPMENTCOMPENSATIONDECISION)}>
                          <RemoveButton className='third-level' onClick={handleRemove} title="Poista päätös" />
                        </Authorization>
                      </Column>
                    </Row>;
          })}
              </Fragment>}

            <Authorization allow={hasPermissions(usersPermissions, UsersPermissions.ADD_INFILLDEVELOPMENTCOMPENSATIONDECISION)}>
              <Row>
                <Column>
                  <AddButtonThird label='Lisää päätös' onClick={handleAdd} />
                </Column>
              </Row>
            </Authorization>
          </Fragment>;
    }}
    </AppConsumer>;
};

type IntendedUsesProps = {
  fields: any;
  infillDevelopmentAttributes: Attributes;
  isSaveClicked: boolean;
  usersPermissions: UsersPermissionsType;
};

const renderIntendedUses = ({
  fields,
  infillDevelopmentAttributes,
  isSaveClicked,
  usersPermissions
}: IntendedUsesProps): Element<any> => {
  const handleAdd = () => fields.push({});

  return <AppConsumer>
      {({
      dispatch
    }) => {
      return <Fragment>
            <SubTitle enableUiDataEdit uiDataKey={getUiDataInfillDevelopmentKey(InfillDevelopmentCompensationLeaseIntendedUsesFieldPaths.INTENDED_USES)}>
              {InfillDevelopmentCompensationLeaseIntendedUsesFieldTitles.INTENDED_USES}
            </SubTitle>

            {!hasPermissions(usersPermissions, UsersPermissions.ADD_INFILLDEVELOPMENTCOMPENSATIONINTENDEDUSE) && (!fields || !fields.length) && <FormText>Ei käyttötarkoituksia</FormText>}
            {!!fields && !!fields.length && <Fragment>
                <Row>
                  <Column small={3} large={2}>
                    <Authorization allow={isFieldAllowedToRead(infillDevelopmentAttributes, InfillDevelopmentCompensationLeaseIntendedUsesFieldPaths.INTENDED_USE)}>
                      <FormTextTitle required={isFieldRequired(infillDevelopmentAttributes, InfillDevelopmentCompensationLeaseIntendedUsesFieldPaths.INTENDED_USE)} enableUiDataEdit uiDataKey={getUiDataInfillDevelopmentKey(InfillDevelopmentCompensationLeaseIntendedUsesFieldPaths.INTENDED_USE)}>
                        {InfillDevelopmentCompensationLeaseIntendedUsesFieldTitles.INTENDED_USE}
                      </FormTextTitle>
                    </Authorization>
                  </Column>
                  <Column small={3} large={2}>
                    <Authorization allow={isFieldAllowedToRead(infillDevelopmentAttributes, InfillDevelopmentCompensationLeaseIntendedUsesFieldPaths.FLOOR_M2)}>
                      <FormTextTitle required={isFieldRequired(infillDevelopmentAttributes, InfillDevelopmentCompensationLeaseIntendedUsesFieldPaths.FLOOR_M2)} enableUiDataEdit tooltipStyle={{
                  right: 32
                }} uiDataKey={getUiDataInfillDevelopmentKey(InfillDevelopmentCompensationLeaseIntendedUsesFieldPaths.FLOOR_M2)}>
                        {InfillDevelopmentCompensationLeaseIntendedUsesFieldTitles.FLOOR_M2}
                      </FormTextTitle>
                    </Authorization>
                  </Column>
                  <Column small={3} large={2}>
                    <Authorization allow={isFieldAllowedToRead(infillDevelopmentAttributes, InfillDevelopmentCompensationLeaseIntendedUsesFieldPaths.AMOUNT_PER_FLOOR_M2)}>
                      <FormTextTitle required={isFieldRequired(infillDevelopmentAttributes, InfillDevelopmentCompensationLeaseIntendedUsesFieldPaths.AMOUNT_PER_FLOOR_M2)} enableUiDataEdit tooltipStyle={{
                  right: 44
                }} uiDataKey={getUiDataInfillDevelopmentKey(InfillDevelopmentCompensationLeaseIntendedUsesFieldPaths.AMOUNT_PER_FLOOR_M2)}>
                        {InfillDevelopmentCompensationLeaseIntendedUsesFieldTitles.AMOUNT_PER_FLOOR_M2}
                      </FormTextTitle>
                    </Authorization>
                  </Column>
                </Row>
                {fields.map((field, index) => {
            const handleRemove = () => {
              dispatch({
                type: ActionTypes.SHOW_CONFIRMATION_MODAL,
                confirmationFunction: () => {
                  fields.remove(index);
                },
                confirmationModalButtonClassName: ButtonColors.ALERT,
                confirmationModalButtonText: ConfirmationModalTexts.DELETE_INTENDED_USE.BUTTON,
                confirmationModalLabel: ConfirmationModalTexts.DELETE_INTENDED_USE.LABEL,
                confirmationModalTitle: ConfirmationModalTexts.DELETE_INTENDED_USE.TITLE
              });
            };

            return <Row key={index}>
                      <Column small={3} large={2}>
                        <Authorization allow={isFieldAllowedToRead(infillDevelopmentAttributes, InfillDevelopmentCompensationLeaseIntendedUsesFieldPaths.INTENDED_USE)}>
                          <FormField disableTouched={isSaveClicked} fieldAttributes={getFieldAttributes(infillDevelopmentAttributes, InfillDevelopmentCompensationLeaseIntendedUsesFieldPaths.INTENDED_USE)} invisibleLabel name={`${field}.intended_use`} overrideValues={{
                    label: InfillDevelopmentCompensationLeaseIntendedUsesFieldTitles.INTENDED_USE
                  }} />
                        </Authorization>
                      </Column>
                      <Column small={3} large={2}>
                        <Authorization allow={isFieldAllowedToRead(infillDevelopmentAttributes, InfillDevelopmentCompensationLeaseIntendedUsesFieldPaths.FLOOR_M2)}>
                          <FormField disableTouched={isSaveClicked} fieldAttributes={getFieldAttributes(infillDevelopmentAttributes, InfillDevelopmentCompensationLeaseIntendedUsesFieldPaths.FLOOR_M2)} invisibleLabel name={`${field}.floor_m2`} unit='k-m²' overrideValues={{
                    label: InfillDevelopmentCompensationLeaseIntendedUsesFieldTitles.FLOOR_M2
                  }} />
                        </Authorization>
                      </Column>
                      <Column small={3} large={2}>
                        <Authorization allow={isFieldAllowedToRead(infillDevelopmentAttributes, InfillDevelopmentCompensationLeaseIntendedUsesFieldPaths.AMOUNT_PER_FLOOR_M2)}>
                          <FormField disableTouched={isSaveClicked} fieldAttributes={getFieldAttributes(infillDevelopmentAttributes, InfillDevelopmentCompensationLeaseIntendedUsesFieldPaths.AMOUNT_PER_FLOOR_M2)} invisibleLabel name={`${field}.amount_per_floor_m2`} unit='€/k-m²' overrideValues={{
                    label: InfillDevelopmentCompensationLeaseIntendedUsesFieldTitles.AMOUNT_PER_FLOOR_M2
                  }} />
                        </Authorization>
                      </Column>
                      <Column small={3} large={2}>
                        <Authorization allow={hasPermissions(usersPermissions, UsersPermissions.DELETE_INFILLDEVELOPMENTCOMPENSATIONINTENDEDUSE)}>
                          <RemoveButton className='third-level' onClick={handleRemove} title="Poista käyttötarkoitus" />
                        </Authorization>
                      </Column>
                    </Row>;
          })}
              </Fragment>}

            <Authorization allow={hasPermissions(usersPermissions, UsersPermissions.ADD_INFILLDEVELOPMENTCOMPENSATIONINTENDEDUSE)}>
              <Row>
                <Column>
                  <AddButtonThird label='Lisää käyttötarkoitus' onClick={handleAdd} />
                </Column>
              </Row>
            </Authorization>
          </Fragment>;
    }}
    </AppConsumer>;
};

type Props = {
  collapseState: boolean;
  compensationInvestment: number | null | undefined;
  createInfillDevelopmentAttachment: (...args: Array<any>) => any;
  deleteInfillDevelopmentAttachment: (...args: Array<any>) => any;
  fetchLeaseById: (...args: Array<any>) => any;
  field: string;
  infillDevelopmentAttachmentAttributes: Attributes;
  infillDevelopmentAttachmentMethods: MethodsType;
  infillDevelopmentAttributes: Attributes;
  isFetching: boolean;
  isSaveClicked: boolean;
  lease: Lease;
  leaseAttributes: Attributes;
  leaseId: LeaseId;
  infillDevelopment: Record<string, any>;
  infillDevelopmentCompensationLeaseId: number;
  leaseFieldValue: Record<string, any>;
  monetaryCompensation: number | null | undefined;
  onRemove: (...args: Array<any>) => any;
  receiveCollapseStates: (...args: Array<any>) => any;
  userActiveServiceUnit: UserServiceUnit;
  usersPermissions: UsersPermissionsType;
};
type State = {
  identifier: string | null | undefined;
  lease: Lease;
  planUnits: Array<Record<string, any>>;
  plots: Array<Record<string, any>>;
  tenants: Array<Record<string, any>>;
};

class LeaseItemEdit extends PureComponent<Props, State> {
  state = {
    identifier: null,
    lease: {},
    planUnits: [],
    plots: [],
    tenants: []
  };

  componentDidMount() {
    const {
      fetchLeaseById,
      leaseFieldValue,
      lease
    } = this.props;

    if (isEmpty(lease) && !isEmpty(leaseFieldValue)) {
      fetchLeaseById(leaseFieldValue.value);
    }
  }

  static getDerivedStateFromProps(props: Props, state: State) {
    const newState = {};

    if (props.lease !== state.lease) {
      const leaseAreas = getContentLeaseAreas(props.lease).filter(area => !area.archived_at);
      const planUnits = [];
      const plots = [];
      leaseAreas.forEach(area => {
        planUnits.push(...get(area, 'plan_units_current', []));
      });
      leaseAreas.forEach(area => {
        plots.push(...get(area, 'plots_current', []));
      });
      newState.lease = props.lease;
      newState.identifier = getContentLeaseIdentifier(props.lease);
      newState.planUnits = planUnits;
      newState.plots = plots;
      newState.tenants = getContentTenants(props.lease).filter(tenant => isActive(get(tenant, 'tenant')));
    }

    return newState;
  }

  componentDidUpdate(prevProps) {
    if (prevProps.leaseFieldValue !== this.props.leaseFieldValue) {
      const {
        fetchLeaseById,
        lease,
        leaseFieldValue
      } = this.props;

      if (isEmpty(lease) && !isEmpty(leaseFieldValue)) {
        fetchLeaseById(leaseFieldValue.value);
      }
    }
  }

  getTotalCompensation = () => {
    const {
      compensationInvestment,
      monetaryCompensation
    } = this.props;
    const formatedCompensationInvestment = convertStrToDecimalNumber(compensationInvestment);
    const formatedMonetaryCompensation = convertStrToDecimalNumber(monetaryCompensation);
    return (formatedCompensationInvestment && !isNaN(formatedCompensationInvestment) ? formatedCompensationInvestment : 0) + (formatedMonetaryCompensation && !isNaN(formatedMonetaryCompensation) ? formatedMonetaryCompensation : 0);
  };
  handleFileChange = e => {
    const {
      createInfillDevelopmentAttachment,
      infillDevelopment,
      infillDevelopmentCompensationLeaseId
    } = this.props;
    createInfillDevelopmentAttachment({
      id: infillDevelopment.id,
      data: {
        infill_development_compensation_lease: infillDevelopmentCompensationLeaseId
      },
      file: e.target.files[0]
    });
  };
  handleDeleteInfillDevelopmentFile = (fileId: number) => {
    const {
      deleteInfillDevelopmentAttachment,
      infillDevelopment
    } = this.props;
    deleteInfillDevelopmentAttachment({
      id: infillDevelopment.id,
      fileId
    });
  };
  handleCollapseToggle = (val: boolean) => {
    const {
      infillDevelopmentCompensationLeaseId,
      receiveCollapseStates
    } = this.props;

    if (!infillDevelopmentCompensationLeaseId) {
      return;
    }

    receiveCollapseStates({
      [ViewModes.EDIT]: {
        [FormNames.INFILL_DEVELOPMENT]: {
          [infillDevelopmentCompensationLeaseId]: val
        }
      }
    });
  };

  render() {
    const {
      collapseState,
      field,
      infillDevelopment,
      infillDevelopmentAttachmentAttributes,
      infillDevelopmentAttachmentMethods,
      infillDevelopmentAttributes,
      infillDevelopmentCompensationLeaseId,
      isFetching,
      isSaveClicked,
      leaseAttributes,
      leaseId,
      onRemove,
      userActiveServiceUnit,
      usersPermissions
    } = this.props;
    const {
      identifier,
      planUnits,
      plots,
      tenants
    } = this.state;
    const attachments = get(infillDevelopment, `${field}.attachments`, []);
    const totalCompensation = this.getTotalCompensation();
    return <Collapse className='collapse__secondary' defaultOpen={collapseState !== undefined ? collapseState : true} headerTitle={isFetching ? 'Ladataan...' : identifier || '-'} onRemove={hasPermissions(usersPermissions, UsersPermissions.DELETE_INFILLDEVELOPMENTCOMPENSATIONLEASE) ? onRemove : null} onToggle={this.handleCollapseToggle}>
        <BoxContentWrapper>
          <Row>
            <Column small={6} medium={4} large={2}>
              <Authorization allow={isFieldAllowedToRead(infillDevelopmentAttributes, InfillDevelopmentCompensationLeasesFieldPaths.LEASE)}>
                <FormField disableTouched={isSaveClicked} fieldAttributes={getFieldAttributes(infillDevelopmentAttributes, InfillDevelopmentCompensationLeasesFieldPaths.LEASE)} name={`${field}.lease`} overrideValues={{
                fieldType: FieldTypes.LEASE,
                label: InfillDevelopmentCompensationLeasesFieldTitles.LEASE
              }} serviceUnit={userActiveServiceUnit} enableUiDataEdit uiDataKey={getUiDataInfillDevelopmentKey(InfillDevelopmentCompensationLeasesFieldPaths.LEASE)} />
              </Authorization>
            </Column>
            <Column small={6} medium={4} large={2}>
              <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseTenantsFieldPaths.TENANTS)}>
                <FormTextTitle enableUiDataEdit uiDataKey={getUiDataInfillDevelopmentKey(LeaseTenantsFieldPaths.TENANTS)}>
                  Vuokralainen
                </FormTextTitle>

                {isFetching && <FormText>Ladataan...</FormText>}
                {!isFetching && !tenants.length && <FormText>-</FormText>}
                {!isFetching && !!tenants.length && <ListItems>
                    {tenants.map(tenant => <ListItem key={tenant.id}>
                        <ExternalLink className='no-margin' href={`${getRouteById(Routes.CONTACTS)}/${get(tenant, 'tenant.contact.id')}`} text={getContactFullName(get(tenant, 'tenant.contact'))} />
                      </ListItem>)}
                  </ListItems>}
              </Authorization>
            </Column>
            <Column small={6} medium={4} large={2}>
              <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeasePlotsFieldPaths.PLOTS)}>
                <FormTextTitle enableUiDataEdit uiDataKey={getUiDataInfillDevelopmentKey(LeasePlotsFieldPaths.PLOTS)}>
                  Kiinteistö
                </FormTextTitle>

                {isFetching && <FormText>Ladataan...</FormText>}
                {!isFetching && !plots.length && <FormText>-</FormText>}
                {!isFetching && !!plots.length && <ListItems>
                    {plots.map((plot, index) => <ListItem key={index}>{plot.identifier || '-'}</ListItem>)}
                  </ListItems>}
              </Authorization>
            </Column>
            <Column small={6} medium={4} large={2}>
              <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeasePlanUnitsFieldPaths.PLAN_UNITS)}>
                <FormTextTitle enableUiDataEdit uiDataKey={getUiDataInfillDevelopmentKey(LeasePlanUnitsFieldPaths.PLAN_UNITS)}>
                  Kaavayksikkö
                </FormTextTitle>

                {isFetching && <FormText>Ladataan...</FormText>}
                {!isFetching && !planUnits.length && <FormText>-</FormText>}
                {!isFetching && !!planUnits.length && <ListItems>
                    {planUnits.map((planUnit, index) => <ListItem key={index}>{planUnit.identifier || '-'}</ListItem>)}
                  </ListItems>}
              </Authorization>
            </Column>
            <Column small={6} medium={4} large={2}>
              <Authorization allow={isFieldAllowedToRead(infillDevelopmentAttributes, InfillDevelopmentCompensationLeasesFieldPaths.LEASE)}>
                {isFetching && <FormText>Ladataan...</FormText>}
                {!isFetching && !leaseId && <FormText>-</FormText>}
                {!isFetching && leaseId && <ExternalLink href={`${getRouteById(Routes.LEASES)}/${leaseId}?tab=7`} text='Karttalinkki' />}
              </Authorization>
            </Column>
          </Row>

          <Authorization allow={isFieldAllowedToRead(infillDevelopmentAttributes, InfillDevelopmentCompensationLeaseDecisionsFieldPaths.DECISIONS)}>
            <FieldArray component={renderDecisions} infillDevelopmentAttributes={infillDevelopmentAttributes} isSaveClicked={isSaveClicked} name={`${field}.decisions`} usersPermissions={usersPermissions} />
          </Authorization>

          <Authorization allow={isFieldAllowedToRead(infillDevelopmentAttributes, InfillDevelopmentCompensationLeaseIntendedUsesFieldPaths.INTENDED_USES)}>
            <FieldArray component={renderIntendedUses} infillDevelopmentAttributes={infillDevelopmentAttributes} isSaveClicked={isSaveClicked} name={`${field}.intended_uses`} usersPermissions={usersPermissions} />
          </Authorization>

          <Row>
            <Column small={6} medium={4} large={2}>
              <Authorization allow={isFieldAllowedToRead(infillDevelopmentAttributes, InfillDevelopmentCompensationLeasesFieldPaths.MONETARY_COMPENSATION_AMOUNT)}>
                <FormField disableTouched={isSaveClicked} fieldAttributes={getFieldAttributes(infillDevelopmentAttributes, InfillDevelopmentCompensationLeasesFieldPaths.MONETARY_COMPENSATION_AMOUNT)} name={`${field}.monetary_compensation_amount`} unit='€' overrideValues={{
                label: InfillDevelopmentCompensationLeasesFieldTitles.MONETARY_COMPENSATION_AMOUNT
              }} enableUiDataEdit tooltipStyle={{
                right: 12
              }} uiDataKey={getUiDataInfillDevelopmentKey(InfillDevelopmentCompensationLeasesFieldPaths.MONETARY_COMPENSATION_AMOUNT)} />
              </Authorization>
            </Column>
            <Column small={6} medium={4} large={2}>
              <Authorization allow={isFieldAllowedToRead(infillDevelopmentAttributes, InfillDevelopmentCompensationLeasesFieldPaths.COMPENSATION_INVESTMENT_AMOUNT)}>
                <FormField disableTouched={isSaveClicked} fieldAttributes={getFieldAttributes(infillDevelopmentAttributes, InfillDevelopmentCompensationLeasesFieldPaths.COMPENSATION_INVESTMENT_AMOUNT)} name={`${field}.compensation_investment_amount`} unit='€' overrideValues={{
                label: InfillDevelopmentCompensationLeasesFieldTitles.COMPENSATION_INVESTMENT_AMOUNT
              }} enableUiDataEdit tooltipStyle={{
                right: 12
              }} uiDataKey={getUiDataInfillDevelopmentKey(InfillDevelopmentCompensationLeasesFieldPaths.COMPENSATION_INVESTMENT_AMOUNT)} />
              </Authorization>
            </Column>
            <Column small={6} medium={4} large={2}>
              <Authorization allow={isFieldAllowedToRead(infillDevelopmentAttributes, InfillDevelopmentCompensationLeasesFieldPaths.MONETARY_COMPENSATION_AMOUNT) || isFieldAllowedToRead(infillDevelopmentAttributes, InfillDevelopmentCompensationLeasesFieldPaths.COMPENSATION_INVESTMENT_AMOUNT)}>
                <FormTextTitle enableUiDataEdit uiDataKey={getUiDataInfillDevelopmentKey(InfillDevelopmentCompensationLeasesFieldPaths.TOTAL_COMPENSATION)}>
                  {InfillDevelopmentCompensationLeasesFieldTitles.TOTAL_COMPENSATION}
                </FormTextTitle>
                <FormText>{`${formatNumber(totalCompensation)} €`}</FormText>
              </Authorization>
            </Column>
            <Column small={6} medium={4} large={2}>
              <Authorization allow={isFieldAllowedToRead(infillDevelopmentAttributes, InfillDevelopmentCompensationLeasesFieldPaths.INCREASE_IN_VALUE)}>
                <FormField disableTouched={isSaveClicked} fieldAttributes={getFieldAttributes(infillDevelopmentAttributes, InfillDevelopmentCompensationLeasesFieldPaths.INCREASE_IN_VALUE)} name={`${field}.increase_in_value`} unit='€' overrideValues={{
                label: InfillDevelopmentCompensationLeasesFieldTitles.INCREASE_IN_VALUE
              }} enableUiDataEdit tooltipStyle={{
                right: 12
              }} uiDataKey={getUiDataInfillDevelopmentKey(InfillDevelopmentCompensationLeasesFieldPaths.INCREASE_IN_VALUE)} />
              </Authorization>
            </Column>
            <Column small={6} medium={4} large={2}>
              <Authorization allow={isFieldAllowedToRead(infillDevelopmentAttributes, InfillDevelopmentCompensationLeasesFieldPaths.PART_OF_THE_INCREASE_IN_VALUE)}>
                <FormField disableTouched={isSaveClicked} fieldAttributes={getFieldAttributes(infillDevelopmentAttributes, InfillDevelopmentCompensationLeasesFieldPaths.PART_OF_THE_INCREASE_IN_VALUE)} name={`${field}.part_of_the_increase_in_value`} unit='€' overrideValues={{
                label: InfillDevelopmentCompensationLeasesFieldTitles.PART_OF_THE_INCREASE_IN_VALUE
              }} enableUiDataEdit tooltipStyle={{
                right: 12
              }} uiDataKey={getUiDataInfillDevelopmentKey(InfillDevelopmentCompensationLeasesFieldPaths.PART_OF_THE_INCREASE_IN_VALUE)} />
              </Authorization>
            </Column>
            <Column small={6} medium={4} large={2}>
              <Authorization allow={isFieldAllowedToRead(infillDevelopmentAttributes, InfillDevelopmentCompensationLeasesFieldPaths.DISCOUNT_IN_RENT)}>
                <FormField disableTouched={isSaveClicked} fieldAttributes={getFieldAttributes(infillDevelopmentAttributes, InfillDevelopmentCompensationLeasesFieldPaths.DISCOUNT_IN_RENT)} name={`${field}.discount_in_rent`} unit='€' overrideValues={{
                label: InfillDevelopmentCompensationLeasesFieldTitles.DISCOUNT_IN_RENT
              }} enableUiDataEdit tooltipStyle={{
                right: 12
              }} uiDataKey={getUiDataInfillDevelopmentKey(InfillDevelopmentCompensationLeasesFieldPaths.DISCOUNT_IN_RENT)} />
              </Authorization>
            </Column>
          </Row>
          <Row>
            <Column small={6} medium={4} large={2}>
              <Authorization allow={isFieldAllowedToRead(infillDevelopmentAttributes, InfillDevelopmentCompensationLeasesFieldPaths.YEAR)}>
                <FormField disableTouched={isSaveClicked} fieldAttributes={getFieldAttributes(infillDevelopmentAttributes, InfillDevelopmentCompensationLeasesFieldPaths.YEAR)} name={`${field}.year`} overrideValues={{
                label: InfillDevelopmentCompensationLeasesFieldTitles.YEAR
              }} enableUiDataEdit uiDataKey={getUiDataInfillDevelopmentKey(InfillDevelopmentCompensationLeasesFieldPaths.YEAR)} />
              </Authorization>
            </Column>
            <Column small={6} medium={4} large={2}>
              <Authorization allow={isFieldAllowedToRead(infillDevelopmentAttributes, InfillDevelopmentCompensationLeasesFieldPaths.SENT_TO_SAP_DATE)}>
                <FormField disableTouched={isSaveClicked} fieldAttributes={getFieldAttributes(infillDevelopmentAttributes, InfillDevelopmentCompensationLeasesFieldPaths.SENT_TO_SAP_DATE)} name={`${field}.sent_to_sap_date`} overrideValues={{
                label: InfillDevelopmentCompensationLeasesFieldTitles.SENT_TO_SAP_DATE
              }} enableUiDataEdit uiDataKey={getUiDataInfillDevelopmentKey(InfillDevelopmentCompensationLeasesFieldPaths.SENT_TO_SAP_DATE)} />
              </Authorization>
            </Column>
            <Column small={6} medium={4} large={2}>
              <Authorization allow={isFieldAllowedToRead(infillDevelopmentAttributes, InfillDevelopmentCompensationLeasesFieldPaths.PAID_DATE)}>
                <FormField disableTouched={isSaveClicked} fieldAttributes={getFieldAttributes(infillDevelopmentAttributes, InfillDevelopmentCompensationLeasesFieldPaths.PAID_DATE)} name={`${field}.paid_date`} overrideValues={{
                label: InfillDevelopmentCompensationLeasesFieldTitles.PAID_DATE
              }} enableUiDataEdit uiDataKey={getUiDataInfillDevelopmentKey(InfillDevelopmentCompensationLeasesFieldPaths.PAID_DATE)} />
              </Authorization>
            </Column>
          </Row>

          <Authorization allow={isMethodAllowed(infillDevelopmentAttachmentMethods, Methods.GET)}>
            {!!infillDevelopmentCompensationLeaseId && <AppConsumer>
                {({
              dispatch
            }) => {
              return <Fragment>
                      <SubTitle enableUiDataEdit uiDataKey={getUiDataInfillDevelopmentAttachmentKey(InfillDevelopmentCompensationAttachmentFieldPaths.ATTACHMENTS)}>
                        {InfillDevelopmentCompensationAttachmentFieldTitles.ATTACHMENTS}
                      </SubTitle>

                      {!!attachments && !!attachments.length && <Fragment>
                          <Row>
                            <Column small={3} large={4}>
                              <Authorization allow={isFieldAllowedToRead(infillDevelopmentAttachmentAttributes, InfillDevelopmentCompensationAttachmentFieldPaths.FILE)}>
                                <FormTextTitle enableUiDataEdit uiDataKey={getUiDataInfillDevelopmentAttachmentKey(InfillDevelopmentCompensationAttachmentFieldPaths.FILE)}>
                                  {InfillDevelopmentCompensationAttachmentFieldTitles.FILE}
                                </FormTextTitle>
                              </Authorization>
                            </Column>
                            <Column small={3} large={2}>
                              <Authorization allow={isFieldAllowedToRead(infillDevelopmentAttachmentAttributes, InfillDevelopmentCompensationAttachmentFieldPaths.UPLOADED_AT)}>
                                <FormTextTitle enableUiDataEdit uiDataKey={getUiDataInfillDevelopmentAttachmentKey(InfillDevelopmentCompensationAttachmentFieldPaths.UPLOADED_AT)}>
                                  {InfillDevelopmentCompensationAttachmentFieldTitles.UPLOADED_AT}
                                </FormTextTitle>
                              </Authorization>
                            </Column>
                            <Column small={3} large={2}>
                              <FormTextTitle enableUiDataEdit uiDataKey={getUiDataInfillDevelopmentAttachmentKey(InfillDevelopmentCompensationAttachmentFieldPaths.UPLOADER)}>
                                {InfillDevelopmentCompensationAttachmentFieldTitles.UPLOADER}
                              </FormTextTitle>
                            </Column>
                          </Row>
                          {attachments.map((file, index) => {
                    const handleRemove = () => {
                      dispatch({
                        type: ActionTypes.SHOW_CONFIRMATION_MODAL,
                        confirmationFunction: () => {
                          this.handleDeleteInfillDevelopmentFile(file.id);
                        },
                        confirmationModalButtonClassName: ButtonColors.ALERT,
                        confirmationModalButtonText: ConfirmationModalTexts.DELETE_ATTACHMENT.BUTTON,
                        confirmationModalLabel: ConfirmationModalTexts.DELETE_ATTACHMENT.LABEL,
                        confirmationModalTitle: ConfirmationModalTexts.DELETE_ATTACHMENT.TITLE
                      });
                    };

                    return <Row key={index}>
                                <Column small={3} large={4}>
                                  <Authorization allow={isFieldAllowedToRead(infillDevelopmentAttachmentAttributes, InfillDevelopmentCompensationAttachmentFieldPaths.FILE)}>
                                    <FileDownloadLink fileUrl={file.file} label={file.filename} />
                                  </Authorization>
                                </Column>
                                <Column small={3} large={2}>
                                  <Authorization allow={isFieldAllowedToRead(infillDevelopmentAttachmentAttributes, InfillDevelopmentCompensationAttachmentFieldPaths.UPLOADED_AT)}>
                                    <FormText>{formatDate(file.uploaded_at) || '-'}</FormText>
                                  </Authorization>
                                </Column>
                                <Column small={3} large={2}>
                                  <FormText>{getUserFullName(file.uploader) || '-'}</FormText>
                                </Column>
                                <Column small={3} large={2}>
                                  <Authorization allow={isMethodAllowed(infillDevelopmentAttachmentMethods, Methods.DELETE)}>
                                    <RemoveButton className='third-level' onClick={handleRemove} style={{
                            right: 12
                          }} title="Poista liitetiedosto" />
                                  </Authorization>
                                </Column>
                              </Row>;
                  })}
                        </Fragment>}

                      <Authorization allow={isMethodAllowed(infillDevelopmentAttachmentMethods, Methods.POST)}>
                        <AddFileButton label='Lisää tiedosto' name={`${infillDevelopmentCompensationLeaseId}`} onChange={this.handleFileChange} />
                      </Authorization>
                    </Fragment>;
            }}
              </AppConsumer>}
          </Authorization>

          <Authorization allow={isFieldAllowedToRead(infillDevelopmentAttributes, InfillDevelopmentCompensationLeasesFieldPaths.NOTE)}>
            <Row>
              <Column>
                <FormField disableTouched={isSaveClicked} fieldAttributes={getFieldAttributes(infillDevelopmentAttributes, InfillDevelopmentCompensationLeasesFieldPaths.NOTE)} name={`${field}.note`} overrideValues={{
                label: InfillDevelopmentCompensationLeasesFieldTitles.NOTE
              }} enableUiDataEdit uiDataKey={getUiDataInfillDevelopmentKey(InfillDevelopmentCompensationLeasesFieldPaths.NOTE)} />
              </Column>
            </Row>
          </Authorization>
        </BoxContentWrapper>
      </Collapse>;
  }

}

const selector = formValueSelector(FormNames.INFILL_DEVELOPMENT);
export default flowRight(connect((state, props) => {
  const {
    field
  } = props;
  const leaseFieldValue = selector(state, `${field}.lease`);
  const lease = selector(state, `${field}.lease.value`);
  const leaseId = selector(state, `${field}.id`);
  return {
    collapseState: getCollapseStateByKey(state, `${ViewModes.EDIT}.${FormNames.INFILL_DEVELOPMENT}.${leaseId}`),
    compensationInvestment: selector(state, `${field}.compensation_investment_amount`),
    infillDevelopmentAttachmentAttributes: getInfillDevelopmentAttachmentAttributes(state),
    infillDevelopmentAttachmentMethods: getInfillDevelopmentAttachmentMethods(state),
    infillDevelopmentAttributes: getInfillDevelopmentAttributes(state),
    infillDevelopmentCompensationLeaseId: leaseId,
    isFetching: getIsFetchingById(state, lease),
    lease: getLeaseById(state, lease),
    leaseAttributes: getLeaseAttributes(state),
    leaseId: lease,
    leaseFieldValue: leaseFieldValue,
    monetaryCompensation: selector(state, `${field}.monetary_compensation_amount`),
    userActiveServiceUnit: getUserActiveServiceUnit(state),
    usersPermissions: getUsersPermissions(state)
  };
}, {
  createInfillDevelopmentAttachment,
  deleteInfillDevelopmentAttachment,
  fetchLeaseById,
  receiveCollapseStates
}))(LeaseItemEdit);