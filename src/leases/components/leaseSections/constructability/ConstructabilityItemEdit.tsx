import React, { Fragment, ReactElement } from "react";
import { connect } from "react-redux";
import { Row, Column } from "react-foundation";
import { FieldArray, formValueSelector } from "redux-form";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import { ActionTypes, AppConsumer } from "/src/app/AppContext";
import AddButtonThird from "/src/components/form/AddButtonThird";
import AddFileButton from "/src/components/form/AddFileButton";
import Authorization from "/src/components/authorization/Authorization";
import Collapse from "/src/components/collapse/Collapse";
import CollapseHeaderSubtitle from "/src/components/collapse/CollapseHeaderSubtitle";
import Comments from "./Comments";
import FieldAndRemoveButtonWrapper from "/src/components/form/FieldAndRemoveButtonWrapper";
import FileDownloadLink from "/src/components/file/FileDownloadLink";
import FormField from "/src/components/form/FormField";
import FormText from "/src/components/form/FormText";
import FormTextTitle from "/src/components/form/FormTextTitle";
import RemoveButton from "/src/components/form/RemoveButton";
import StatusIndicator from "./StatusIndicator";
import SubTitle from "/src/components/content/SubTitle";
import { receiveCollapseStates } from "/src/leases/actions";
import { createLeaseAreaAttachment, deleteLeaseAreaAttachment } from "/src/leaseAreaAttachment/actions";
import { ConfirmationModalTexts, FieldTypes, FormNames, ViewModes } from "enums";
import { ButtonColors } from "/src/components/enums";
import { LeaseAreaAddressesFieldPaths, LeaseAreaAttachmentsFieldPaths, LeaseAreaAttachmentsFieldTitles, LeaseAreasFieldPaths, LeaseAreasFieldTitles, LeaseConstructabilityDescriptionsFieldPaths, LeaseConstructabilityDescriptionsFieldTitles } from "/src/leases/enums";
import { LeaseAreaAttachmentTypes } from "/src/leaseAreaAttachment/enums";
import { UsersPermissions } from "/src/usersPermissions/enums";
import { getFullAddress } from "/src/leases/helpers";
import { getUiDataLeaseKey } from "/src/uiData/helpers";
import { getUserFullName } from "/src/users/helpers";
import { formatDate, formatNumber, getFieldAttributes, getLabelOfOption, hasPermissions, isEmptyValue, isFieldAllowedToEdit, isFieldAllowedToRead, isFieldRequired } from "util/helpers";
import { getAttributes, getCollapseStateByKey, getCurrentLease } from "/src/leases/selectors";
import { getUsersPermissions } from "/src/usersPermissions/selectors";
import { referenceNumber } from "/src/components/form/validations";
import type { Attributes } from "types";
import type { Lease } from "/src/leases/types";
import type { UsersPermissions as UsersPermissionsType } from "/src/usersPermissions/types";

const getPreconstructionErrors = (errors: Record<string, any> | null | undefined, area: string) => {
  return { ...get(errors, `${area}.preconstruction_state`, {}),
    ...get(errors, `${area}.descriptionsPreconstruction`, {})
  };
};

const getDemolitionErrors = (errors: Record<string, any> | null | undefined, area: string) => {
  return { ...get(errors, `${area}.demolition_state`, {}),
    ...get(errors, `${area}.descriptionsDemolition`, {})
  };
};

const getPollutedLandErrors = (errors: Record<string, any> | null | undefined, area: string) => {
  return { ...get(errors, `${area}.polluted_land_state`, {}),
    ...get(errors, `${area}.polluted_land_rent_condition_state`, {}),
    ...get(errors, `${area}.polluted_land_rent_condition_date`, {}),
    ...get(errors, `${area}.polluted_land_planner`, {}),
    ...get(errors, `${area}.polluted_land_projectwise_number`, {}),
    ...get(errors, `${area}.descriptionsPollutedLand`, {})
  };
};

const getConstructabilityReportErrors = (errors: Record<string, any> | null | undefined, area: string) => {
  return { ...get(errors, `${area}.constructability_report_state`),
    ...get(errors, `${area}.constructability_report_investigation_state`, {}),
    ...get(errors, `${area}.constructability_report_signing_date`, {}),
    ...get(errors, `${area}.constructability_report_signer`, {}),
    ...get(errors, `${area}.constructability_report_geotechnical_number`, {}),
    ...get(errors, `${area}.descriptionsReport`, {})
  };
};

const getOtherErrors = (errors: Record<string, any> | null | undefined, area: string) => {
  return { ...get(errors, `${area}.other_state`),
    ...get(errors, `${area}.descriptionsOther`)
  };
};

type CommentProps = {
  attributes: Attributes;
  comments: Array<Record<string, any>>;
  fields: any;
  isSaveClicked: boolean;
  usersPermissions: UsersPermissionsType;
};
const renderComments = connect((state, props) => {
  return {
    comments: selector(state, props.fields.name)
  };
})(({
  attributes,
  comments,
  fields,
  isSaveClicked,
  usersPermissions
}: CommentProps): ReactElement => {
  const handleAdd = () => {
    fields.push({
      is_static: false
    });
  };

  if (!hasPermissions(usersPermissions, UsersPermissions.ADD_CONSTRUCTABILITYDESCRIPTION) && !hasPermissions(usersPermissions, UsersPermissions.DELETE_CONSTRUCTABILITYDESCRIPTION) && !isFieldAllowedToEdit(attributes, LeaseConstructabilityDescriptionsFieldPaths.TEXT) && !isFieldAllowedToEdit(attributes, LeaseConstructabilityDescriptionsFieldPaths.AHJO_REFERENCE_NUMBER)) {
    return <Comments comments={comments} />;
  }

  return <AppConsumer>
      {({
      dispatch
    }) => {
      return <Fragment>
            <SubTitle enableUiDataEdit uiDataKey={getUiDataLeaseKey(LeaseConstructabilityDescriptionsFieldPaths.CONSTRUCTABILITY_DESCRIPTIONS)}>
              {LeaseConstructabilityDescriptionsFieldTitles.CONSTRUCTABILITY_DESCRIPTIONS}
            </SubTitle>
            {!hasPermissions(usersPermissions, UsersPermissions.ADD_CONSTRUCTABILITYDESCRIPTION) && (!fields || !fields.length) && <FormText><em>Ei huomautuksia</em></FormText>}

            {fields && !!fields.length && <Fragment>
                <Row>
                  <Column small={6} medium={6} large={8}>
                    <Authorization allow={isFieldAllowedToRead(attributes, LeaseConstructabilityDescriptionsFieldPaths.TEXT)}>
                      <FormTextTitle required={isFieldRequired(attributes, LeaseConstructabilityDescriptionsFieldPaths.TEXT)} enableUiDataEdit uiDataKey={getUiDataLeaseKey(LeaseConstructabilityDescriptionsFieldPaths.TEXT)}>
                        {LeaseConstructabilityDescriptionsFieldTitles.TEXT}
                      </FormTextTitle>
                    </Authorization>
                  </Column>
                  <Column small={3} medium={3} large={2}>
                    <Authorization allow={isFieldAllowedToRead(attributes, LeaseConstructabilityDescriptionsFieldPaths.IS_STATIC)}>
                      <FormTextTitle required={isFieldRequired(attributes, LeaseConstructabilityDescriptionsFieldPaths.IS_STATIC)} enableUiDataEdit uiDataKey={getUiDataLeaseKey(LeaseConstructabilityDescriptionsFieldPaths.IS_STATIC)}>
                        {LeaseConstructabilityDescriptionsFieldTitles.IS_STATIC}
                      </FormTextTitle>
                    </Authorization>
                  </Column>
                  <Column small={3} medium={3} large={2}>
                    <Authorization allow={isFieldAllowedToRead(attributes, LeaseConstructabilityDescriptionsFieldPaths.AHJO_REFERENCE_NUMBER)}>
                      <FormTextTitle required={isFieldRequired(attributes, LeaseConstructabilityDescriptionsFieldPaths.AHJO_REFERENCE_NUMBER)} enableUiDataEdit tooltipStyle={{
                  right: 20
                }} uiDataKey={getUiDataLeaseKey(LeaseConstructabilityDescriptionsFieldPaths.AHJO_REFERENCE_NUMBER)}>
                        {LeaseConstructabilityDescriptionsFieldTitles.AHJO_REFERENCE_NUMBER}
                      </FormTextTitle>
                    </Authorization>
                  </Column>
                </Row>
                {fields.map((comment, index) => {
            const handleRemove = () => {
              dispatch({
                type: ActionTypes.SHOW_CONFIRMATION_MODAL,
                confirmationFunction: () => {
                  fields.remove(index);
                },
                confirmationModalButtonClassName: ButtonColors.ALERT,
                confirmationModalButtonText: ConfirmationModalTexts.DELETE_NOTE.BUTTON,
                confirmationModalLabel: ConfirmationModalTexts.DELETE_NOTE.LABEL,
                confirmationModalTitle: ConfirmationModalTexts.DELETE_NOTE.TITLE
              });
            };

            return <Row key={index}>
                      <Column small={6} medium={6} large={8}>
                        <Authorization allow={isFieldAllowedToRead(attributes, LeaseConstructabilityDescriptionsFieldPaths.TEXT)}>
                          <FormField disableTouched={isSaveClicked} fieldAttributes={getFieldAttributes(attributes, LeaseConstructabilityDescriptionsFieldPaths.TEXT)} invisibleLabel name={`${comment}.text`} overrideValues={{
                    label: LeaseConstructabilityDescriptionsFieldTitles.TEXT
                  }} />
                        </Authorization>
                      </Column>
                      <Column small={3} medium={3} large={2}>
                        <Authorization allow={isFieldAllowedToRead(attributes, LeaseConstructabilityDescriptionsFieldPaths.IS_STATIC)}>
                          <FormField disableTouched={isSaveClicked} fieldAttributes={getFieldAttributes(attributes, LeaseConstructabilityDescriptionsFieldPaths.IS_STATIC)} invisibleLabel name={`${comment}.is_static`} overrideValues={{
                    label: LeaseConstructabilityDescriptionsFieldTitles.IS_STATIC
                  }} />
                        </Authorization>
                      </Column>
                      <Column small={3} medium={3} large={2}>
                        <FieldAndRemoveButtonWrapper field={<Authorization allow={isFieldAllowedToRead(attributes, LeaseConstructabilityDescriptionsFieldPaths.AHJO_REFERENCE_NUMBER)}>
                            <FormField disableTouched={isSaveClicked} fieldAttributes={getFieldAttributes(attributes, LeaseConstructabilityDescriptionsFieldPaths.AHJO_REFERENCE_NUMBER)} invisibleLabel name={`${comment}.ahjo_reference_number`} validate={referenceNumber} overrideValues={{
                    label: LeaseConstructabilityDescriptionsFieldTitles.AHJO_REFERENCE_NUMBER,
                    fieldType: FieldTypes.REFERENCE_NUMBER
                  }} />
                          </Authorization>} removeButton={<Authorization allow={hasPermissions(usersPermissions, UsersPermissions.DELETE_CONSTRUCTABILITYDESCRIPTION)}>
                            <RemoveButton className='third-level' onClick={handleRemove} title="Poista huomautus" />
                          </Authorization>} />
                      </Column>
                    </Row>;
          })}
              </Fragment>}

            <Authorization allow={hasPermissions(usersPermissions, UsersPermissions.ADD_CONSTRUCTABILITYDESCRIPTION)}>
              <Row>
                <Column>
                  <AddButtonThird label='Lisää huomautus' onClick={handleAdd} />
                </Column>
              </Row>
            </Authorization>
          </Fragment>;
    }}
    </AppConsumer>;
});
type Props = {
  areaCollapseState: boolean;
  areaId: number;
  attributes: Attributes;
  constructabilityReportCollapseState: boolean;
  constructabilityStateOptions: Array<Record<string, any>>;
  createLeaseAreaAttachment: (...args: Array<any>) => any;
  currentLease: Lease;
  deleteLeaseAreaAttachment: (...args: Array<any>) => any;
  demolitionCollapseState: boolean;
  errors: Record<string, any> | null | undefined;
  field: string;
  isSaveClicked: boolean;
  locationOptions: Array<Record<string, any>>;
  otherCollapseState: boolean;
  pollutedLandCollapseState: boolean;
  pollutedLandConditionStateOptions: Array<Record<string, any>>;
  preconstructionCollapseState: boolean;
  receiveCollapseStates: (...args: Array<any>) => any;
  savedArea: Record<string, any>;
  stateOptions: Array<Record<string, any>>;
  typeOptions: Array<Record<string, any>>;
  usersPermissions: UsersPermissionsType;
};

const ConstructabilityItemEdit = ({
  areaCollapseState,
  areaId,
  attributes,
  constructabilityReportCollapseState,
  constructabilityStateOptions,
  createLeaseAreaAttachment,
  currentLease,
  deleteLeaseAreaAttachment,
  demolitionCollapseState,
  errors,
  field,
  isSaveClicked,
  locationOptions,
  otherCollapseState,
  pollutedLandCollapseState,
  preconstructionCollapseState,
  receiveCollapseStates,
  savedArea,
  typeOptions,
  usersPermissions
}: Props) => {
  const handleCollapseToggle = (key: string, val: boolean) => {
    if (!areaId) return;
    receiveCollapseStates({
      [ViewModes.EDIT]: {
        [formName]: {
          [areaId]: {
            [key]: val
          }
        }
      }
    });
  };

  const handleAreaCollapseToggle = (val: boolean) => {
    handleCollapseToggle('area', val);
  };

  const handlePreconstructionCollapseToggle = (val: boolean) => {
    handleCollapseToggle('preconstruction', val);
  };

  const handleDemolitionCollapseToggle = (val: boolean) => {
    handleCollapseToggle('demolition', val);
  };

  const handlePollutedLandCollapseToggle = (val: boolean) => {
    handleCollapseToggle('polluted_land', val);
  };

  const handleConstructabilityReportCollapseToggle = (val: boolean) => {
    handleCollapseToggle('constructability_report', val);
  };

  const handleOtherCollapseToggle = (val: boolean) => {
    handleCollapseToggle('other', val);
  };

  const handleAddMattiReport = (e: any) => {
    createLeaseAreaAttachment({
      lease: currentLease.id,
      data: {
        lease_area: areaId,
        type: LeaseAreaAttachmentTypes.MATTI_REPORT
      },
      file: e.target.files[0]
    });
  };

  const handleAddGeotechnicalAttachment = (e: any) => {
    createLeaseAreaAttachment({
      lease: currentLease.id,
      data: {
        lease_area: areaId,
        type: LeaseAreaAttachmentTypes.GEOTECHNICAL
      },
      file: e.target.files[0]
    });
  };

  const handleDeleteLeaseAreaAttachment = (fileId: number) => {
    deleteLeaseAreaAttachment({
      id: fileId,
      lease: currentLease.id
    });
  };

  const areaErrors = get(errors, field);
  const preconstructionErrors = getPreconstructionErrors(errors, field);
  const demolitionErrors = getDemolitionErrors(errors, field);
  const pollutedLandErrors = getPollutedLandErrors(errors, field);
  const constructabilityReportErrors = getConstructabilityReportErrors(errors, field);
  const otherErrors = getOtherErrors(errors, field);
  const pollutedLandMattiAttachments = savedArea.polluted_land_matti_reports;
  const constructabilityReportGeotechnicalAttachments = savedArea.constructability_report_geotechnical_attachments;
  return <Collapse defaultOpen={areaCollapseState !== undefined ? areaCollapseState : true} hasErrors={isSaveClicked && !isEmpty(areaErrors)} headerSubtitles={<Fragment>
          <Column>
            <Authorization allow={isFieldAllowedToRead(attributes, LeaseAreasFieldPaths.TYPE)}>
              <CollapseHeaderSubtitle>{getLabelOfOption(typeOptions, savedArea.type) || '-'}</CollapseHeaderSubtitle>
            </Authorization>
          </Column>
          <Column>
            <Authorization allow={isFieldAllowedToRead(attributes, LeaseAreaAddressesFieldPaths.ADDRESSES)}>
              <CollapseHeaderSubtitle>{getFullAddress(savedArea)}</CollapseHeaderSubtitle>
            </Authorization>
          </Column>
          <Column>
            <Authorization allow={isFieldAllowedToRead(attributes, LeaseAreasFieldPaths.AREA)}>
              <CollapseHeaderSubtitle>{!isEmptyValue(savedArea.area) ? `${formatNumber(savedArea.area)} m²` : '-'}{savedArea.location ? ` / ${getLabelOfOption(locationOptions, savedArea.location) || ''}` : ''}</CollapseHeaderSubtitle>
            </Authorization>
          </Column>
        </Fragment>} headerTitle={<Authorization allow={isFieldAllowedToRead(attributes, LeaseAreasFieldPaths.IDENTIFIER)}>
          {savedArea.identifier}
        </Authorization>} onToggle={handleAreaCollapseToggle} showTitleOnOpen>
      <Collapse className='collapse__secondary' defaultOpen={preconstructionCollapseState !== undefined ? preconstructionCollapseState : false} hasErrors={isSaveClicked && !isEmpty(preconstructionErrors)} headerSubtitles={<Authorization allow={isFieldAllowedToRead(attributes, LeaseAreasFieldPaths.PRECONSTRUCTION_STATE)}>
            <Column>
              <StatusIndicator researchState={savedArea.preconstruction_state} stateOptions={constructabilityStateOptions} />
            </Column>
          </Authorization>} headerTitle={LeaseAreasFieldTitles.PRECONSTRUCTION} onToggle={handlePreconstructionCollapseToggle} enableUiDataEdit uiDataKey={getUiDataLeaseKey(LeaseAreasFieldPaths.PRECONSTRUCTION)}>
        <Row>
          <Column small={6} medium={4} large={2}>
            <Authorization allow={isFieldAllowedToRead(attributes, LeaseAreasFieldPaths.PRECONSTRUCTION_STATE)}>
              <FormField disableTouched={isSaveClicked} fieldAttributes={getFieldAttributes(attributes, LeaseAreasFieldPaths.PRECONSTRUCTION_STATE)} name={`${field}.preconstruction_state`} overrideValues={{
              label: LeaseAreasFieldTitles.PRECONSTRUCTION_STATE
            }} enableUiDataEdit uiDataKey={getUiDataLeaseKey(LeaseAreasFieldPaths.PRECONSTRUCTION_STATE)} />
            </Authorization>
          </Column>
          <Column small={6} medium={4} large={2}>
            <Authorization allow={isFieldAllowedToRead(attributes, LeaseAreasFieldPaths.PRECONSTRUCTION_ESTIMATED_CONSTRUCTION_READINESS_MOMENT)}>
              <FormField disableTouched={isSaveClicked} fieldAttributes={getFieldAttributes(attributes, LeaseAreasFieldPaths.PRECONSTRUCTION_ESTIMATED_CONSTRUCTION_READINESS_MOMENT)} name={`${field}.preconstruction_estimated_construction_readiness_moment`} overrideValues={{
              label: LeaseAreasFieldTitles.PRECONSTRUCTION_ESTIMATED_CONSTRUCTION_READINESS_MOMENT
            }} enableUiDataEdit uiDataKey={getUiDataLeaseKey(LeaseAreasFieldPaths.PRECONSTRUCTION_ESTIMATED_CONSTRUCTION_READINESS_MOMENT)} />
            </Authorization>
          </Column>
          <Column small={6} medium={4} offsetOnLarge={1} large={2}>
            <Authorization allow={isFieldAllowedToRead(attributes, LeaseAreasFieldPaths.PRECONSTRUCTION_INSPECTION_MOMENT)}>
              <FormField disableTouched={isSaveClicked} fieldAttributes={getFieldAttributes(attributes, LeaseAreasFieldPaths.PRECONSTRUCTION_INSPECTION_MOMENT)} name={`${field}.preconstruction_inspection_moment`} overrideValues={{
              label: LeaseAreasFieldTitles.PRECONSTRUCTION_INSPECTION_MOMENT
            }} enableUiDataEdit uiDataKey={getUiDataLeaseKey(LeaseAreasFieldPaths.PRECONSTRUCTION_INSPECTION_MOMENT)} />
            </Authorization>
          </Column>
        </Row>

        <Authorization allow={isFieldAllowedToRead(attributes, LeaseConstructabilityDescriptionsFieldPaths.CONSTRUCTABILITY_DESCRIPTIONS)}>
          <FieldArray attributes={attributes} name={`${field}.descriptionsPreconstruction`} component={renderComments} isSaveClicked={isSaveClicked} usersPermissions={usersPermissions} />
        </Authorization>
      </Collapse>

      <Collapse className='collapse__secondary' defaultOpen={demolitionCollapseState !== undefined ? demolitionCollapseState : false} hasErrors={isSaveClicked && !isEmpty(demolitionErrors)} headerSubtitles={<Authorization allow={isFieldAllowedToRead(attributes, LeaseAreasFieldPaths.DEMOLITION_STATE)}>
            <Column>
              <StatusIndicator researchState={savedArea.demolition_state} stateOptions={constructabilityStateOptions} />
            </Column>
          </Authorization>} headerTitle={LeaseAreasFieldTitles.DEMOLITION} onToggle={handleDemolitionCollapseToggle} enableUiDataEdit uiDataKey={getUiDataLeaseKey(LeaseAreasFieldPaths.DEMOLITION)}>
        <Row>
          <Column small={6} medium={4} large={2}>
            <Authorization allow={isFieldAllowedToRead(attributes, LeaseAreasFieldPaths.DEMOLITION_STATE)}>
              <FormField disableTouched={isSaveClicked} fieldAttributes={getFieldAttributes(attributes, LeaseAreasFieldPaths.DEMOLITION_STATE)} name={`${field}.demolition_state`} overrideValues={{
              label: LeaseAreasFieldTitles.DEMOLITION_STATE
            }} enableUiDataEdit uiDataKey={getUiDataLeaseKey(LeaseAreasFieldPaths.DEMOLITION_STATE)} />
            </Authorization>
          </Column>
        </Row>

        <Authorization allow={isFieldAllowedToRead(attributes, LeaseConstructabilityDescriptionsFieldPaths.CONSTRUCTABILITY_DESCRIPTIONS)}>
          <FieldArray attributes={attributes} component={renderComments} isSaveClicked={isSaveClicked} name={`${field}.descriptionsDemolition`} usersPermissions={usersPermissions} />
        </Authorization>
      </Collapse>

      <Collapse className='collapse__secondary' defaultOpen={pollutedLandCollapseState !== undefined ? pollutedLandCollapseState : false} hasErrors={isSaveClicked && !isEmpty(pollutedLandErrors)} headerSubtitles={<Authorization allow={isFieldAllowedToRead(attributes, LeaseAreasFieldPaths.POLLUTED_LAND_STATE)}>
            <Column>
              <StatusIndicator researchState={savedArea.polluted_land_state} stateOptions={constructabilityStateOptions} />
            </Column>
          </Authorization>} headerTitle={LeaseAreasFieldTitles.POLLUTED_LAND} onToggle={handlePollutedLandCollapseToggle} enableUiDataEdit uiDataKey={getUiDataLeaseKey(LeaseAreasFieldPaths.POLLUTED_LAND)}>
        <Row>
          <Column small={6} medium={4} large={2}>
            <Authorization allow={isFieldAllowedToRead(attributes, LeaseAreasFieldPaths.POLLUTED_LAND_STATE)}>
              <FormField disableTouched={isSaveClicked} fieldAttributes={getFieldAttributes(attributes, LeaseAreasFieldPaths.POLLUTED_LAND_STATE)} name={`${field}.polluted_land_state`} overrideValues={{
              label: LeaseAreasFieldTitles.POLLUTED_LAND_STATE
            }} enableUiDataEdit uiDataKey={getUiDataLeaseKey(LeaseAreasFieldPaths.POLLUTED_LAND_STATE)} />
            </Authorization>
          </Column>
          <Column small={6} medium={4} large={2}>
            <Authorization allow={isFieldAllowedToRead(attributes, LeaseAreasFieldPaths.POLLUTED_LAND_RENT_CONDITION_STATE)}>
              <FormField disableTouched={isSaveClicked} fieldAttributes={getFieldAttributes(attributes, LeaseAreasFieldPaths.POLLUTED_LAND_RENT_CONDITION_STATE)} name={`${field}.polluted_land_rent_condition_state`} overrideValues={{
              label: LeaseAreasFieldTitles.POLLUTED_LAND_RENT_CONDITION_STATE
            }} enableUiDataEdit uiDataKey={getUiDataLeaseKey(LeaseAreasFieldPaths.POLLUTED_LAND_RENT_CONDITION_STATE)} />
            </Authorization>
          </Column>
          <Column small={6} medium={4} large={2}>
            <Authorization allow={isFieldAllowedToRead(attributes, LeaseAreasFieldPaths.POLLUTED_LAND_RENT_CONDITION_DATE)}>
              <FormField disableTouched={isSaveClicked} fieldAttributes={getFieldAttributes(attributes, LeaseAreasFieldPaths.POLLUTED_LAND_RENT_CONDITION_DATE)} name={`${field}.polluted_land_rent_condition_date`} overrideValues={{
              label: LeaseAreasFieldTitles.POLLUTED_LAND_RENT_CONDITION_DATE
            }} enableUiDataEdit uiDataKey={getUiDataLeaseKey(LeaseAreasFieldPaths.POLLUTED_LAND_RENT_CONDITION_DATE)} />
            </Authorization>
          </Column>
          <Column small={6} medium={4} large={2}>
            <Authorization allow={isFieldAllowedToRead(attributes, LeaseAreasFieldPaths.POLLUTED_LAND_PLANNER)}>
              <FormField disableTouched={isSaveClicked} fieldAttributes={getFieldAttributes(attributes, LeaseAreasFieldPaths.POLLUTED_LAND_PLANNER)} name={`${field}.polluted_land_planner`} overrideValues={{
              fieldType: FieldTypes.USER,
              label: LeaseAreasFieldTitles.POLLUTED_LAND_PLANNER
            }} enableUiDataEdit uiDataKey={getUiDataLeaseKey(LeaseAreasFieldPaths.POLLUTED_LAND_PLANNER)} />
            </Authorization>
          </Column>
          <Column small={6} medium={4} large={2}>
            <Authorization allow={isFieldAllowedToRead(attributes, LeaseAreasFieldPaths.POLLUTED_LAND_PROJECTWISE_NUMBER)}>
              <FormField disableTouched={isSaveClicked} fieldAttributes={getFieldAttributes(attributes, LeaseAreasFieldPaths.POLLUTED_LAND_PROJECTWISE_NUMBER)} name={`${field}.polluted_land_projectwise_number`} overrideValues={{
              label: LeaseAreasFieldTitles.POLLUTED_LAND_PROJECTWISE_NUMBER
            }} enableUiDataEdit uiDataKey={getUiDataLeaseKey(LeaseAreasFieldPaths.POLLUTED_LAND_PROJECTWISE_NUMBER)} />
            </Authorization>
          </Column>
        </Row>

        <Authorization allow={isFieldAllowedToRead(attributes, LeaseAreaAttachmentsFieldPaths.ATTACHMENTS)}>
          <AppConsumer>
            {({
            dispatch
          }) => {
            return <Fragment>
                  <SubTitle enableUiDataEdit uiDataKey={getUiDataLeaseKey(LeaseAreasFieldPaths.POLLUTED_LAND_MATTI_REPORTS)}>
                    {LeaseAreasFieldTitles.POLLUTED_LAND_MATTI_REPORTS}
                  </SubTitle>
                  {!hasPermissions(usersPermissions, UsersPermissions.ADD_LEASEAREAATTACHMENT) && !pollutedLandMattiAttachments.length && <FormText>Ei Matti raportteja</FormText>}
                  {!!pollutedLandMattiAttachments.length && <Fragment>
                      <Row>
                        <Column small={3} large={4}>
                          <Authorization allow={isFieldAllowedToRead(attributes, LeaseAreaAttachmentsFieldPaths.FILE)}>
                            <FormTextTitle enableUiDataEdit uiDataKey={getUiDataLeaseKey(LeaseAreaAttachmentsFieldPaths.FILE)}>
                              {LeaseAreaAttachmentsFieldTitles.FILE}
                            </FormTextTitle>
                          </Authorization>
                        </Column>
                        <Column small={3} large={2}>
                          <Authorization allow={isFieldAllowedToRead(attributes, LeaseAreaAttachmentsFieldPaths.UPLOADED_AT)}>
                            <FormTextTitle enableUiDataEdit uiDataKey={getUiDataLeaseKey(LeaseAreaAttachmentsFieldPaths.UPLOADED_AT)}>
                              {LeaseAreaAttachmentsFieldTitles.UPLOADED_AT}
                            </FormTextTitle>
                          </Authorization>
                        </Column>
                        <Column small={3} large={2}>
                          <FormTextTitle enableUiDataEdit uiDataKey={getUiDataLeaseKey(LeaseAreaAttachmentsFieldPaths.UPLOADER)}>
                            {LeaseAreaAttachmentsFieldTitles.UPLOADER}
                          </FormTextTitle>
                        </Column>
                      </Row>
                      {pollutedLandMattiAttachments.map((file, index) => {
                  const handleRemove = () => {
                    dispatch({
                      type: ActionTypes.SHOW_CONFIRMATION_MODAL,
                      confirmationFunction: () => {
                        handleDeleteLeaseAreaAttachment(file.id);
                      },
                      confirmationModalButtonClassName: ButtonColors.ALERT,
                      confirmationModalButtonText: ConfirmationModalTexts.DELETE_ATTACHMENT.BUTTON,
                      confirmationModalLabel: ConfirmationModalTexts.DELETE_ATTACHMENT.LABEL,
                      confirmationModalTitle: ConfirmationModalTexts.DELETE_ATTACHMENT.TITLE
                    });
                  };

                  return <Row key={index}>
                            <Column small={3} large={4}>
                              <Authorization allow={isFieldAllowedToRead(attributes, LeaseAreaAttachmentsFieldPaths.FILE)}>
                                <FileDownloadLink fileUrl={file.file} label={file.filename} />
                              </Authorization>
                            </Column>
                            <Column small={3} large={2}>
                              <Authorization allow={isFieldAllowedToRead(attributes, LeaseAreaAttachmentsFieldPaths.UPLOADED_AT)}>
                                <FormText>{formatDate(file.uploaded_at) || '-'}</FormText>
                              </Authorization>
                            </Column>
                            <Column small={3} large={2}>
                              <FormText>{getUserFullName(file.uploader) || '-'}</FormText>
                            </Column>
                            <Column small={3} large={2}>
                              <Authorization allow={hasPermissions(usersPermissions, UsersPermissions.DELETE_LEASEAREAATTACHMENT)}>
                                <RemoveButton className='third-level' onClick={handleRemove} style={{
                          right: 12
                        }} title="Poista liitetiedosto" />
                              </Authorization>
                            </Column>
                          </Row>;
                })}
                    </Fragment>}

                  <Authorization allow={hasPermissions(usersPermissions, UsersPermissions.ADD_LEASEAREAATTACHMENT)}>
                    <AddFileButton label='Lisää tiedosto' name={`add_polluted_land_matti_report_button_${areaId}`} onChange={handleAddMattiReport} />
                  </Authorization>
                </Fragment>;
          }}
          </AppConsumer>
        </Authorization>

        <Authorization allow={isFieldAllowedToRead(attributes, LeaseConstructabilityDescriptionsFieldPaths.CONSTRUCTABILITY_DESCRIPTIONS)}>
          <FieldArray attributes={attributes} component={renderComments} isSaveClicked={isSaveClicked} name={`${field}.descriptionsPollutedLand`} usersPermissions={usersPermissions} />
        </Authorization>
      </Collapse>

      <Collapse className='collapse__secondary' defaultOpen={constructabilityReportCollapseState !== undefined ? constructabilityReportCollapseState : false} hasErrors={isSaveClicked && !isEmpty(constructabilityReportErrors)} headerSubtitles={<Authorization allow={isFieldAllowedToRead(attributes, LeaseAreasFieldPaths.CONSTRUCTABILITY_REPORT_STATE)}>
            <Column>
              <StatusIndicator researchState={savedArea.constructability_report_state} stateOptions={constructabilityStateOptions} />
            </Column>
          </Authorization>} headerTitle={LeaseAreasFieldTitles.CONSTRUCTABILITY_REPORT} onToggle={handleConstructabilityReportCollapseToggle} enableUiDataEdit uiDataKey={getUiDataLeaseKey(LeaseAreasFieldPaths.CONSTRUCTABILITY_REPORT)}>
        <Row>
          <Column small={6} medium={4} large={2}>
            <Authorization allow={isFieldAllowedToRead(attributes, LeaseAreasFieldPaths.CONSTRUCTABILITY_REPORT_STATE)}>
              <FormField disableTouched={isSaveClicked} fieldAttributes={getFieldAttributes(attributes, LeaseAreasFieldPaths.CONSTRUCTABILITY_REPORT_STATE)} name={`${field}.constructability_report_state`} overrideValues={{
              label: LeaseAreasFieldTitles.CONSTRUCTABILITY_REPORT_STATE
            }} enableUiDataEdit uiDataKey={getUiDataLeaseKey(LeaseAreasFieldPaths.CONSTRUCTABILITY_REPORT_STATE)} />
            </Authorization>
          </Column>
          <Column small={6} medium={4} large={2}>
            <Authorization allow={isFieldAllowedToRead(attributes, LeaseAreasFieldPaths.CONSTRUCTABILITY_REPORT_INVESTIGATION_STATE)}>
              <FormField disableTouched={isSaveClicked} fieldAttributes={getFieldAttributes(attributes, LeaseAreasFieldPaths.CONSTRUCTABILITY_REPORT_INVESTIGATION_STATE)} name={`${field}.constructability_report_investigation_state`} overrideValues={{
              label: LeaseAreasFieldTitles.CONSTRUCTABILITY_REPORT_INVESTIGATION_STATE
            }} enableUiDataEdit uiDataKey={getUiDataLeaseKey(LeaseAreasFieldPaths.CONSTRUCTABILITY_REPORT_INVESTIGATION_STATE)} />
            </Authorization>
          </Column>
          <Column small={6} medium={4} large={2}>
            <Authorization allow={isFieldAllowedToRead(attributes, LeaseAreasFieldPaths.CONSTRUCTABILITY_REPORT_SIGNING_DATE)}>
              <FormField disableTouched={isSaveClicked} fieldAttributes={getFieldAttributes(attributes, LeaseAreasFieldPaths.CONSTRUCTABILITY_REPORT_SIGNING_DATE)} name={`${field}.constructability_report_signing_date`} overrideValues={{
              label: LeaseAreasFieldTitles.CONSTRUCTABILITY_REPORT_SIGNING_DATE
            }} enableUiDataEdit uiDataKey={getUiDataLeaseKey(LeaseAreasFieldPaths.CONSTRUCTABILITY_REPORT_SIGNING_DATE)} />
            </Authorization>
          </Column>
          <Column small={6} medium={4} large={2}>
            <Authorization allow={isFieldAllowedToRead(attributes, LeaseAreasFieldPaths.CONSTRUCTABILITY_REPORT_SIGNER)}>
              <FormField disableTouched={isSaveClicked} fieldAttributes={getFieldAttributes(attributes, LeaseAreasFieldPaths.CONSTRUCTABILITY_REPORT_SIGNER)} name={`${field}.constructability_report_signer`} overrideValues={{
              label: LeaseAreasFieldTitles.CONSTRUCTABILITY_REPORT_SIGNER
            }} enableUiDataEdit uiDataKey={getUiDataLeaseKey(LeaseAreasFieldPaths.CONSTRUCTABILITY_REPORT_SIGNER)} />
            </Authorization>
          </Column>
        </Row>

        <Authorization allow={isFieldAllowedToRead(attributes, LeaseAreaAttachmentsFieldPaths.ATTACHMENTS)}>
          <AppConsumer>
            {({
            dispatch
          }) => {
            return <Fragment>
                  <SubTitle enableUiDataEdit uiDataKey={getUiDataLeaseKey(LeaseAreasFieldPaths.CONSTRUCTABILITY_REPORT_GEOTECHNICAL_ATTACHMENTS)}>
                    {LeaseAreasFieldTitles.CONSTRUCTABILITY_REPORT_GEOTECHNICAL_ATTACHMENTS}
                  </SubTitle>
                  {!hasPermissions(usersPermissions, UsersPermissions.ADD_LEASEAREAATTACHMENT) && !constructabilityReportGeotechnicalAttachments.length && <FormText>Ei geoteknisen palvelun tiedostoja</FormText>}
                  {!!constructabilityReportGeotechnicalAttachments.length && <Fragment>
                      <Row>
                        <Column small={3} large={4}>
                          <Authorization allow={isFieldAllowedToRead(attributes, LeaseAreaAttachmentsFieldPaths.FILE)}>
                            <FormTextTitle enableUiDataEdit uiDataKey={getUiDataLeaseKey(LeaseAreaAttachmentsFieldPaths.FILE)}>
                              {LeaseAreaAttachmentsFieldTitles.FILE}
                            </FormTextTitle>
                          </Authorization>
                        </Column>
                        <Column small={3} large={2}>
                          <Authorization allow={isFieldAllowedToRead(attributes, LeaseAreaAttachmentsFieldPaths.UPLOADED_AT)}>
                            <FormTextTitle enableUiDataEdit uiDataKey={getUiDataLeaseKey(LeaseAreaAttachmentsFieldPaths.UPLOADED_AT)}>
                              {LeaseAreaAttachmentsFieldTitles.UPLOADED_AT}
                            </FormTextTitle>
                          </Authorization>
                        </Column>
                        <Column small={3} large={2}>
                          <FormTextTitle enableUiDataEdit uiDataKey={getUiDataLeaseKey(LeaseAreaAttachmentsFieldPaths.UPLOADER)}>
                            {LeaseAreaAttachmentsFieldTitles.UPLOADER}
                          </FormTextTitle>
                        </Column>
                      </Row>
                      {constructabilityReportGeotechnicalAttachments.map((file, index) => {
                  const handleRemove = () => {
                    dispatch({
                      type: ActionTypes.SHOW_CONFIRMATION_MODAL,
                      confirmationFunction: () => {
                        handleDeleteLeaseAreaAttachment(file.id);
                      },
                      confirmationModalButtonClassName: ButtonColors.ALERT,
                      confirmationModalButtonText: ConfirmationModalTexts.DELETE_ATTACHMENT.BUTTON,
                      confirmationModalLabel: ConfirmationModalTexts.DELETE_ATTACHMENT.LABEL,
                      confirmationModalTitle: ConfirmationModalTexts.DELETE_ATTACHMENT.TITLE
                    });
                  };

                  return <Row key={index}>
                            <Column small={3} large={4}>
                              <Authorization allow={isFieldAllowedToRead(attributes, LeaseAreaAttachmentsFieldPaths.FILE)}>
                                <FileDownloadLink fileUrl={file.file} label={file.filename} />
                              </Authorization>
                            </Column>
                            <Column small={3} large={2}>
                              <Authorization allow={isFieldAllowedToRead(attributes, LeaseAreaAttachmentsFieldPaths.UPLOADED_AT)}>
                                <FormText>{formatDate(file.uploaded_at) || '-'}</FormText>
                              </Authorization>
                            </Column>
                            <Column small={3} large={2}>
                              <FormText>{getUserFullName(file.uploader) || '-'}</FormText>
                            </Column>
                            <Column small={3} large={2}>
                              <Authorization allow={hasPermissions(usersPermissions, UsersPermissions.DELETE_LEASEAREAATTACHMENT)}>
                                <RemoveButton className='third-level' onClick={handleRemove} style={{
                          right: 12
                        }} title="Poista liitetiedosto" />
                              </Authorization>
                            </Column>
                          </Row>;
                })}
                    </Fragment>}

                  <Authorization allow={hasPermissions(usersPermissions, UsersPermissions.ADD_LEASEAREAATTACHMENT)}>
                    <AddFileButton label='Lisää tiedosto' name={`add_constructability_report_geotechnical_attachment_button_${areaId}`} onChange={handleAddGeotechnicalAttachment} />
                  </Authorization>
                </Fragment>;
          }}
          </AppConsumer>
        </Authorization>

        <Authorization allow={isFieldAllowedToRead(attributes, LeaseConstructabilityDescriptionsFieldPaths.CONSTRUCTABILITY_DESCRIPTIONS)}>
          <FieldArray attributes={attributes} component={renderComments} isSaveClicked={isSaveClicked} name={`${field}.descriptionsReport`} usersPermissions={usersPermissions} />
        </Authorization>
      </Collapse>

      <Collapse className='collapse__secondary' defaultOpen={otherCollapseState !== undefined ? otherCollapseState : false} hasErrors={isSaveClicked && !isEmpty(otherErrors)} headerSubtitles={<Authorization allow={isFieldAllowedToRead(attributes, LeaseAreasFieldPaths.OTHER_STATE)}>
            <Column>
              <StatusIndicator researchState={savedArea.other_state} stateOptions={constructabilityStateOptions} />
            </Column>
          </Authorization>} headerTitle={LeaseAreasFieldTitles.OTHER} onToggle={handleOtherCollapseToggle} enableUiDataEdit uiDataKey={getUiDataLeaseKey(LeaseAreasFieldPaths.OTHER)}>
        <Row>
          <Column small={6} medium={4} large={2}>
            <Authorization allow={isFieldAllowedToRead(attributes, LeaseAreasFieldPaths.OTHER_STATE)}>
              <FormField disableTouched={isSaveClicked} fieldAttributes={getFieldAttributes(attributes, LeaseAreasFieldPaths.OTHER_STATE)} name={`${field}.other_state`} overrideValues={{
              label: LeaseAreasFieldTitles.OTHER_STATE
            }} enableUiDataEdit uiDataKey={getUiDataLeaseKey(LeaseAreasFieldPaths.OTHER_STATE)} />
            </Authorization>
          </Column>
        </Row>

        <Authorization allow={isFieldAllowedToRead(attributes, LeaseConstructabilityDescriptionsFieldPaths.CONSTRUCTABILITY_DESCRIPTIONS)}>
          <FieldArray attributes={attributes} component={renderComments} isSaveClicked={isSaveClicked} name={`${field}.descriptionsOther`} usersPermissions={usersPermissions} />
        </Authorization>
      </Collapse>
    </Collapse>;
};

const formName = FormNames.LEASE_CONSTRUCTABILITY;
const selector = formValueSelector(formName);
export default connect((state, props) => {
  const id = selector(state, `${props.field}.id`);
  return {
    areaCollapseState: getCollapseStateByKey(state, `${ViewModes.EDIT}.${formName}.${id}.area`),
    areaId: id,
    attributes: getAttributes(state),
    constructabilityReportCollapseState: getCollapseStateByKey(state, `${ViewModes.EDIT}.${formName}.${id}.constructability_report`),
    currentLease: getCurrentLease(state),
    demolitionCollapseState: getCollapseStateByKey(state, `${ViewModes.EDIT}.${formName}.${id}.demolition`),
    otherCollapseState: getCollapseStateByKey(state, `${ViewModes.EDIT}.${formName}.${id}.other`),
    pollutedLandCollapseState: getCollapseStateByKey(state, `${ViewModes.EDIT}.${formName}.${id}.polluted_land`),
    preconstructionCollapseState: getCollapseStateByKey(state, `${ViewModes.EDIT}.${formName}.${id}.preconstruction`),
    usersPermissions: getUsersPermissions(state)
  };
}, {
  createLeaseAreaAttachment,
  deleteLeaseAreaAttachment,
  receiveCollapseStates
})(ConstructabilityItemEdit);