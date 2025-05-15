import React, { Fragment } from "react";
import { connect } from "react-redux";
import { formValueSelector } from "redux-form";
import { Row, Column } from "react-foundation";
import { ActionTypes, AppConsumer } from "@/app/AppContext";
import ActionButtonWrapper from "@/components/form/ActionButtonWrapper";
import AddFileButton from "@/components/form/AddFileButton";
import Authorization from "@/components/authorization/Authorization";
import BoxItem from "@/components/content/BoxItem";
import FileDownloadLink from "@/components/file/FileDownloadLink";
import FormFieldLegacy from "@/components/form/FormFieldLegacy";
import FormText from "@/components/form/FormText";
import FormTextTitle from "@/components/form/FormTextTitle";
import RemoveButton from "@/components/form/RemoveButton";
import SubTitle from "@/components/content/SubTitle";
import {
  createLeaseInspectionAttachment,
  deleteLeaseInspectionAttachment,
} from "@/leaseInspectionAttachment/actions";
import { ConfirmationModalTexts, FieldTypes, FormNames } from "@/enums";
import { ButtonColors } from "@/components/enums";
import {
  LeaseInspectionAttachmentsFieldPaths,
  LeaseInspectionAttachmentsFieldTitles,
  LeaseInspectionsFieldPaths,
  LeaseInspectionsFieldTitles,
} from "@/leases/enums";
import { UsersPermissions } from "@/usersPermissions/enums";
import { getContentInspections } from "@/leases/helpers";
import { getUiDataLeaseKey } from "@/uiData/helpers";
import { getUserFullName } from "@/users/helpers";
import {
  findItemById,
  formatDate,
  getFieldAttributes,
  hasPermissions,
  isFieldAllowedToRead,
} from "@/util/helpers";
import {
  getAttributes as getLeaseAttributes,
  getCurrentLease,
  getIsSaveClicked,
} from "@/leases/selectors";
import { getUsersPermissions } from "@/usersPermissions/selectors";
import type { Attributes } from "types";
import type { Lease } from "@/leases/types";
import type { UsersPermissions as UsersPermissionsType } from "@/usersPermissions/types";
type Props = {
  createLeaseInspectionAttachment: (...args: Array<any>) => any;
  currentLease: Lease;
  deleteLeaseInspectionAttachment: (...args: Array<any>) => any;
  field: any;
  inspectionId: number | null | undefined;
  isSaveClicked: boolean;
  leaseAttributes: Attributes;
  onRemove: (...args: Array<any>) => any;
  usersPermissions: UsersPermissionsType;
};

const InspectionItemEdit = ({
  createLeaseInspectionAttachment,
  currentLease,
  deleteLeaseInspectionAttachment,
  field,
  inspectionId,
  isSaveClicked,
  leaseAttributes,
  onRemove,
  usersPermissions,
}: Props) => {
  const handleAddInspectionAttachment = (e: any) => {
    if (!inspectionId) return;
    createLeaseInspectionAttachment({
      lease: currentLease.id,
      data: {
        inspection: inspectionId,
      },
      file: e.target.files[0],
    });
  };

  const handleDeleteInspectionAttachment = (fileId: number) => {
    deleteLeaseInspectionAttachment({
      id: fileId,
      lease: currentLease.id,
    });
  };

  const inspections = getContentInspections(currentLease);
  const inspection = inspectionId
    ? findItemById(inspections, inspectionId)
    : null;
  const inspectionAttachments = inspection ? inspection.attachments : [];
  return (
    <AppConsumer>
      {({ dispatch }) => {
        return (
          <BoxItem className="no-border-on-first-child">
            <ActionButtonWrapper>
              <Authorization
                allow={hasPermissions(
                  usersPermissions,
                  UsersPermissions.DELETE_INSPECTION,
                )}
              >
                <RemoveButton onClick={onRemove} title="Poista tarkastus" />
              </Authorization>
            </ActionButtonWrapper>
            <Row>
              <Column small={6} medium={4} large={2}>
                <Authorization
                  allow={isFieldAllowedToRead(
                    leaseAttributes,
                    LeaseInspectionsFieldPaths.INSPECTOR,
                  )}
                >
                  <FormFieldLegacy
                    disableTouched={isSaveClicked}
                    fieldAttributes={getFieldAttributes(
                      leaseAttributes,
                      LeaseInspectionsFieldPaths.INSPECTOR,
                    )}
                    name={`${field}.inspector`}
                    overrideValues={{
                      label: LeaseInspectionsFieldTitles.INSPECTOR,
                    }}
                    enableUiDataEdit
                    uiDataKey={getUiDataLeaseKey(
                      LeaseInspectionsFieldPaths.INSPECTOR,
                    )}
                  />
                </Authorization>
              </Column>
              <Column small={6} medium={4} large={2}>
                <Authorization
                  allow={isFieldAllowedToRead(
                    leaseAttributes,
                    LeaseInspectionsFieldPaths.SUPERVISION_DATE,
                  )}
                >
                  <FormFieldLegacy
                    disableTouched={isSaveClicked}
                    fieldAttributes={getFieldAttributes(
                      leaseAttributes,
                      LeaseInspectionsFieldPaths.SUPERVISION_DATE,
                    )}
                    name={`${field}.supervision_date`}
                    overrideValues={{
                      label: LeaseInspectionsFieldTitles.SUPERVISION_DATE,
                    }}
                    enableUiDataEdit
                    uiDataKey={getUiDataLeaseKey(
                      LeaseInspectionsFieldPaths.SUPERVISION_DATE,
                    )}
                  />
                </Authorization>
              </Column>
              <Column small={6} medium={4} large={2}>
                <Authorization
                  allow={isFieldAllowedToRead(
                    leaseAttributes,
                    LeaseInspectionsFieldPaths.SUPERVISED_DATE,
                  )}
                >
                  <FormFieldLegacy
                    disableTouched={isSaveClicked}
                    fieldAttributes={getFieldAttributes(
                      leaseAttributes,
                      LeaseInspectionsFieldPaths.SUPERVISED_DATE,
                    )}
                    name={`${field}.supervised_date`}
                    overrideValues={{
                      label: LeaseInspectionsFieldTitles.SUPERVISED_DATE,
                    }}
                    enableUiDataEdit
                    uiDataKey={getUiDataLeaseKey(
                      LeaseInspectionsFieldPaths.SUPERVISED_DATE,
                    )}
                  />
                </Authorization>
              </Column>
              <Column small={6} medium={12} large={6}>
                <Authorization
                  allow={isFieldAllowedToRead(
                    leaseAttributes,
                    LeaseInspectionsFieldPaths.DESCRIPTION,
                  )}
                >
                  <FormFieldLegacy
                    disableTouched={isSaveClicked}
                    fieldAttributes={getFieldAttributes(
                      leaseAttributes,
                      LeaseInspectionsFieldPaths.DESCRIPTION,
                    )}
                    name={`${field}.description`}
                    enableUiDataEdit
                    tooltipStyle={{
                      right: 25,
                    }}
                    uiDataKey={getUiDataLeaseKey(
                      LeaseInspectionsFieldPaths.DESCRIPTION,
                    )}
                    overrideValues={{
                      fieldType: FieldTypes.TEXTAREA,
                      label: LeaseInspectionsFieldTitles.DESCRIPTION,
                    }}
                  />
                </Authorization>
              </Column>
            </Row>
            {inspectionId && (
              <Authorization
                allow={isFieldAllowedToRead(
                  leaseAttributes,
                  LeaseInspectionAttachmentsFieldPaths.ATTACHMENTS,
                )}
              >
                <>
                  <SubTitle
                    enableUiDataEdit
                    uiDataKey={getUiDataLeaseKey(
                      LeaseInspectionAttachmentsFieldPaths.ATTACHMENTS,
                    )}
                  >
                    {LeaseInspectionAttachmentsFieldTitles.ATTACHMENTS}
                  </SubTitle>

                  {!hasPermissions(
                    usersPermissions,
                    UsersPermissions.ADD_INSPECTIONATTACHMENT,
                  ) &&
                    !inspectionAttachments.length && (
                      <FormText>Ei tiedostoja</FormText>
                    )}

                  {!!inspectionAttachments.length && (
                    <Fragment>
                      <Row>
                        <Column small={3} large={4}>
                          <Authorization
                            allow={isFieldAllowedToRead(
                              leaseAttributes,
                              LeaseInspectionAttachmentsFieldPaths.FILE,
                            )}
                          >
                            <FormTextTitle
                              enableUiDataEdit
                              uiDataKey={getUiDataLeaseKey(
                                LeaseInspectionAttachmentsFieldPaths.FILE,
                              )}
                            >
                              {LeaseInspectionAttachmentsFieldTitles.FILE}
                            </FormTextTitle>
                          </Authorization>
                        </Column>
                        <Column small={3} large={2}>
                          <Authorization
                            allow={isFieldAllowedToRead(
                              leaseAttributes,
                              LeaseInspectionAttachmentsFieldPaths.UPLOADED_AT,
                            )}
                          >
                            <FormTextTitle
                              enableUiDataEdit
                              uiDataKey={getUiDataLeaseKey(
                                LeaseInspectionAttachmentsFieldPaths.UPLOADED_AT,
                              )}
                            >
                              {
                                LeaseInspectionAttachmentsFieldTitles.UPLOADED_AT
                              }
                            </FormTextTitle>
                          </Authorization>
                        </Column>
                        <Column small={3} large={2}>
                          <FormTextTitle
                            enableUiDataEdit
                            uiDataKey={getUiDataLeaseKey(
                              LeaseInspectionAttachmentsFieldPaths.UPLOADER,
                            )}
                          >
                            {LeaseInspectionAttachmentsFieldTitles.UPLOADER}
                          </FormTextTitle>
                        </Column>
                      </Row>
                      {inspectionAttachments.map((file, index) => {
                        const handleRemove = () => {
                          dispatch({
                            type: ActionTypes.SHOW_CONFIRMATION_MODAL,
                            confirmationFunction: () => {
                              handleDeleteInspectionAttachment(file.id);
                            },
                            confirmationModalButtonClassName:
                              ButtonColors.ALERT,
                            confirmationModalButtonText:
                              ConfirmationModalTexts.DELETE_ATTACHMENT.BUTTON,
                            confirmationModalLabel:
                              ConfirmationModalTexts.DELETE_ATTACHMENT.LABEL,
                            confirmationModalTitle:
                              ConfirmationModalTexts.DELETE_ATTACHMENT.TITLE,
                          });
                        };

                        return (
                          <Row key={index}>
                            <Column small={3} large={4}>
                              <Authorization
                                allow={isFieldAllowedToRead(
                                  leaseAttributes,
                                  LeaseInspectionAttachmentsFieldPaths.FILE,
                                )}
                              >
                                <FileDownloadLink
                                  fileUrl={file.file}
                                  label={file.filename}
                                />
                              </Authorization>
                            </Column>
                            <Column small={3} large={2}>
                              <Authorization
                                allow={isFieldAllowedToRead(
                                  leaseAttributes,
                                  LeaseInspectionAttachmentsFieldPaths.UPLOADED_AT,
                                )}
                              >
                                <FormText>
                                  {formatDate(file.uploaded_at) || "-"}
                                </FormText>
                              </Authorization>
                            </Column>
                            <Column small={3} large={2}>
                              <FormText>
                                {getUserFullName(file.uploader) || "-"}
                              </FormText>
                            </Column>
                            <Column small={3} large={2}>
                              <Authorization
                                allow={hasPermissions(
                                  usersPermissions,
                                  UsersPermissions.DELETE_INSPECTIONATTACHMENT,
                                )}
                              >
                                <RemoveButton
                                  className="third-level"
                                  onClick={handleRemove}
                                  style={{
                                    right: 12,
                                    height: "unset",
                                  }}
                                  title="Poista liitetiedosto"
                                />
                              </Authorization>
                            </Column>
                          </Row>
                        );
                      })}
                    </Fragment>
                  )}

                  <Authorization
                    allow={hasPermissions(
                      usersPermissions,
                      UsersPermissions.ADD_INSPECTIONATTACHMENT,
                    )}
                  >
                    <AddFileButton
                      label="Lisää tiedosto"
                      name={`add_inspection_attachment_button_${inspectionId}`}
                      onChange={handleAddInspectionAttachment}
                    />
                  </Authorization>
                </>
              </Authorization>
            )}
          </BoxItem>
        );
      }}
    </AppConsumer>
  );
};

const selector = formValueSelector(FormNames.LEASE_INSPECTIONS);
export default connect(
  (state, props) => {
    return {
      currentLease: getCurrentLease(state),
      inspectionId: selector(state, `${props.field}.id`),
      isSaveClicked: getIsSaveClicked(state),
      leaseAttributes: getLeaseAttributes(state),
      usersPermissions: getUsersPermissions(state),
    };
  },
  {
    createLeaseInspectionAttachment,
    deleteLeaseInspectionAttachment,
  },
)(InspectionItemEdit);
